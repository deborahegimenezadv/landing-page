# Animações cinematográficas (motion + gsap)

## Contexto

O site (Next.js/Tailwind, landing page única para o escritório Dantas
Gimenez & Machado) está com o conteúdo, responsividade e SEO
concluídos, sem nenhuma biblioteca de animação instalada ainda. Este
documento define a segunda fase: um loader de abertura cinematográfico
e um sistema de revelação no scroll em todo o site, pensados para
"vender o site" sem perder a seriedade de um escritório de advocacia.

## Objetivo

- Um momento de impacto único na abertura (loader com a balança da
  justiça se desenhando) que revela o site.
- Um sistema de scroll reveal consistente, elegante e contido no
  restante das seções — nada de parallax ou pin de seção.
- Respeitar `prefers-reduced-motion` e não travar a navegação de quem
  quer pular a intro.

## Decisões já validadas com o usuário

- Símbolo do loader: balança da justiça estilizada, traço fino dourado.
- Frequência: toca em **todo carregamento** da página (site é
  single-page, sem navegação client-side entre rotas — "todo
  carregamento" = todo mount do componente raiz). Por isso a intro
  precisa ser curta (~2s) e sempre pulável.
- Intensidade do resto do site: elegante e contido. O loader é o único
  momento "grande"; o restante é fade + leve deslocamento, sem
  parallax.
- Divisão de bibliotecas: `motion` (react) para tudo declarativo
  ligado ao scroll; `gsap` só para a timeline imperativa do loader.

## Arquitetura

### Novos componentes

- `components/intro/IntroLoader.tsx` (client) — overlay fullscreen,
  SVG da balança, timeline GSAP, botão/link "Pular", trava o scroll do
  `body` enquanto ativo, chama `onComplete()` ao terminar ou ser
  pulado.
- `components/intro/IntroProvider.tsx` (client) — Context que expõe
  `introDone: boolean`. Renderiza `IntroLoader` uma vez, e quando ele
  completa (ou de cara, se `prefers-reduced-motion`), marca
  `introDone = true`. Envolve o conteúdo da página em `app/page.tsx`.
- `components/motion/Reveal.tsx` (client) — wrapper reutilizável em
  cima de `motion.div` com variants padrão (`hidden`/`visible`: fade +
  `translateY(24px)`, easing `[0.16,0.84,0.44,1]`, 0.6s), disparado via
  `whileInView` (`once: true`, `amount: 0.2`). Props: `delay`,
  `as` (tag), `stagger` (quando é um container de itens).
- `components/svg/ScaleIcon.tsx` — o SVG de linha da balança da
  justiça (base, coluna, braço, dois pratos), usado pelo
  `IntroLoader`.

### Componentes existentes que mudam

- `app/page.tsx` — envolve as seções com `<IntroProvider>` e usa
  `<Reveal>` nos títulos/cards de `Areas`, `Sobre`, `Advogados`, `Faq`,
  `Contato` (import feito dentro de cada seção, não em `page.tsx`,
  para manter a separação de responsabilidades já existente).
- `components/sections/Hero.tsx` — passa a usar `introDone` (via
  `useIntro()` hook do Context) para disparar a entrada do
  título/parágrafo/botões (stagger) só depois que o loader termina.
  Formas decorativas ganham float sutil contínuo (`animate` com
  `repeat: Infinity, repeatType: "mirror"`); a linha dourada da tag
  ganha um "draw" de largura.
- `components/ui/WhatsAppButton.tsx` — ganha um anel de pulso sutil
  (elemento extra atrás do botão, scale+opacity em loop).

### Fluxo de dados

`IntroProvider` é o único client component com estado global de
animação; tudo mais consome `useIntro()` (hook simples de contexto) ou
funciona de forma independente via `whileInView` do `motion` (que já
lida com o próprio estado de visibilidade, sem precisar do contexto).

## Loader — coreografia detalhada

1. **Frame 0**: overlay `fixed inset-0 z-[60] bg-navy`, `body` com
   `overflow: hidden`. SVG da balança visível com os traços "vazios"
   (`stroke-dashoffset` = comprimento total de cada path).
2. **0 → ~1.2s**: GSAP timeline anima `strokeDashoffset` de cada parte
   do SVG (coluna, braço, prato esquerdo, prato direito) até 0, em
   sequência com pequena sobreposição (não tudo de uma vez — dá
   sensação de traço "caligráfico").
3. **~1.2 → 1.4s**: pequeno `scale` (1 → 1.04 → 1) + glow (drop-shadow
   dourado) no ícone completo, como um "selo".
4. **~1.4 → 2.0s**: overlay inteiro em `opacity` 1→0 e `scale` 1→1.03,
   `pointer-events: none` assim que a transição começa. Ao terminar,
   remove o overlay do DOM e libera o scroll do `body`.
5. **Pular**: clique em qualquer ponto do overlay ou no link "Pular →"
   (canto inferior direito, `text-xs`, sempre visível) chama
   `timeline.progress(1)` — pula direto pro estado final e dispara o
   mesmo `onComplete`.
6. **`prefers-reduced-motion`**: pula a timeline inteira; overlay some
   com um fade simples de 200ms (sem desenhar o traço), `introDone`
   vira `true` quase imediato.

## Scroll reveal — regras gerais

- Uma única variante padrão (`Reveal`) usada em todo o site: fade +
  `translateY(24px→0)`, 0.6s, easing customizado, dispara uma vez
  (`viewport once: true`) quando ~20% do elemento entra na tela.
- Containers com múltiplos itens (cards de Área, cards de Advogado,
  itens de Valor, itens de FAQ) usam `stagger` de ~0.1s entre filhos.
- Nada de parallax, nada de pin de seção, nada de scroll-linked
  transforms fora do Hero (que já tem tratamento próprio, não ligado
  ao scroll).

## Acessibilidade e performance

- `useReducedMotion()` do `motion` desliga: floats contínuos, pulso do
  WhatsApp, stagger (vira fade simples) — em qualquer componente que
  anima em loop.
- Loader verifica `window.matchMedia('(prefers-reduced-motion: reduce)')`
  antes de montar a timeline GSAP.
- `viewport once: true` em todo `whileInView` — anima uma vez, não
  reanima ao rolar pra cima e descer de novo (evita distração/CLS
  repetido).
- SVG do loader é leve (poucos paths, sem imagens), sem impacto real
  de bundle; `gsap` core (sem plugins pagos) e `motion` são as duas
  únicas dependências novas.

## Testes / verificação

- Visual: Playwright headless, viewport mobile e desktop, screenshot
  em cada etapa-chave do loader (traço parcial, selo, revelado) e do
  scroll reveal de cada seção.
- Funcional: clique em "Pular" encerra a timeline; simular
  `prefers-reduced-motion: reduce` via `page.emulateMedia` e confirmar
  que o loader não desenha e o site aparece quase instantâneo.
- Console limpo (sem erros) em todos os cenários acima.

## Fora de escopo (não fazer nesta fase)

- Parallax ou scroll-pin em qualquer seção.
- Loader com lógica de "só na primeira visita" (sessionStorage) — foi
  decisão explícita tocar em todo carregamento.
- Animações em `Navbar` além do que já existe (troca de fundo no
  scroll continua igual, é funcional, não decorativa).

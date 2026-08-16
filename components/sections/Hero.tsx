import { whatsappLink } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:pb-[100px] lg:pt-[140px]"
    >
      <div className="pointer-events-none absolute -right-[60px] -top-[60px] hidden h-[260px] w-[260px] rotate-[12deg] border border-gold/35 sm:block" />
      <div className="pointer-events-none absolute bottom-10 right-[140px] hidden h-[90px] w-[90px] bg-gold/15 sm:block" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <div className="max-w-[720px]">
          <div className="mb-6 flex items-center gap-3 sm:mb-7">
            <span className="h-px w-16 bg-gold" />
            <span className="text-xs font-semibold tracking-[0.24em] text-text-gold-soft">
              ADVOCACIA
            </span>
          </div>
          <h1 className="mb-5 text-[32px] font-bold leading-[1.2] text-white sm:mb-[26px] sm:text-[40px] lg:text-[52px] lg:leading-[1.15]">
            Orientação jurídica objetiva em Previdenciário, Tributário e
            Civil.
          </h1>
          <p className="mb-8 max-w-[560px] text-base font-light leading-[1.7] text-text-soft sm:mb-10 sm:text-[17px]">
            Três áreas, três advogados responsáveis. Cada caso é conduzido
            diretamente por quem responde por aquela área — do primeiro
            contato à solução.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener"
              className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-center text-sm font-semibold tracking-[0.02em] text-white transition-all hover:-translate-y-0.5 hover:bg-gold-dark"
            >
              Falar no WhatsApp
            </a>
            <a
              href="#areas"
              className="inline-block rounded-[3px] border border-white/30 px-[30px] py-4 text-center text-sm font-semibold text-white transition-colors hover:border-gold hover:text-text-gold-soft"
            >
              Conhecer as áreas
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex">
        <span className="h-[34px] w-px bg-white/40" />
      </div>
    </section>
  );
}

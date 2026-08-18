import { values, type Value } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CinematicVideo } from "@/components/motion/CinematicVideo";

function ValueItem({ value }: { value: Value }) {
  return (
    <div className="flex items-start gap-5 border-t border-[#d8c9a6]/70 pt-5">
      <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-[#d8c9a6] text-[13px] font-bold text-gold">
        {value.n}
      </span>
      <div>
        <h4 className="mb-1.5 text-base font-bold">{value.title}</h4>
        <p className="text-sm leading-[1.6] text-muted">
          {value.description}
        </p>
      </div>
    </div>
  );
}

export function Sobre() {
  return (
    <section
      id="escritorio"
      className="bg-cream px-5 py-16 sm:px-8 sm:py-24 lg:py-[104px]"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="max-w-[510px]">
            <span className="text-xs font-bold tracking-[0.24em] text-gold">
              O ESCRITÓRIO
            </span>
            <h2 className="mb-6 mt-3.5 text-[26px] font-bold leading-[1.3] sm:text-[34px]">
              Uma estrutura, três áreas de atuação.
            </h2>
            <p className="mb-5 text-base leading-[1.8] text-muted-dark">
              O Dantas Gimenez &amp; Machado reúne advocacia previdenciária,
              tributária e civil sob uma mesma estrutura. Cada advogado conduz
              diretamente os casos de sua área, com atendimento técnico em
              todas as etapas do processo.
            </p>
            <p className="text-base leading-[1.8] text-muted-dark">
              O primeiro contato já é direcionado ao advogado responsável pela
              área correspondente ao caso.
            </p>
            <div className="mt-10 border-l border-gold pl-6 sm:mt-12">
              <p className="max-w-[380px] text-xl font-semibold leading-[1.35] text-navy sm:text-2xl">
                Cada caso tem um responsável. Cada decisão, um caminho claro.
              </p>
            </div>
          </Reveal>
          <div
            data-cinematic="office-frame"
            className="relative aspect-[5/4] overflow-hidden rounded-[4px] bg-navy shadow-[0_24px_60px_rgba(60,63,78,0.18)] lg:min-h-[480px] lg:aspect-auto"
          >
            <div data-cinematic="office-video" className="absolute inset-0">
              <CinematicVideo
                src="/escritorio.mp4"
                className="h-full w-full scale-110 object-cover opacity-85"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(35,37,48,0.72)_0%,transparent_52%,rgba(177,147,78,0.24)_100%)]" />
            <div className="pointer-events-none absolute inset-y-7 left-0 w-px bg-gold/80" />
            <span className="absolute bottom-5 left-6 text-[10px] font-semibold tracking-[0.23em] text-text-gold-soft">
              CAMPO GRANDE · MS
            </span>
          </div>
        </div>
        <div data-cinematic="office-values" className="mt-12 border-t border-[#d8c9a6]/70 pt-8 sm:mt-16 sm:pt-10">
          <Reveal stagger className="grid grid-cols-1 gap-x-14 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {values.map((value) => (
                <RevealItem key={value.n}>
                  <ValueItem value={value} />
                </RevealItem>
              ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

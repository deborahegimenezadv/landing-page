import { areas, type Area } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function AreaFeature({ area, index }: { area: Area; index: number }) {
  return (
    <article
      data-area-editorial
      className="grid grid-cols-1 gap-7 border-t border-line py-9 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(190px,0.58fr)_minmax(0,1.42fr)] lg:gap-16 lg:py-16"
    >
      <div className="flex items-start gap-4 lg:block">
        <span className="font-mono text-sm tracking-[0.16em] text-gold">
          0{index + 1}
        </span>
        <span className="pt-0.5 text-[11px] font-bold tracking-[0.2em] text-muted lg:mt-6 lg:block lg:pt-0">
          {area.tag}
        </span>
      </div>

      <div>
        <h3 className="max-w-[630px] text-[29px] font-bold leading-[1.16] text-ivory sm:text-[36px] lg:text-[42px]">
          {area.title}
        </h3>
        <p className="mt-5 max-w-[650px] text-[15px] leading-[1.8] text-muted sm:text-[17px]">
          {area.description}
        </p>

        <div className="mt-8 border-t border-line pt-6 sm:mt-10 sm:pt-7">
          <p className="text-[11px] font-bold tracking-[0.19em] text-text-gold-soft">
            O QUE ESSA ÁREA ABRANGE
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {area.topics.map((topic) => (
              <li key={topic} className="flex items-center gap-3 text-sm text-ivory">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={area.whatsapp}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-3 border-b border-gold pb-2 text-[13px] font-semibold text-ivory transition-colors hover:text-gold sm:mt-10"
        >
          <span>Falar com {area.lawyer}</span>
          <span className="text-gold" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export function Areas() {
  return (
    <section
      id="areas"
      className="bg-wine px-5 py-16 sm:px-8 sm:py-24 lg:py-[132px]"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <span className="text-xs font-bold tracking-[0.24em] text-gold">
          ÁREAS DE ATUAÇÃO
        </span>
        <h2 className="mt-3.5 max-w-[700px] text-[29px] font-bold leading-[1.2] text-ivory sm:text-4xl lg:text-[44px]">
          Orientação jurídica clara para decisões que pedem atenção técnica.
        </h2>
        <p className="mt-5 max-w-[570px] text-[15px] leading-[1.8] text-muted sm:text-base">
          Conheça os temas atendidos por cada área e fale diretamente com o
          advogado responsável pelo seu caso.
        </p>
      </Reveal>
      <div data-cinematic="areas-grid" className="relative mx-auto mt-10 max-w-[1180px] sm:mt-16">
        <span data-cinematic="areas-line" className="absolute -top-3 left-0 h-px w-0 bg-gold" aria-hidden="true" />
        <Reveal stagger>
          {areas.map((area, index) => (
            <RevealItem key={area.tag}>
              <AreaFeature area={area} index={index} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

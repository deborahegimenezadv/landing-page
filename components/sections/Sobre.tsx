import { values, type Value } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function ValueItem({ value }: { value: Value }) {
  return (
    <div className="flex items-start gap-5">
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
      className="bg-cream px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-18">
        <Reveal>
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
        </Reveal>
        <Reveal stagger className="flex flex-col gap-7">
          {values.map((value) => (
            <RevealItem key={value.n}>
              <ValueItem value={value} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

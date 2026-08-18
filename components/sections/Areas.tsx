import { Shield, Receipt, Scale } from "lucide-react";
import { areas, type Area } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

const icons = {
  shield: Shield,
  receipt: Receipt,
  scale: Scale,
} as const;

const iconColors: Record<Area["icon"], string> = {
  shield: "text-gold",
  receipt: "text-navy",
  scale: "text-gold",
};

function AreaIcon({ icon }: { icon: Area["icon"] }) {
  const Icon = icons[icon];
  return (
    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-cream">
      <Icon
        className={iconColors[icon]}
        size={24}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}

function AreaCard({ area }: { area: Area }) {
  return (
    <div className="rounded-[4px] border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_40px_rgba(60,63,78,0.08)] sm:p-10 sm:px-8">
      <AreaIcon icon={area.icon} />
      <span className="text-[11px] font-bold tracking-[0.18em] text-muted">
        {area.tag}
      </span>
      <h3 className="mb-4 mt-2.5 text-xl font-bold sm:text-[22px]">
        {area.title}
      </h3>
      <p className="mb-5 text-sm leading-[1.7] text-muted sm:text-[15px]">
        {area.description}
      </p>
      <a
        href={area.whatsapp}
        target="_blank"
        rel="noopener"
        className="flex items-center justify-between gap-3 border-t border-line pt-[18px] text-[13px] font-semibold text-navy transition-colors hover:text-gold"
      >
        <span>{area.lawyer}</span>
        <span className="whitespace-nowrap text-gold">WhatsApp →</span>
      </a>
    </div>
  );
}

export function Areas() {
  return (
    <section
      id="areas"
      className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <span className="text-xs font-bold tracking-[0.24em] text-gold">
          ÁREAS DE ATUAÇÃO
        </span>
        <h2 className="mt-3.5 max-w-[620px] text-[28px] font-bold leading-[1.25] sm:text-4xl">
          Cada advogado responde diretamente por sua área de atuação.
        </h2>
      </Reveal>
      <div data-cinematic="areas-grid" className="relative mx-auto mt-10 max-w-[1180px] sm:mt-14">
        <span data-cinematic="areas-line" className="absolute -top-3 left-0 h-px w-0 bg-gold" aria-hidden="true" />
        <Reveal stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
          {areas.map((area) => (
            <RevealItem key={area.tag}>
              <AreaCard area={area} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

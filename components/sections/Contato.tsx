import { contact, whatsappLink } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { CinematicVideo } from "@/components/motion/CinematicVideo";

export function Contato() {
  return (
    <section
      id="contato"
      data-cinematic="contact-section"
      className="relative overflow-hidden bg-navy px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div data-cinematic="contact-video" className="absolute inset-0">
        <CinematicVideo
          src="/cta.mp4"
          className="h-full w-full scale-105 object-cover opacity-55"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(40,42,54,0.97)_0%,rgba(44,46,58,0.9)_42%,rgba(44,46,58,0.62)_100%)]" />
      <Reveal className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
        <div className="max-w-[560px]">
          <span className="text-xs font-bold tracking-[0.24em] text-gold">
            LOCALIZAÇÃO E CONTATO
          </span>
          <h2 className="mb-7 mt-3.5 text-[26px] font-bold leading-[1.3] text-white sm:text-[32px]">
            Atendimento presencial e online.
          </h2>
          <div className="mb-9 flex flex-col gap-[18px]">
            <div className="text-[15px] leading-[1.7] text-text-soft">
              {contact.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
            <div className="text-[15px] text-text-soft">
              {contact.phone} · {contact.email}
            </div>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            data-cinematic="contact-cta"
            className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            Falar no WhatsApp
          </a>
        </div>
        <div className="hidden min-h-80 border-l border-gold/45 lg:block" aria-hidden="true" />
      </Reveal>
    </section>
  );
}

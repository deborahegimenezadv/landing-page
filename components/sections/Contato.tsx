import { contact, whatsappLink } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function Contato() {
  return (
    <section
      id="contato"
      className="bg-navy px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
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
            className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            Falar no WhatsApp
          </a>
        </div>
        <ImagePlaceholder
          label="mapa — inserir localização"
          rounded
          className="h-80 w-full"
        />
      </div>
    </section>
  );
}

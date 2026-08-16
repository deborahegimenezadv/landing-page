import { whatsappLink } from "@/lib/content";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-white transition-colors hover:bg-gold-dark sm:bottom-7 sm:right-7 sm:h-14 sm:w-14 sm:text-xl"
    >
      W
    </a>
  );
}

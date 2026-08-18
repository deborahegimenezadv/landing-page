import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { StructuredData } from "@/components/seo/StructuredData";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Hero } from "@/components/sections/Hero";
import { Areas } from "@/components/sections/Areas";
import { Sobre } from "@/components/sections/Sobre";
import { Advogados } from "@/components/sections/Advogados";
import { Faq } from "@/components/sections/Faq";
import { Contato } from "@/components/sections/Contato";
import { CinematicScroll } from "@/components/motion/CinematicScroll";

// Prevent a CDN from serving HTML from a previous deployment whose asset hashes
// no longer exist after the current build is released.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-white text-navy">
      <StructuredData />
      <IntroProvider>
        <Navbar />
        <CinematicScroll>
          <Hero />
          <Areas />
          <Sobre />
          <Advogados />
          <Faq />
          <Contato />
        </CinematicScroll>
        <Footer />
        <WhatsAppButton />
      </IntroProvider>
    </div>
  );
}

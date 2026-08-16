import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { StructuredData } from "@/components/seo/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Areas } from "@/components/sections/Areas";
import { Sobre } from "@/components/sections/Sobre";
import { Advogados } from "@/components/sections/Advogados";
import { Faq } from "@/components/sections/Faq";
import { Contato } from "@/components/sections/Contato";

export default function Home() {
  return (
    <div className="bg-white text-navy">
      <StructuredData />
      <Navbar />
      <Hero />
      <Areas />
      <Sobre />
      <Advogados />
      <Faq />
      <Contato />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

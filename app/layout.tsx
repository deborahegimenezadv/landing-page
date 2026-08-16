import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { siteName, siteUrl } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const description =
  "Orientação jurídica objetiva em Previdenciário, Tributário e Civil, em Campo Grande/MS. Três áreas, três advogados responsáveis.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "advogado Campo Grande",
    "advocacia Campo Grande MS",
    "advogado previdenciário Campo Grande",
    "advogado tributário Campo Grande",
    "advogado civil Campo Grande",
    "advogado INSS Campo Grande",
  ],
  authors: [{ name: siteName }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: siteName,
    description,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} antialiased`}>
      <body className="font-sans">
        {/*
          Failsafe for when JS fails to load/hydrate: the intro overlay and
          every motion-driven reveal wrapper render at opacity:0 in the
          server-rendered HTML and only become visible once client JS runs.
          This hides the intro overlay (identified by its `role="status"`
          attribute in IntroLoader) so the page isn't left permanently
          blocked by it. It does not force individual `motion.div` reveal
          wrappers to opacity:1 — Next.js/React don't emit a stable,
          reliable class on those we can target from static CSS.
        */}
        <noscript>
          <style>{`[role="status"] { display: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

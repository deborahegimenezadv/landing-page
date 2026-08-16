import { areas, contact, lawyers, siteName, siteUrl } from "@/lib/content";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteName,
    url: siteUrl,
    telephone: contact.phoneIntl,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      addressLocality: contact.city,
      addressRegion: contact.state,
      postalCode: contact.postalCode,
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "City",
      name: `${contact.city}, ${contact.state}`,
    },
    knowsAbout: areas.map((area) => area.title),
    employee: lawyers.map((lawyer) => ({
      "@type": "Person",
      name: lawyer.name,
      jobTitle: "Advogado(a)",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

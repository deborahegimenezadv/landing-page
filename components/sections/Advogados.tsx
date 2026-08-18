import Image from "next/image";
import { lawyers, type Lawyer } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div>
      {lawyer.photoSrc ? (
        <div
          data-cinematic="lawyer-photo"
          className="relative h-80 w-full overflow-hidden rounded-[3px]"
        >
          <Image
            src={lawyer.photoSrc}
            alt={lawyer.name}
            fill
            sizes="(min-width: 1180px) 372px, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div data-cinematic="lawyer-photo">
          <ImagePlaceholder
            label={lawyer.photoLabel}
            className="h-80 w-full"
          />
        </div>
      )}
      <div className="pt-[22px]">
        <h3 className="mb-1 text-[19px] font-bold">{lawyer.name}</h3>
        <span className="text-[13px] font-semibold tracking-[0.04em] text-gold">
          {lawyer.area}
        </span>
        <p className="my-3.5 text-sm leading-[1.7] text-muted">
          {lawyer.bio}
        </p>
        <span className="text-xs tracking-[0.03em] text-muted-light">
          {lawyer.oab}
        </span>
      </div>
    </div>
  );
}

export function Advogados() {
  return (
    <section
      id="advogados"
      className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <span className="text-xs font-bold tracking-[0.24em] text-gold">
          EQUIPE
        </span>
        <h2 className="mt-3.5 max-w-[620px] text-[28px] font-bold leading-[1.25] sm:text-4xl">
          Advogados responsáveis por área.
        </h2>
      </Reveal>
      <Reveal
        stagger
        className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        {lawyers.map((lawyer) => (
          <RevealItem key={lawyer.name}>
            <LawyerCard lawyer={lawyer} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScaleIcon } from "@/components/svg/ScaleIcon";

type IntroLoaderProps = {
  onComplete: () => void;
};

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [skipped, setSkipped] = useState(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    if (!overlay || !svg) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = previousOverflow;
      onComplete();
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(overlay, { opacity: 0, duration: 0.2, ease: "power1.out" });
      timelineRef.current = tl;
      return () => {
        tl.kill();
        if (!finished) {
          document.body.style.overflow = previousOverflow;
        }
      };
    }

    const strokes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("[data-draw]"),
    );
    strokes.forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
    });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(strokes, {
      strokeDashoffset: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.inOut",
    })
      .to(svg, {
        scale: 1.04,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      })
      .to(overlay, {
        opacity: 0,
        scale: 1.03,
        duration: 0.6,
        ease: "power2.inOut",
        pointerEvents: "none",
      });

    timelineRef.current = tl;

    return () => {
      tl.kill();
      if (!finished) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    timelineRef.current?.progress(1);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleSkip}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy"
    >
      <span className="sr-only">Carregando o site</span>
      <ScaleIcon ref={svgRef} className="h-24 w-24 text-gold" />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleSkip();
        }}
        aria-label="Pular introdução"
        className="absolute bottom-6 right-6 text-xs font-medium tracking-[0.08em] text-text-soft transition-colors hover:text-gold"
      >
        Pular →
      </button>
    </div>
  );
}

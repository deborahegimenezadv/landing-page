"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";

type CinematicBackdropProps = {
  active: boolean;
};

const particles = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 61 + 7) % 100}%`,
  size: index % 9 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
  opacity: index % 8 === 0 ? 0.78 : index % 3 === 0 ? 0.48 : 0.28,
  drift: (index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 8),
  delay: (index % 7) * 0.23,
}));

export function CinematicBackdrop({ active }: CinematicBackdropProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !active || prefersReducedMotion) return;

    const context = gsap.context(() => {
      const beams = gsap.utils.toArray<HTMLElement>("[data-hero-beam]");
      const dust = gsap.utils.toArray<HTMLElement>("[data-hero-dust]");
      const glows = gsap.utils.toArray<HTMLElement>("[data-hero-glow]");

      gsap.set(beams, { opacity: 0, transformOrigin: "50% 100%" });
      gsap.set(dust, { opacity: 0, scale: 0.5 });
      gsap.set(glows, { opacity: 0 });

      const opening = gsap.timeline();
      opening
        .to(glows, { opacity: 1, duration: 1.8, stagger: 0.18, ease: "power2.out" })
        .to(beams, { opacity: (_, target) => Number(target.dataset.heroBeamOpacity), duration: 2.4, stagger: 0.16, ease: "power3.out" }, 0.12)
        .to(dust, { opacity: (_, target) => Number(target.dataset.heroDustOpacity), scale: 1, duration: 1.2, stagger: { each: 0.025, from: "random" }, ease: "power2.out" }, 0.5);

      beams.forEach((beam, index) => {
        gsap.to(beam, {
          xPercent: index % 2 === 0 ? 9 : -7,
          rotation: index % 2 === 0 ? "+=1.2" : "-=1",
          duration: 9 + index * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      dust.forEach((particle, index) => {
        const data = particles[index];
        gsap.to(particle, {
          x: data.drift,
          y: 86 + (index % 6) * 17,
          rotation: data.drift * 0.35,
          duration: 7 + (index % 8) * 1.15,
          delay: data.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(particle, {
          opacity: Math.min(data.opacity + 0.24, 1),
          duration: 1.6 + (index % 4) * 0.35,
          delay: data.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, scene);

    return () => context.revert();
  }, [active, prefersReducedMotion]);

  return (
    <div ref={sceneRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div data-hero-glow className="absolute -right-[14%] top-[10%] h-[70%] w-[58%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(202,170,104,0.18),rgba(177,147,78,0.04)_42%,transparent_70%)] blur-3xl" />
      <div data-hero-glow className="absolute -left-[22%] bottom-[-42%] h-[74%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(128,109,72,0.16),transparent_68%)] blur-3xl" />

      <div data-hero-beam data-hero-beam-opacity="0.32" className="absolute -right-[18%] -top-[38%] h-[150%] w-[26%] rotate-[22deg] bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 blur-[2px]" />
      <div data-hero-beam data-hero-beam-opacity="0.2" className="absolute right-[4%] -top-[42%] h-[162%] w-[17%] rotate-[14deg] bg-gradient-to-b from-gold/0 via-[#f1dfad]/20 to-gold/0 blur-[8px]" />
      <div data-hero-beam data-hero-beam-opacity="0.14" className="absolute left-[38%] -top-[54%] h-[156%] w-[20%] rotate-[29deg] bg-gradient-to-b from-gold/0 via-gold/15 to-gold/0 blur-[10px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_44%,transparent_0%,rgba(60,63,78,0.16)_40%,rgba(36,38,48,0.62)_100%)]" />

      <div className="absolute inset-0 hidden sm:block">
        {particles.map((particle) => (
          <span
            key={particle.id}
            data-hero-dust
            data-hero-dust-opacity={particle.opacity}
            className="absolute rounded-full bg-[#f4d991] shadow-[0_0_12px_rgba(238,196,101,0.72)]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}

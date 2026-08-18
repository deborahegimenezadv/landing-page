"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { whatsappLink } from "@/lib/content";
import { useIntro } from "@/components/intro/IntroProvider";
import { CinematicBackdrop } from "@/components/hero/CinematicBackdrop";
import { CinematicVideo } from "@/components/motion/CinematicVideo";

export function Hero() {
  const introDone = useIntro();
  const prefersReducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || !introDone) return;

    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
      const line = content.querySelector<HTMLElement>("[data-hero-line]");

      if (prefersReducedMotion) {
        gsap.set(elements, { autoAlpha: 1, clearProps: "transform,filter" });
        gsap.set(line, { width: 64 });
        return;
      }

      gsap.set(elements, { autoAlpha: 0, y: 28, filter: "blur(10px)" });
      gsap.set(line, { width: 0 });
      gsap.timeline()
        .to(line, { width: 64, duration: 0.8, ease: "power3.out" })
        .to(elements, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.14,
          ease: "power4.out",
        }, 0.16);
    }, content);

    return () => context.revert();
  }, [introDone, prefersReducedMotion]);

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:pb-[100px] lg:pt-[140px]"
    >
      <div
        data-cinematic="hero-video"
        className="absolute inset-0 overflow-hidden bg-navy"
      >
        <CinematicVideo
          src="/hero.mp4"
          priority
          className="h-full w-full scale-105 object-cover opacity-75"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(40,42,54,0.95)_0%,rgba(50,53,66,0.78)_42%,rgba(44,46,58,0.5)_72%,rgba(37,39,49,0.72)_100%)]" />
      <CinematicBackdrop active={introDone} />

      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <div ref={contentRef} className="max-w-[720px]">
          <div data-hero-reveal className="mb-6 flex items-center gap-3 sm:mb-7">
            <span data-hero-line className="h-px bg-gold" />
            <span className="text-xs font-semibold tracking-[0.24em] text-text-gold-soft">
              ADVOCACIA
            </span>
          </div>
          <h1
            data-hero-reveal
            className="mb-5 text-[32px] font-bold leading-[1.2] text-white sm:mb-[26px] sm:text-[40px] lg:text-[52px] lg:leading-[1.15]"
          >
            Orientação jurídica objetiva em Previdenciário, Tributário e
            Civil.
          </h1>
          <p
            data-hero-reveal
            className="mb-8 max-w-[560px] text-base font-light leading-[1.7] text-text-soft sm:mb-10 sm:text-[17px]"
          >
            Três áreas, três advogados responsáveis. Cada caso é conduzido
            diretamente por quem responde por aquela área — do primeiro
            contato à solução.
          </p>
          <div
            data-hero-reveal
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener"
              className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-center text-sm font-semibold tracking-[0.02em] text-white transition-all hover:-translate-y-0.5 hover:bg-gold-dark"
            >
              Falar no WhatsApp
            </a>
            <a
              href="#areas"
              className="inline-block rounded-[3px] border border-white/30 px-[30px] py-4 text-center text-sm font-semibold text-white transition-colors hover:border-gold hover:text-text-gold-soft"
            >
              Conhecer as áreas
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex">
        <span
          className="h-[34px] w-px bg-white/40"
        />
      </div>
    </section>
  );
}

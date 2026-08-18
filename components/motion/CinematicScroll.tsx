"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

type CinematicScrollProps = {
  children: ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

export function CinematicScroll({ children }: CinematicScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion || window.innerWidth < 768) return;

    const context = gsap.context(() => {
      const select = <T extends Element>(selector: string) =>
        root.querySelector<T>(selector);

      const heroVideo = select<HTMLElement>("[data-cinematic='hero-video']");
      if (heroVideo) {
        gsap.to(heroVideo, {
          yPercent: 8,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: "#topo",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const areasGrid = select<HTMLElement>("[data-cinematic='areas-grid']");
      const areasLine = select<HTMLElement>("[data-cinematic='areas-line']");
      if (areasGrid && areasLine) {
        gsap.to(areasLine, {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: areasGrid,
            start: "top 78%",
            end: "top 35%",
            scrub: true,
          },
        });
      }

      const officeFrame = select<HTMLElement>("[data-cinematic='office-frame']");
      const officeVideo = select<HTMLElement>("[data-cinematic='office-video']");
      const officeValues = select<HTMLElement>("[data-cinematic='office-values']");
      if (officeFrame) {
        gsap.fromTo(
          officeFrame,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.35,
            ease: "power4.out",
            scrollTrigger: { trigger: officeFrame, start: "top 78%", once: true },
          },
        );
      }
      if (officeVideo) {
        gsap.to(officeVideo, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: officeVideo,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (officeValues) {
        gsap.from(officeValues, {
          y: 34,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: officeValues, start: "top 80%", once: true },
        });
      }

      const lawyerPhotos = gsap.utils.toArray<HTMLElement>(
        "[data-cinematic='lawyer-photo']",
        root,
      );
      lawyerPhotos.forEach((photo) => {
        gsap.to(photo, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: photo,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const faqList = select<HTMLElement>("[data-cinematic='faq-list']");
      if (faqList) {
        gsap.fromTo(
          faqList,
          { borderTopColor: "rgba(177, 147, 78, 0)" },
          {
            borderTopColor: "rgba(177, 147, 78, 0.85)",
            borderTopWidth: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: faqList, start: "top 78%", once: true },
          },
        );
      }

      const contactSection = select<HTMLElement>("[data-cinematic='contact-section']");
      const contactVideo = select<HTMLElement>("[data-cinematic='contact-video']");
      const contactCta = select<HTMLElement>("[data-cinematic='contact-cta']");
      if (contactSection && contactVideo) {
        gsap.fromTo(
          contactVideo,
          { opacity: 0.22, scale: 1.08 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: contactSection,
              start: "top 86%",
              end: "top 34%",
              scrub: true,
            },
          },
        );
      }
      if (contactCta) {
        gsap.from(contactCta, {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: contactCta, start: "top 88%", once: true },
        });
      }
    }, root);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return <div ref={rootRef}>{children}</div>;
}

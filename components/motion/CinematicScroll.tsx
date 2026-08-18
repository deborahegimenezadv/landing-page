"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useIntro } from "@/components/intro/IntroProvider";

type CinematicScrollProps = {
  children: ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

export function CinematicScroll({ children }: CinematicScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const introDone = useIntro();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !introDone || prefersReducedMotion || window.innerWidth < 768) {
      return;
    }

    let removeMetadataListener: () => void = () => {};
    const context = gsap.context(() => {
      const select = <T extends Element>(selector: string) =>
        root.querySelector<T>(selector);

      const hero = select<HTMLElement>("#topo");
      const heroVideo = select<HTMLElement>("[data-cinematic='hero-video']");
      const heroScenes = gsap.utils.toArray<HTMLElement>(
        "[data-hero-scene]",
        root,
      );
      if (hero && heroVideo && heroScenes.length === 3) {
        const media = heroVideo.querySelector<HTMLVideoElement>("video");
        const [opening, clarity, commitment] = heroScenes;
        const heroIntro = select<HTMLElement>("[data-hero-intro]");
        const heroActions = select<HTMLElement>("[data-hero-actions]");

        gsap.set(opening, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        gsap.set([clarity, commitment], {
          autoAlpha: 0,
          y: 42,
          filter: "blur(12px)",
        });
        if (heroActions) {
          gsap.set(heroActions, { autoAlpha: 0, y: 18 });
        }

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=160%",
            pin: true,
            anticipatePin: 1,
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        heroTimeline
          .to(heroVideo, { scale: 1.1, yPercent: -2, duration: 2.4, ease: "none" }, 0)
          .to(heroIntro, { autoAlpha: 0, y: -12, duration: 0.2 }, 0.38)
          .to(opening, { autoAlpha: 0, y: -30, filter: "blur(8px)", duration: 0.3 }, 0.44)
          .to(clarity, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, 0.57)
          .to(clarity, { autoAlpha: 0, y: -30, filter: "blur(8px)", duration: 0.3 }, 1.18)
          .to(commitment, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.34 }, 1.34);

        if (heroActions) {
          heroTimeline.to(
            heroActions,
            { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" },
            1.62,
          );
        }

        if (media) {
          const syncVideo = () => {
            if (!Number.isFinite(media.duration)) return;

            const playback = { time: 0 };
            heroTimeline.to(playback, {
              time: Math.max(media.duration - 0.08, 0),
              duration: 2.4,
              ease: "none",
              onUpdate: () => {
                media.currentTime = playback.time;
              },
            }, 0);

            ScrollTrigger.refresh();
          };

          if (media.readyState >= HTMLMediaElement.HAVE_METADATA) {
            syncVideo();
          } else {
            media.addEventListener("loadedmetadata", syncVideo, { once: true });
            removeMetadataListener = () =>
              media.removeEventListener("loadedmetadata", syncVideo);
          }
        }
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

    return () => {
      removeMetadataListener();
      context.revert();
    };
  }, [introDone, prefersReducedMotion]);

  return <div ref={rootRef}>{children}</div>;
}

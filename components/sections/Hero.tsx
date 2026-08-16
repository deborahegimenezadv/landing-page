// components/sections/Hero.tsx
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { whatsappLink } from "@/lib/content";
import { useIntro } from "@/components/intro/IntroProvider";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function Hero() {
  const introDone = useIntro();
  const prefersReducedMotion = useReducedMotion();

  // `motion`'s `reducedMotion="user"` only auto-disables positional/transform
  // keys (x, y, scale, rotate...) — it leaves opacity's own duration/stagger
  // untouched. Without this override, reduced-motion users would still wait
  // out the full 0.7s/staggered opacity fade instead of seeing the hero
  // near-instantly once the intro completes.
  const container: Variants = {
    hidden: {},
    visible: prefersReducedMotion
      ? { transition: { staggerChildren: 0, delayChildren: 0 } }
      : { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.15, ease: EASE }
        : { duration: 0.7, ease: EASE },
    },
  };

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:pb-[100px] lg:pt-[140px]"
    >
      <motion.div
        className="pointer-events-none absolute -right-[60px] -top-[60px] hidden h-[260px] w-[260px] rotate-[12deg] border border-gold/35 sm:block"
        animate={{ y: [0, -14, 0], rotate: [12, 16, 12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 right-[140px] hidden h-[90px] w-[90px] bg-gold/15 sm:block"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <motion.div
          className="max-w-[720px]"
          variants={container}
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
        >
          <motion.div
            variants={item}
            className="mb-6 flex items-center gap-3 sm:mb-7"
          >
            <motion.span
              className="h-px bg-gold"
              initial={{ width: 0 }}
              animate={introDone ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            />
            <span className="text-xs font-semibold tracking-[0.24em] text-text-gold-soft">
              ADVOCACIA
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="mb-5 text-[32px] font-bold leading-[1.2] text-white sm:mb-[26px] sm:text-[40px] lg:text-[52px] lg:leading-[1.15]"
          >
            Orientação jurídica objetiva em Previdenciário, Tributário e
            Civil.
          </motion.h1>
          <motion.p
            variants={item}
            className="mb-8 max-w-[560px] text-base font-light leading-[1.7] text-text-soft sm:mb-10 sm:text-[17px]"
          >
            Três áreas, três advogados responsáveis. Cada caso é conduzido
            diretamente por quem responde por aquela área — do primeiro
            contato à solução.
          </motion.p>
          <motion.div
            variants={item}
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
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex">
        <motion.span
          className="h-[34px] w-px bg-white/40"
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}

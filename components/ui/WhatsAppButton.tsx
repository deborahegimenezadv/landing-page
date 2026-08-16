"use client";

import { motion, useReducedMotion } from "motion/react";
import { whatsappLink } from "@/lib/content";

export function WhatsAppButton() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-gold"
        animate={
          prefersReducedMotion ? undefined : { scale: [1, 1.6], opacity: [0.5, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeOut" }
        }
      />
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-white transition-colors hover:bg-gold-dark sm:h-14 sm:w-14 sm:text-xl"
      >
        W
      </a>
    </div>
  );
}

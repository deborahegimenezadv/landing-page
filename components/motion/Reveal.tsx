"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  stagger = false,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={stagger ? containerVariants : revealItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
};

export function RevealItem({ children, className }: RevealItemProps) {
  return (
    <motion.div className={className} variants={revealItemVariants}>
      {children}
    </motion.div>
  );
}

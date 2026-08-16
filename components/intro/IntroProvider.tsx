"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { IntroLoader } from "@/components/intro/IntroLoader";

const IntroContext = createContext(false);

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introDone}>
        {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}
        {children}
      </IntroContext.Provider>
    </MotionConfig>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type CinematicVideoProps = {
  src: string;
  className?: string;
  priority?: boolean;
};

export function CinematicVideo({
  src,
  className,
  priority = false,
}: CinematicVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    if (!prefersReducedMotion) {
      void video.play().catch(() => undefined);
    }
  }, [prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      loop
      autoPlay={!prefersReducedMotion}
      preload={priority ? "auto" : "metadata"}
      className={className}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

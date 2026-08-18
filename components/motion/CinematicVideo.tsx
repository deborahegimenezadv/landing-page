"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "motion/react";

type CinematicVideoProps = {
  src: string;
  className?: string;
  priority?: boolean;
  scrollControlled?: boolean;
};

export const CinematicVideo = forwardRef<HTMLVideoElement, CinematicVideoProps>(
  function CinematicVideo(
    { src, className, priority = false, scrollControlled = false },
    forwardedRef,
  ) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const isScrollControlled =
    scrollControlled && isDesktop && !prefersReducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(query.matches);

    updateViewport();
    query.addEventListener("change", updateViewport);

    return () => query.removeEventListener("change", updateViewport);
  }, []);

  useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    if (isScrollControlled) {
      video.pause();
      video.currentTime = 0;
    } else if (!prefersReducedMotion) {
      void video.play().catch(() => undefined);
    }
  }, [isScrollControlled, prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      loop={!isScrollControlled}
      autoPlay={!isScrollControlled && !prefersReducedMotion}
      preload={priority ? "auto" : "metadata"}
      className={className}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
  },
);

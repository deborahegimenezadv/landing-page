import { forwardRef } from "react";

type ScaleIconProps = {
  className?: string;
};

export const ScaleIcon = forwardRef<SVGSVGElement, ScaleIconProps>(
  function ScaleIcon({ className }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <line data-draw x1="42" y1="14" x2="58" y2="14" />
        <line data-draw x1="50" y1="14" x2="50" y2="82" />
        <line data-draw x1="34" y1="82" x2="66" y2="82" />
        <line data-draw x1="20" y1="26" x2="80" y2="26" />
        <line data-draw x1="20" y1="26" x2="10" y2="50" />
        <line data-draw x1="20" y1="26" x2="30" y2="50" />
        <path data-draw d="M10,50 Q20,58 30,50" />
        <line data-draw x1="80" y1="26" x2="70" y2="50" />
        <line data-draw x1="80" y1="26" x2="90" y2="50" />
        <path data-draw d="M70,50 Q80,58 90,50" />
      </svg>
    );
  },
);

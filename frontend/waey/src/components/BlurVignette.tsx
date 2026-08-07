import { ReactNode } from "react";

interface BlurVignetteProps {
  className?: string;
  radius?: string;
  inset?: string;
  transitionLength?: string;
  blur?: string;
}

const BlurVignette = ({
  className = "",
  radius = "32px",
  inset = "8px",
  transitionLength = "16px",
  blur = "15px",
}: BlurVignetteProps) => {
  const r = `max(${transitionLength}, calc(${radius} - ${inset}))`;

  return (
    <div
      aria-hidden
      className={`blur-vignette pointer-events-none ${className}`}
      style={
        {
          "--radius": radius,
          "--inset": inset,
          "--transition-length": transitionLength,
          "--blur": blur,
          "--r": r,
          "--corner-size": `calc(${r} + ${inset}) calc(${r} + ${inset})`,
          "--corner-gradient": `transparent 0px, transparent calc(${r} - ${transitionLength}), black ${r}`,
          "--fill-gradient": `black, black ${inset}, transparent calc(${inset} + ${transitionLength}), transparent calc(100% - ${transitionLength} - ${inset}), black calc(100% - ${inset})`,
          "--fill-narrow-size": `calc(100% - (${inset} + ${r}) * 2)`,
          "--fill-farther-position": `calc(${inset} + ${r})`,
        } as React.CSSProperties
      }
    />
  );
};

export default BlurVignette;
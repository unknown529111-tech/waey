import { useEffect, useRef } from "react";

const VIDEO_URL =
  (import.meta.env.VITE_HERO_VIDEO_URL as string | undefined)?.trim() || "";

const FADE_DURATION = 0.5;
const TINT = "#0a0a0a";
const TINT_OPACITY = 0.55;

const HeroVideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const setFade = (opacity: number) => {
      video.style.opacity = String(opacity);
      const tint = video.parentElement?.querySelector<HTMLDivElement>(
        "[data-video-tint]"
      );
      if (tint) tint.style.opacity = String(TINT_OPACITY * opacity);
    };

    let fadeTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      if (video.duration > 0 && !video.paused) {
        const { currentTime, duration } = video;
        let opacity = 1;
        if (currentTime < FADE_DURATION) {
          opacity = currentTime / FADE_DURATION;
        } else if (duration - currentTime < FADE_DURATION) {
          opacity = Math.max(0, (duration - currentTime) / FADE_DURATION);
        }
        setFade(opacity);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      setFade(0);
      fadeTimer = setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => undefined);
      }, 100);
    };

    const start = () => {
      if (reducedMotion) {
        // Show a static first frame instead of an autoplaying loop
        video.currentTime = 0;
        setFade(1);
        return;
      }
      video.play().catch(() => undefined);
      rafRef.current = requestAnimationFrame(tick);
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("canplay", start, { once: true });
    start();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (fadeTimer) clearTimeout(fadeTimer);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("canplay", start);
    };
  }, []);

  return (
    <div
      className="absolute z-0 pointer-events-none"
      style={{ inset: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      {VIDEO_URL ? (
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="h-full w-full object-cover"
          style={{ opacity: 0, filter: "saturate(0.45) contrast(0.95)" }}
        />
      ) : null}
      {VIDEO_URL ? (
        <div
          data-video-tint
          className="absolute inset-0"
          style={{ background: TINT, opacity: 0 }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
    </div>
  );
};

export default HeroVideoBackground;

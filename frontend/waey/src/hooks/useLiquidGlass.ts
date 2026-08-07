import { useEffect } from "react";
import { initLiquidGlass, type LiquidGLOptions } from "@/lib/liquidGlass";

/**
 * useLiquidGlass — initialize the WebGL liquid-glass effect on every
 * element matching `selector` once mounted. Safe no-op when WebGL is
 * unavailable; the CSS frosted fallback keeps working.
 */
export function useLiquidGlass(selector: string, overrides: Partial<LiquidGLOptions> = {}) {
  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let booted = false;

    const boot = () => {
      if (disposed || booted) return;
      const nodes = document.querySelectorAll(selector);
      if (nodes.length === 0) return;
      booted = true;
      initLiquidGlass(selector, {
        snapshot: "body",
        refraction: 0.02,
        aberration: 0.12,
        bevelDepth: 0.09,
        bevelWidth: 0.16,
        frost: 0.5,
        shadow: true,
        specular: true,
        reveal: "fade",
        tilt: true,
        tiltFactor: 4,
        tiltEase: 400,
        ...overrides,
      }).catch(() => {});
    };

    raf = requestAnimationFrame(boot);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [selector, overrides]);
}

export default useLiquidGlass;

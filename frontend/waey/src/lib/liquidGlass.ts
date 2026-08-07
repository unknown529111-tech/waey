/**
 * Turns every element matching `selector` into a refractive WebGL
 * liquid-glass pane, refracting the live page behind it.
 *
 * liquidGL snapshots the page (asynchronously) and warps it via a shader,
 * so we call it after layout/mount. The frosted `backdrop-filter` fallback
 * stays in the CSS for browsers/older devices without WebGL support.
 */

export interface LiquidGLInstance {
  [key: string]: unknown;
}

export interface LiquidGLOptions {
  target: string;
  snapshot?: string;
  resolution?: number;
  refraction?: number;
  aberration?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: "none" | "fade";
  tilt?: boolean;
  tiltFactor?: number;
  tiltEase?: number;
  magnify?: number;
  on?: { init?: (instance: LiquidGLInstance) => void };
}

type LiquidGLFn = (opts: LiquidGLOptions) => LiquidGLInstance | null;

let loaded: LiquidGLFn | null = null;

async function getLiquidGL(): Promise<LiquidGLFn | null> {
  if (loaded) return loaded;
  try {
    const mod = await import("liquid-gl");
    loaded = (mod.default ?? mod) as unknown as LiquidGLFn;
    return loaded;
  } catch (err) {
    console.warn("liquidGL failed to load:", err);
    return null;
  }
}

export async function initLiquidGlass(
  selector: string,
  options: Partial<LiquidGLOptions> = {},
): Promise<LiquidGLInstance | null> {
  if (typeof window === "undefined") return null;
  const liquidGL = await getLiquidGL();
  if (!liquidGL) return null;

  const configured: LiquidGLOptions = {
    target: selector,
    snapshot: options.snapshot ?? "body",
    resolution: options.resolution ?? 1.5,
    refraction: options.refraction ?? 0.02,
    aberration: options.aberration ?? 0.12,
    bevelDepth: options.bevelDepth ?? 0.09,
    bevelWidth: options.bevelWidth ?? 0.16,
    frost: options.frost ?? 0.5,
    shadow: options.shadow ?? true,
    specular: options.specular ?? true,
    reveal: options.reveal ?? "fade",
    tilt: options.tilt ?? true,
    tiltFactor: options.tiltFactor ?? 4,
    tiltEase: options.tiltEase ?? 400,
    ...options,
  };

  try {
    return liquidGL(configured);
  } catch (err) {
    console.warn("liquidGL init failed:", err);
    return null;
  }
}
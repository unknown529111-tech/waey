export const blobShapes = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 40% 50% 50% 60%",
  "50% 50% 30% 70% / 50% 30% 70% 50%",
  "30% 70% 60% 40% / 30% 60% 40% 70%",
  "45% 55% 65% 35% / 55% 35% 65% 45%",
  "35% 65% 50% 50% / 40% 60% 40% 60%",
  "55% 45% 35% 65% / 45% 55% 45% 55%",
  "25% 75% 50% 50% / 50% 25% 75% 50%",
];

export const cardRadii = [
  "rounded-[2rem] rounded-tl-[4rem]",
  "rounded-[2rem] rounded-br-[4rem]",
  "rounded-[2rem] rounded-tr-[5rem] rounded-bl-[5rem]",
  "rounded-[2rem] rounded-bl-[4rem]",
  "rounded-[3rem_1rem_3rem_1rem]",
  "rounded-[1rem_3rem_1rem_3rem]",
  "rounded-[2rem_0.5rem_2rem_0.5rem]",
  "rounded-[0.5rem_2rem_0.5rem_2rem]",
];

export const sectionGradients = [
  "bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20",
  "bg-gradient-to-b from-sun-warm/30 via-background to-leaf-light/30",
  "bg-gradient-to-b from-muted via-background to-accent/30",
  "bg-gradient-to-b from-primary/5 via-background to-secondary/5",
  "bg-gradient-to-b from-leaf-light/20 via-background to-background",
  "bg-gradient-to-b from-accent/20 via-background to-leaf-light/20",
];

export const sectionWidths = {
  wide: "max-w-7xl",
  default: "max-w-6xl",
  narrow: "max-w-5xl",
  text: "max-w-4xl",
} as const;

export const sectionPadding = "px-4 sm:px-6 lg:px-8 py-16 md:py-20";

export const cardClasses = "bg-card border border-border/50 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300";

export function getBlobStyle(index: number = 0): React.CSSProperties {
  return {
    borderRadius: blobShapes[index % blobShapes.length],
  };
}

export function getBlobAnimation(index: number = 0): React.CSSProperties {
  const delays = ["0s", "1s", "2s", "0.5s", "1.5s", "2.5s", "0.8s", "1.8s"];
  const durations = ["8s", "10s", "7s", "9s", "11s", "6s", "13s", "10s"];
  return {
    animationDelay: delays[index % delays.length],
    animationDuration: durations[index % durations.length],
  };
}

export const imageMaskShapes = [
  "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
  "rounded-[40%_60%_30%_70%_/_50%_40%_60%_50%]",
  "rounded-[50%_50%_60%_40%_/_35%_65%_35%_65%]",
  "rounded-[60%_40%_40%_60%_/_40%_60%_40%_60%]",
];

export function getImageMaskStyle(index: number = 0): React.CSSProperties {
  return {
    borderRadius: blobShapes[(index + 3) % blobShapes.length],
  };
}

export const sectionBgVariants = [
  "bg-background",
  "bg-muted/30",
  "bg-accent/30",
  "bg-primary/5",
  "bg-leaf-light/30",
  "bg-sun-warm/30",
] as const;

export function getCardRadius(index: number = 0): string {
  return cardRadii[index % cardRadii.length];
}

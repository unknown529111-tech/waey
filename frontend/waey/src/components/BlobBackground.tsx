import { getBlobStyle, getBlobAnimation } from "@/lib/organic";

interface BlobBackgroundProps {
  count?: number;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "bg-primary/5",
  "bg-secondary/5",
  "bg-accent/8",
  "bg-primary/5",
  "bg-secondary/5",
  "bg-accent/8",
  "bg-primary/5",
  "bg-secondary/5",
];

const positionSets = [
  "-top-32 -left-32 w-[500px] h-[500px]",
  "top-1/3 -right-40 w-[400px] h-[400px]",
  "-bottom-40 left-1/4 w-[450px] h-[450px]",
  "top-1/4 left-1/3 w-[350px] h-[350px]",
  "-top-24 right-1/4 w-[380px] h-[380px]",
  "bottom-1/3 -left-24 w-[420px] h-[420px]",
  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]",
  "-bottom-20 right-1/3 w-[360px] h-[360px]",
  "-top-48 right-0 w-[550px] h-[550px]",
  "bottom-0 left-0 w-[350px] h-[350px]",
];

const BlobBackground = ({
  count = 2,
  colors = defaultColors,
  className = "",
}: BlobBackgroundProps) => {
  const blobs = Array.from({ length: count }, (_, i) => ({
    style: getBlobStyle(i * 2),
    anim: getBlobAnimation(i * 2),
    color: colors[i % colors.length],
    position: positionSets[i % positionSets.length],
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute ${blob.position} ${blob.color} blur-[128px] opacity-70 animate-blob-slow`}
          style={{
            ...blob.style,
            ...blob.anim,
          }}
        />
      ))}
    </div>
  );
};

export default BlobBackground;

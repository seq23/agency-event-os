type WordmarkProps = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
  className?: string;
};

const sizeMap = {
  sm: {
    west: "text-lg",
    live: "text-xl",
    gap: "gap-1",
  },
  md: {
    west: "text-2xl",
    live: "text-3xl",
    gap: "gap-2",
  },
  lg: {
    west: "text-5xl sm:text-6xl",
    live: "text-5xl sm:text-6xl",
    gap: "gap-3",
  },
};

export function WestPeekLiveWordmark({ size = "md", inverse = false, className = "" }: WordmarkProps) {
  const sizes = sizeMap[size];

  return (
    <span
      className={`inline-flex items-baseline ${sizes.gap} whitespace-nowrap leading-none ${className}`}
      aria-label="West Peek Live!"
    >
      <span className={`${sizes.west} font-black tracking-[-0.06em] ${inverse ? "text-white" : "text-brand-black"}`}>
        West Peek
      </span>
      <span
        className={`${sizes.live} brand-script inline-block -translate-y-[-0.28em] -rotate-6 text-brand-orange drop-shadow-sm`}
      >
        Live!
      </span>
    </span>
  );
}

export function WestPeekLiveMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-black tracking-[-0.08em] ${
        inverse ? "border-white/20 bg-white text-brand-black" : "border-brand-line bg-brand-black text-white"
      }`}
      aria-label="West Peek"
    >
      WP
    </span>
  );
}

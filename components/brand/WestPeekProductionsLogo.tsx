import Image from "next/image";

export function WestPeekProductionsLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClass = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const pixelSize = size === "lg" ? 96 : size === "sm" ? 48 : 64;
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="West Peek Productions">
      <Image
        src="/brand/west-peek-productions-logo.jpg"
        alt="West Peek Productions logo"
        width={pixelSize}
        height={pixelSize}
        priority={size === "lg"}
        className={`${sizeClass} rounded-xl bg-white object-contain`}
      />
      <span className="sr-only">West Peek Productions</span>
    </span>
  );
}

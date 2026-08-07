import type { SVGProps } from "react";

export type MascotMood = "default" | "happy" | "thinking" | "listening";

/**
 * Maskot RuangCakap (placeholder SVG): gelembung percakapan + daun.
 * Desain kalem & statis — aman sensorik, tanpa animasi menyala.
 * Aset 3D final bisa menggantikan komponen ini nanti tanpa mengubah pemakaian.
 */
export default function Mascot({
  mood = "default",
  motion = "none",
  className = "h-24 w-24",
  ...rest
}: {
  mood?: MascotMood;
  /** "idle" = goyang pelan; "wave" = melambai sekali lalu goyang pelan. */
  motion?: "none" | "idle" | "wave";
  className?: string;
} & SVGProps<SVGSVGElement>) {
  const motionClass =
    motion === "wave"
      ? "mascot-wave-idle"
      : motion === "idle"
        ? "mascot-idle"
        : "";
  const leafAnimate = motion !== "none";
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${motionClass} ${className}`}
      role="img"
      aria-label="Maskot RuangCakap"
      {...rest}
    >
      {/* Daun di kepala */}
      <g className={leafAnimate ? "mascot-leaf" : undefined}>
        <path d="M62 26c7-13 22-17 32-11-2 13-13 24-32 26z" fill="#58c200" />
        <path
          d="M62 26c9-4 18-5 27-3"
          stroke="#2f6d00"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* Badan gelembung */}
      <path
        d="M60 32c-21 0-38 13-38 30 0 10 6 19 15 25l-3 10 12-7c4 1 9 2 14 2 21 0 38-13 38-30S81 32 60 32z"
        fill="#b8e94f"
        stroke="#58c200"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Ekor gelembung */}
      <path
        d="M28 70c-3 6-5 12-5 18 0 4 3 8 7 8l6-8"
        fill="#b8e94f"
        stroke="#58c200"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Mata */}
      <circle cx="48" cy="62" r="4.5" fill="#2f6d00" />
      <circle cx="72" cy="62" r="4.5" fill="#2f6d00" />

      {mood === "happy" && (
        <>
          <path
            d="M48 76c8 8 16 8 24 0"
            stroke="#2f6d00"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="40" cy="72" rx="4" ry="2.5" fill="#c9a24b" opacity="0.85" />
          <ellipse cx="80" cy="72" rx="4" ry="2.5" fill="#c9a24b" opacity="0.85" />
        </>
      )}

      {mood === "default" && (
        <path
          d="M50 74c6 5 14 5 20 0"
          stroke="#2f6d00"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {mood === "thinking" && (
        <>
          <path
            d="M50 70c6 4 14 4 20 0"
            stroke="#2f6d00"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="95" cy="38" r="3.2" fill="#58c200" />
          <circle cx="103" cy="47" r="2.6" fill="#58c200" />
          <circle cx="107" cy="57" r="2" fill="#58c200" />
        </>
      )}

      {mood === "listening" && (
        <>
          <ellipse cx="60" cy="75" rx="5" ry="6.5" fill="#2f6d00" />
          <path
            d="M48 62c4-3 8-3 12 0"
            stroke="#2f6d00"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M72 62c4-3 8-3 12 0"
            stroke="#2f6d00"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

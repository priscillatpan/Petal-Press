import { useId } from "react";

type Props = {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

// Rounded 5-petal daisy with a circular hole — matches the reference image.
// Uses SVG mask so the center is truly transparent over any background.
export function FlowerIcon({ size = 36, color = "currentColor", className, style }: Props) {
  const uid = useId();
  const maskId = `flower-icon-mask-${uid}`;

  // Petal circles: 5 circles of radius 30, centered 22px from origin (100×100 viewbox)
  // Angles: −90°, −18°, 54°, 126°, 198°  (top petal first, clockwise)
  const petals = [
    { cx: 50, cy: 28 },
    { cx: 71, cy: 43 },
    { cx: 63, cy: 68 },
    { cx: 37, cy: 68 },
    { cx: 29, cy: 43 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          {/* White = show, black = hide (punch the center hole) */}
          <rect width="100" height="100" fill="white" />
          <circle cx="50" cy="50" r="15" fill="black" />
        </mask>
      </defs>
      <g fill={color} mask={`url(#${maskId})`}>
        {petals.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={30} />
        ))}
      </g>
    </svg>
  );
}

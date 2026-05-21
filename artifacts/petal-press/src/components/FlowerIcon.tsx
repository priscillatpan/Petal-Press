import { useId } from "react";

type Props = {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

// 5-petal rounded daisy with a transparent center hole.
// Geometry: 5 circles of r=23 centered at distance d=19 from (50,50),
// all safely within the 0-100 viewBox with ~8px margin.
// Center hole r=12. Matches the reference image silhouette.
export function FlowerIcon({ size = 36, color = "currentColor", className, style }: Props) {
  const uid = useId();
  const maskId = `fm-${uid}`;

  // Angles: −90°, −18°, 54°, 126°, 198° (top first, clockwise)
  // d=19, so centers = (50 + 19·cos θ, 50 + 19·sin θ) with θ measured from −y axis
  const petals = [
    { cx: 50, cy: 31 },   // top
    { cx: 68, cy: 44 },   // upper-right
    { cx: 61, cy: 65 },   // lower-right
    { cx: 39, cy: 65 },   // lower-left
    { cx: 32, cy: 44 },   // upper-left
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
          <rect width="100" height="100" fill="white" />
          {/* Punch a circular hole through the center */}
          <circle cx="50" cy="50" r="12" fill="black" />
        </mask>
      </defs>
      <g fill={color} mask={`url(#${maskId})`}>
        {petals.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={23} />
        ))}
      </g>
    </svg>
  );
}

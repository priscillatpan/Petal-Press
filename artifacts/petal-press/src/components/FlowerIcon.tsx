type Props = {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function FlowerIcon({ size = 36, color = "currentColor", className, style }: Props) {
  return (
    <span
      className={className}
      style={{ fontSize: size, color, lineHeight: 1, display: 'inline-block', userSelect: 'none', ...style }}
      aria-hidden
    >
      ✿
    </span>
  );
}

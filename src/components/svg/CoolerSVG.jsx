import DesignOverlay from "./DesignOverlay";

export default function CoolerSVG({ color, heightFactor, design }) {
  const cx = 140;
  const w = 200;
  const h = 110 + (heightFactor || 0.7) * 40;
  const y = 250 - h - 30;

  return (
    <svg viewBox="0 0 280 260" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      <ellipse cx={cx} cy={252} rx={w * 0.4} ry={4.5} fill="rgba(0,0,0,0.06)" />
      <rect x={cx - w / 2} y={y + 22} width={w} height={h} rx="10" fill={color} />
      <rect x={cx - w / 2} y={y + 22} width={w} height={h} rx="10" fill="rgba(0,0,0,0.03)" />
      <rect x={cx - w / 2 - 4} y={y} width={w + 8} height={26} rx="6" fill={color} />
      <rect x={cx - w / 2 - 4} y={y} width={w + 8} height={26} rx="6" fill="rgba(255,255,255,0.07)" />
      <rect x={cx - w / 2 + 10} y={y + 3} width={36} height={7} rx="3.5" fill="#777" />
      <rect x={cx + w / 2 - 46} y={y + 3} width={36} height={7} rx="3.5" fill="#777" />
      <rect x={cx - w / 2 + 18} y={y + 28} width={13} height={4.5} rx="2" fill="#999" />
      <rect x={cx + w / 2 - 31} y={y + 28} width={13} height={4.5} rx="2" fill="#999" />
      {design && <DesignOverlay design={design} cx={cx} cy={y + 22 + h * 0.48} size={Math.min(w * 0.28, h * 0.48)} />}
    </svg>
  );
}

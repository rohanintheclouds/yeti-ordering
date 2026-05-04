import { isLight } from "../../utils/helpers";
import DesignOverlay from "./DesignOverlay";

export default function TumblerSVG({ color, heightFactor, design, placement, side }) {
  const hf = heightFactor || 0.7;
  const h = 110 + hf * 80;
  const topW = 62;
  const botW = 52;
  const cx = 130;
  const startY = 260 - h - 15;
  const show =
    design &&
    (placement === "full wrap" ||
      (side === "front" && placement !== "back") ||
      (side === "back" && placement === "back") ||
      placement === "front and back");
  const dk = isLight(color);

  return (
    <svg viewBox="0 0 260 280" style={{ width: "100%", maxWidth: 220, height: "auto" }}>
      <ellipse cx={cx} cy={268} rx={28} ry={4.5} fill="rgba(0,0,0,0.06)" />
      <path
        d={`M${cx - topW / 2},${startY + 18} L${cx - botW / 2},${startY + h} Q${cx - botW / 2},${startY + h + 8} ${cx - botW / 2 + 8},${startY + h + 8} L${cx + botW / 2 - 8},${startY + h + 8} Q${cx + botW / 2},${startY + h + 8} ${cx + botW / 2},${startY + h} L${cx + topW / 2},${startY + 18} Z`}
        fill={color}
      />
      <rect x={cx - topW / 2 - 2} y={startY} width={topW + 4} height={20} rx="5" fill="#555" />
      <rect x={cx - topW / 2 + 6} y={startY + 4} width={topW - 8} height={4.5} rx="2" fill="rgba(255,255,255,0.1)" />
      <text x={cx} y={startY + 33} textAnchor="middle" fontSize="7" fill={dk ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)"} fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em">
        {(side || "front").toUpperCase()}
      </text>
      {show && <DesignOverlay design={design} cx={cx} cy={startY + 18 + (h - 18) * 0.44} size={botW * 0.65} />}
    </svg>
  );
}

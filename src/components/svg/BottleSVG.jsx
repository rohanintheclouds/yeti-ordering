import { isLight } from "../../utils/helpers";
import DesignOverlay from "./DesignOverlay";

export default function BottleSVG({ color, heightFactor, design, placement, side }) {
  const hf = heightFactor || 0.7;
  const bodyH = 100 + hf * 120;
  const bodyW = 52 + hf * 10;
  const capW = bodyW - 12;
  const capH = 18;
  const startY = 260 - bodyH - capH - 10;
  const cx = 130;
  const gid = "bg" + color.replace("#", "");
  const showDesign =
    design &&
    (placement === "full wrap" ||
      (side === "front" && placement !== "back") ||
      (side === "back" && placement === "back") ||
      placement === "front and back");
  const dk = isLight(color);

  return (
    <svg viewBox="0 0 260 280" style={{ width: "100%", maxWidth: 220, height: "auto" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0)" />
          <stop offset="75%" stopColor="rgba(0,0,0,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy={268} rx={bodyW * 0.55} ry={5} fill="rgba(0,0,0,0.06)" />
      <rect x={cx - capW / 2} y={startY} width={capW} height={capH} rx="5" fill="#5a5a5a" />
      <rect x={cx - capW / 2 + 3} y={startY + 2} width={capW - 6} height={3.5} rx="1.5" fill="rgba(255,255,255,0.12)" />
      <rect x={cx - bodyW / 2} y={startY + capH} width={bodyW} height={bodyH} rx="8" fill={color} />
      <rect x={cx - bodyW / 2} y={startY + capH} width={bodyW} height={bodyH} rx="8" fill={"url(#" + gid + ")"} />
      <rect x={cx - bodyW / 2 + 2} y={startY + capH + bodyH - 7} width={bodyW - 4} height={7} rx="3.5" fill="rgba(0,0,0,0.08)" />
      <text x={cx} y={startY + capH + 13} textAnchor="middle" fontSize="7" fill={dk ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)"} fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em">
        {(side || "front").toUpperCase()}
      </text>
      {showDesign && <DesignOverlay design={design} cx={cx} cy={startY + capH + bodyH * 0.44} size={bodyW * 0.62} />}
    </svg>
  );
}

import DesignOverlay from "./DesignOverlay";

export default function OtherSVG({ color, shape, design }) {
  const cx = 130;

  if (shape === "mug") {
    return (
      <svg viewBox="0 0 260 240" style={{ width: "100%", maxWidth: 200, height: "auto" }}>
        <ellipse cx={cx} cy={222} rx={36} ry={4.5} fill="rgba(0,0,0,0.06)" />
        <rect x={cx - 36} y={62} width={72} height={96} rx="6" fill={color} />
        <path d={`M${cx + 36},${82} Q${cx + 66},${82} ${cx + 66},${110} Q${cx + 66},${138} ${cx + 36},${138}`} fill="none" stroke="#888" strokeWidth="4.5" />
        <rect x={cx - 36} y={158} width={72} height={5} rx="2.5" fill="rgba(0,0,0,0.08)" />
        {design && <DesignOverlay design={design} cx={cx} cy={115} size={38} />}
      </svg>
    );
  }

  if (shape === "softcooler") {
    return (
      <svg viewBox="0 0 260 240" style={{ width: "100%", maxWidth: 220, height: "auto" }}>
        <ellipse cx={cx} cy={225} rx={48} ry={4.5} fill="rgba(0,0,0,0.06)" />
        <path d={`M${cx - 48},52 Q${cx - 52},47 ${cx - 38},42 L${cx + 38},42 Q${cx + 52},47 ${cx + 48},52 L${cx + 52},188 Q${cx + 52},208 ${cx + 38},208 L${cx - 38},208 Q${cx - 52},208 ${cx - 52},188 Z`} fill={color} />
        <path d={`M${cx - 28},42 Q${cx - 28},17 ${cx},17 Q${cx + 28},17 ${cx + 28},42`} fill="none" stroke={color} strokeWidth="5.5" />
        <rect x={cx - 43} y={47} width={86} height={7} rx="3" fill="rgba(0,0,0,0.1)" />
        {design && <DesignOverlay design={design} cx={cx} cy={130} size={48} />}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 220" style={{ width: "100%", maxWidth: 180, height: "auto" }}>
      <ellipse cx={cx} cy={202} rx={34} ry={4.5} fill="rgba(0,0,0,0.06)" />
      <path d={`M${cx - 34},72 L${cx - 30},188 Q${cx - 30},198 ${cx - 20},198 L${cx + 20},198 Q${cx + 30},198 ${cx + 30},188 L${cx + 34},72 Q${cx + 34},64 ${cx + 24},64 L${cx - 24},64 Q${cx - 34},64 ${cx - 34},72 Z`} fill={color} />
      <rect x={cx - 34} y={60} width={68} height={9} rx="4" fill="rgba(0,0,0,0.08)" />
      {design && <DesignOverlay design={design} cx={cx} cy={140} size={34} />}
    </svg>
  );
}

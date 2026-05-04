export default function DesignOverlay({ design, cx, cy, size }) {
  if (!design) return null;
  const s = size || 40;
  const shapes = {
    compass: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <polygon points="50,12 54,44 50,36 46,44" fill="white" opacity=".85" />
        <polygon points="50,88 46,56 50,64 54,56" fill="white" opacity=".5" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="white" strokeWidth="1.5" opacity=".35" />
      </g>
    ),
    anchor: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <circle cx="50" cy="20" r="9" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <line x1="50" y1="29" x2="50" y2="82" stroke="white" strokeWidth="2.5" opacity=".8" />
        <path d="M26,68 Q50,92 74,68" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <line x1="36" y1="44" x2="64" y2="44" stroke="white" strokeWidth="2.5" opacity=".65" />
      </g>
    ),
    mountain: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <polygon points="50,12 88,82 12,82" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <polygon points="36,44 50,12 64,44" fill="white" opacity=".12" />
        <polyline points="32,82 56,48 70,62 84,44" fill="none" stroke="white" strokeWidth="1.8" opacity=".45" />
      </g>
    ),
    pine: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <polygon points="50,10 68,38 32,38" fill="white" opacity=".65" />
        <polygon points="50,26 73,52 27,52" fill="white" opacity=".5" />
        <polygon points="50,40 78,70 22,70" fill="white" opacity=".38" />
        <rect x="44" y="70" width="12" height="18" fill="white" opacity=".55" />
      </g>
    ),
    wave: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <path d="M8,50 Q22,26 38,50 Q54,74 68,50 Q82,26 98,50" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <path d="M8,64 Q22,40 38,64 Q54,88 68,64 Q82,40 98,64" fill="none" stroke="white" strokeWidth="1.8" opacity=".45" />
      </g>
    ),
    trail: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <path d="M32,82 L50,18 L68,82" fill="none" stroke="white" strokeWidth="2.5" opacity=".8" />
        <line x1="37" y1="62" x2="63" y2="62" stroke="white" strokeWidth="1.8" opacity=".55" />
        <circle cx="50" cy="18" r="5" fill="white" opacity=".65" />
      </g>
    ),
    campfire: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <path d="M50,16 Q60,34 50,54 Q40,34 50,16" fill="white" opacity=".65" />
        <path d="M39,26 Q49,44 39,58" fill="none" stroke="white" strokeWidth="1.8" opacity=".45" />
        <path d="M61,26 Q51,44 61,58" fill="none" stroke="white" strokeWidth="1.8" opacity=".45" />
        <line x1="26" y1="72" x2="74" y2="72" stroke="white" strokeWidth="2.5" opacity=".55" />
      </g>
    ),
    sunrise: (
      <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${s / 100})`}>
        <path d="M10,58 Q50,12 90,58" fill="white" opacity=".15" />
        <circle cx="50" cy="40" r="14" fill="white" opacity=".55" />
        <line x1="50" y1="16" x2="50" y2="8" stroke="white" strokeWidth="2" opacity=".6" />
        <line x1="26" y1="26" x2="20" y2="20" stroke="white" strokeWidth="2" opacity=".45" />
        <line x1="74" y1="26" x2="80" y2="20" stroke="white" strokeWidth="2" opacity=".45" />
        <line x1="10" y1="62" x2="90" y2="62" stroke="white" strokeWidth="2.5" opacity=".8" />
      </g>
    ),
  };
  return (
    shapes[design.svg || design.id] || (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 0.55} fill="rgba(255,255,255,0.75)">
        {design.icon || "\u2726"}
      </text>
    )
  );
}

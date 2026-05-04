import { useState } from "react";

export default function Section({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== false);

  return (
    <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 18, marginTop: 18 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#0B2F4A" }}>
          {title}
        </span>
        <span style={{ fontSize: 14, color: "#999", transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }}>
          {"\u25be"}
        </span>
      </div>
      {open && <div style={{ paddingTop: 14 }}>{children}</div>}
    </div>
  );
}

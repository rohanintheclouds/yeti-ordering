import { useEffect } from "react";
import { BS } from "../styles/theme";
import { fmt, genTrackingNum } from "../utils/helpers";

export default function TrackingPage({
  bag,
  loggedIn,
  userName,
  email,
  orderNum,
  orderStatus,
  setOrderStatus,
  trackingNum,
  setTrackingNum,
  earnedPoints,
  bagTotal,
  setBag,
  setPage,
}) {
  const stages = ["Order Placed", "Design Approved", "In Production", "Shipped", "Delivered"];
  const orderEmail = loggedIn ? userName + "@yeti.com" : email;

  useEffect(() => {
    if (orderStatus >= 3 && !trackingNum) {
      setTrackingNum(genTrackingNum());
    }
  }, [orderStatus, trackingNum, setTrackingNum]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
      <div style={{ textAlign: "center", padding: "48px 0 24px" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#2a8a4a", color: "#fff", fontSize: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          {"\u2713"}
        </div>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 28, fontWeight: 700, color: "#0B2F4A", margin: "0 0 6px" }}>ORDER CONFIRMED</h1>
        <p style={{ color: "#888", fontSize: 15, margin: "0 0 6px" }}>Order #{orderNum}</p>
        <p style={{ color: "#555", fontSize: 13 }}>
          {"\ud83d\udce7"} Your order confirmation and receipt have been sent to <strong>{orderEmail || "your email"}</strong>
        </p>
        {loggedIn && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f9f7e8", borderRadius: 20, padding: "6px 14px", marginTop: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span style={{ fontSize: 12, color: "#555" }}>+{earnedPoints} points earned!</span>
          </div>
        )}
      </div>

      {/* Progress tracker */}
      <div style={{ display: "flex", alignItems: "center", maxWidth: 620, margin: "0 auto 10px" }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: i <= orderStatus ? "#0B2F4A" : "#e8e8e8", color: i <= orderStatus ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {i < orderStatus ? "\u2713" : i + 1}
            </div>
            {i < stages.length - 1 && <div style={{ flex: 1, height: 3, background: i < orderStatus ? "#0B2F4A" : "#e8e8e8", margin: "0 5px" }} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 620, margin: "0 auto 12px" }}>
        {stages.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 600, fontFamily: "'Montserrat',sans-serif", color: i <= orderStatus ? "#0B2F4A" : "#bbb", textTransform: "uppercase" }}>
            {s}
          </div>
        ))}
      </div>

      {trackingNum && (
        <div style={{ textAlign: "center", margin: "16px 0", padding: "12px 20px", background: "#f0f6fa", borderRadius: 8, display: "inline-block" }}>
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", color: "#888", letterSpacing: "0.1em" }}>TRACKING NUMBER</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "#0B2F4A", marginTop: 4, letterSpacing: "0.05em" }}>{trackingNum}</div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button style={{ ...BS.btnS, marginRight: 12 }} onClick={() => setOrderStatus((s) => Math.min(s + 1, 4))}>
          SIMULATE NEXT STATUS
        </button>
        <button style={BS.btnP} onClick={() => { setBag([]); setPage("home"); }}>
          BACK TO HOME
        </button>
      </div>

      <div style={{ background: "#f9f9f7", borderRadius: 14, padding: 26, marginTop: 32 }}>
        <div style={BS.label}>ORDER DETAILS</div>
        {bag.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{item.product.name} {"\u00d7"} {item.qty}</span>
            <span>{fmt(item.price)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Montserrat',sans-serif", fontSize: 18, fontWeight: 700, color: "#0B2F4A", paddingTop: 14, marginTop: 8 }}>
          <span>TOTAL</span>
          <span>{fmt(bagTotal)}</span>
        </div>
      </div>
    </div>
  );
}

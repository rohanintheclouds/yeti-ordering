import { COLORS_DATA } from "../data/colors";
import ProductPreview from "../components/ProductPreview";
import { BS } from "../styles/theme";
import { fmt, isLight } from "../utils/helpers";

export default function BagPage({
  bag,
  setBag,
  editingBagIdx,
  setEditingBagIdx,
  loggedIn,
  earnedPoints,
  setPage,
  handleProceedToLogistics,
  generateGroupLink,
  showGroupModal,
  setShowGroupModal,
  groupLink,
}) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", color: "#0B2F4A", margin: "32px 0 26px" }}>
          YOUR BAG
        </h1>
        <button style={{ ...BS.btnS, fontSize: 10, padding: "8px 14px" }} onClick={generateGroupLink}>
          {"\ud83d\udd17"} CREATE GROUP ORDER
        </button>
      </div>

      {/* Group order modal */}
      {showGroupModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowGroupModal(false)}>
          <div style={{ background: "#fff", borderRadius: 18, padding: "36px", maxWidth: 440, width: "90%", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 18, fontWeight: 700, color: "#0B2F4A", margin: "0 0 8px" }}>GROUP ORDER LINK</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 16px" }}>Share this link with your team. Anyone with this link can add items to your shared order.</p>
            <div style={{ background: "#f0f6fa", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", fontSize: 13, color: "#0B2F4A", wordBreak: "break-all", marginBottom: 16 }}>
              {groupLink}
            </div>
            <button style={BS.btnP} onClick={() => { navigator.clipboard?.writeText(groupLink); setShowGroupModal(false); }}>
              COPY LINK
            </button>
          </div>
        </div>
      )}

      {bag.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <p style={{ color: "#888", fontSize: 15 }}>Your bag is empty.</p>
          <button style={{ ...BS.btnP, marginTop: 18 }} onClick={() => setPage("browse")}>SHOP PRODUCTS</button>
        </div>
      ) : (
        <>
          {bag.map((item, idx) => (
            <div key={item.id} style={{ display: "flex", gap: 22, padding: 22, borderBottom: "1px solid #eee", alignItems: "flex-start" }}>
              <div style={{ width: 105, flexShrink: 0, background: "#f6f6f4", borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ProductPreview product={item.product} color={item.color} design={item.frontDesign} placement={item.placement} side="front" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 16, fontWeight: 700, color: "#0B2F4A" }}>{item.product.name}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                  Qty: {item.qty} {"\u2022"} Front: {item.frontDesign?.name || "None"} {"\u2022"} Back: {item.backDesign?.name || "None"}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {item.splitMode
                    ? Object.entries(item.colorSplits)
                        .filter(([, q]) => q > 0)
                        .map(([hex, q]) => (
                          <div key={hex} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 14, height: 14, borderRadius: "50%", background: hex, border: "1px solid #ddd" }} />
                            <span style={{ fontSize: 11, color: "#666" }}>{"\u00d7"}{q}</span>
                          </div>
                        ))
                    : (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: item.color, border: "1px solid #ddd" }} />
                        <span style={{ fontSize: 11, color: "#666" }}>{COLORS_DATA.find((c) => c.hex === item.color)?.name}</span>
                      </div>
                    )}
                </div>
                {editingBagIdx === idx ? (
                  <div style={{ marginTop: 14, padding: 14, background: "#f8f8f8", borderRadius: 10 }}>
                    <div style={BS.label}>EDIT COLOR</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {COLORS_DATA.map((c) => (
                        <div
                          key={c.hex}
                          title={c.name}
                          style={{
                            width: 30, height: 30, borderRadius: "50%", background: c.hex, cursor: "pointer",
                            border: item.color === c.hex ? "3px solid #0B2F4A" : "2px solid #ddd",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onClick={() => {
                            const u = [...bag];
                            u[idx] = { ...u[idx], color: c.hex };
                            if (!u[idx].splitMode) u[idx].colorSplits = { [c.hex]: u[idx].qty };
                            setBag(u);
                          }}
                        >
                          {item.color === c.hex && <span style={{ color: isLight(c.hex) ? "#333" : "#fff", fontSize: 10, fontWeight: 700 }}>{"\u2713"}</span>}
                        </div>
                      ))}
                    </div>
                    <button style={{ ...BS.btnS, marginTop: 10, fontSize: 11, padding: "6px 16px" }} onClick={() => setEditingBagIdx(null)}>Done</button>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <button style={{ background: "none", border: "none", color: "#1F7EA6", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }} onClick={() => setEditingBagIdx(idx)}>Edit Color</button>
                    <button style={{ background: "none", border: "none", color: "#C81F25", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }} onClick={() => setBag((b) => b.filter((_, i) => i !== idx))}>Remove</button>
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 20, fontWeight: 700, color: "#0B2F4A", flexShrink: 0 }}>{fmt(item.price)}</div>
            </div>
          ))}
          {loggedIn && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 0", borderBottom: "1px solid #eee" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E6F000" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span style={{ fontSize: 13, color: "#555" }}>
                You'll earn <strong style={{ color: "#0B2F4A" }}>{earnedPoints} loyalty points</strong> with this order
              </span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "28px 0" }}>
            <button style={BS.btnS} onClick={() => setPage("browse")}>CONTINUE SHOPPING</button>
            <button style={BS.btnP} onClick={handleProceedToLogistics}>PROCEED TO CHECKOUT</button>
          </div>
        </>
      )}
    </div>
  );
}

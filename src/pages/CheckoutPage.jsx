import { BS } from "../styles/theme";
import { fmt } from "../utils/helpers";

export default function CheckoutPage({
  bag,
  loggedIn,
  userName,
  loginEmail,
  email,
  setEmail,
  shipAddr,
  setShipAddr,
  payInfo,
  setPayInfo,
  deliveryResults,
  rushSelections,
  bagTotal,
  earnedPoints,
  submitOrder,
}) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", color: "#0B2F4A", margin: "32px 0 26px" }}>
        CHECKOUT
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 36 }}>
        <div>
          {!loggedIn && (
            <div style={BS.card}>
              <div style={BS.label}>CONTACT</div>
              <input style={BS.inp} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          )}
          <div style={BS.card}>
            <div style={BS.label}>SHIPPING ADDRESS</div>
            <input style={BS.inp} placeholder="Full name" value={shipAddr.name} onChange={(e) => setShipAddr((p) => ({ ...p, name: e.target.value }))} />
            <input style={BS.inp} placeholder="Street address" value={shipAddr.street} onChange={(e) => setShipAddr((p) => ({ ...p, street: e.target.value }))} />
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...BS.inp, flex: 1 }} placeholder="City" value={shipAddr.city} onChange={(e) => setShipAddr((p) => ({ ...p, city: e.target.value }))} />
              <input style={{ ...BS.inp, width: 80 }} placeholder="State" value={shipAddr.state} onChange={(e) => setShipAddr((p) => ({ ...p, state: e.target.value }))} />
              <input style={{ ...BS.inp, width: 100 }} placeholder="Zip" value={shipAddr.zip} onChange={(e) => setShipAddr((p) => ({ ...p, zip: e.target.value }))} />
            </div>
          </div>
          <div style={BS.card}>
            <div style={BS.label}>PAYMENT</div>
            <input style={BS.inp} placeholder="Card number" value={payInfo.card} onChange={(e) => setPayInfo((p) => ({ ...p, card: e.target.value }))} />
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...BS.inp, flex: 1 }} placeholder="MM / YY" value={payInfo.exp} onChange={(e) => setPayInfo((p) => ({ ...p, exp: e.target.value }))} />
              <input style={{ ...BS.inp, width: 80 }} placeholder="CVV" value={payInfo.cvv} onChange={(e) => setPayInfo((p) => ({ ...p, cvv: e.target.value }))} />
            </div>
          </div>
          <button style={{ ...BS.btnP, width: "100%", padding: "17px 24px", fontSize: 14 }} onClick={submitOrder}>
            PLACE ORDER {"\u2014"} {fmt(bagTotal)}
          </button>
        </div>
        <div style={{ background: "#f9f9f7", borderRadius: 14, padding: 26, alignSelf: "flex-start" }}>
          <div style={BS.label}>ORDER SUMMARY</div>
          {bag.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>{item.product.name} {"\u00d7"} {item.qty}</span>
              <span>{fmt(item.product.basePrice * item.qty)}</span>
            </div>
          ))}
          {deliveryResults?.some((d) => d.surcharge > 0) && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#b8860b", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Cross-region shipping</span>
              <span>{fmt(deliveryResults.reduce((s, d) => s + d.surcharge, 0))}</span>
            </div>
          )}
          {Object.keys(rushSelections).length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#1F7EA6", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Rush delivery</span>
              <span>
                {fmt(
                  bag.reduce((s, item) => {
                    const dr = deliveryResults?.find((r) => r.itemId === item.id);
                    return s + (rushSelections[item.id] && dr?.rushOption ? dr.rushOption.fee : 0);
                  }, 0)
                )}
              </span>
            </div>
          )}
          {loggedIn && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span style={{ fontSize: 12, color: "#555" }}>Earning <strong>{earnedPoints} pts</strong></span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Montserrat',sans-serif", fontSize: 18, fontWeight: 700, color: "#0B2F4A", paddingTop: 14, marginTop: 8 }}>
            <span>TOTAL</span>
            <span>{fmt(bagTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

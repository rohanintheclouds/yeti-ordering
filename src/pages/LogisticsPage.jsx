import { useState, useEffect, useMemo, useRef } from "react";
import { COUNTRIES } from "../data/regions";
import { BS } from "../styles/theme";
import { fmt, fmtDate } from "../utils/helpers";

export default function LogisticsPage({
  bag,
  country,
  setCountry,
  zipCode,
  setZipCode,
  deliveryResults,
  setDeliveryResults,
  rushSelections,
  setRushSelections,
  checkDelivery,
  bagTotal,
  setPage,
}) {
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filteredCountries = useMemo(
    () => (countrySearch ? COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase())) : COUNTRIES),
    [countrySearch]
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", color: "#0B2F4A", margin: "32px 0 26px" }}>
        SHIPPING & DELIVERY
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 36 }}>
        <div>
          <div style={BS.card}>
            <div style={BS.label}>DELIVERY COUNTRY</div>
            <div ref={countryRef} style={{ position: "relative" }}>
              <input
                style={BS.inp}
                value={countryOpen ? countrySearch : country}
                onChange={(e) => { setCountrySearch(e.target.value); setCountryOpen(true); }}
                onFocus={() => { setCountryOpen(true); setCountrySearch(""); }}
                placeholder="Search country\u2026"
              />
              {countryOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ddd", borderRadius: "0 0 8px 8px", maxHeight: 250, overflowY: "auto", zIndex: 50, boxShadow: "0 6px 16px rgba(0,0,0,0.1)" }}>
                  {filteredCountries.slice(0, 15).map((c) => (
                    <div
                      key={c}
                      style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #f0f0f0", background: country === c ? "#e8f4f8" : "transparent" }}
                      onClick={() => { setCountry(c); setCountryOpen(false); setCountrySearch(""); setDeliveryResults(null); }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={BS.card}>
            <div style={BS.label}>ZIP / POSTAL CODE</div>
            <input style={BS.inp} value={zipCode} onChange={(e) => { setZipCode(e.target.value.slice(0, 10)); setDeliveryResults(null); }} placeholder="e.g. 94105" maxLength={10} />
          </div>
          <button style={{ ...BS.btnP, width: "100%", marginTop: 6, opacity: zipCode ? 1 : 0.4 }} disabled={!zipCode} onClick={checkDelivery}>
            CHECK DELIVERY OPTIONS
          </button>
        </div>
        <div>
          {deliveryResults ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={BS.label}>DELIVERY SUMMARY</div>
                <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>Your items will be fulfilled and shipped directly by YETI.</p>
              </div>
              {bag.map((item) => {
                const dr = deliveryResults.find((r) => r.itemId === item.id);
                if (!dr) return null;
                const isRushed = rushSelections[item.id];
                return (
                  <div key={item.id} style={{ ...BS.card, border: dr.inRegion ? "2px solid #e8f4f8" : "2px solid #fff5e6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 700, color: "#0B2F4A" }}>
                          {item.product.name} <span style={{ fontWeight: 400, color: "#888" }}>{"\u00d7"} {item.qty}</span>
                        </div>
                      </div>
                      {dr.inRegion ? (
                        <span style={{ padding: "3px 10px", background: "rgba(42,138,74,0.1)", color: "#2a8a4a", fontSize: 9, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", borderRadius: 3 }}>IN STOCK LOCALLY</span>
                      ) : (
                        <span style={{ padding: "3px 10px", background: "rgba(184,134,11,0.1)", color: "#b8860b", fontSize: 9, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", borderRadius: 3 }}>SOURCED CROSS-REGION</span>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 4 }}>ESTIMATED DELIVERY</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0B2F4A" }}>
                          {fmtDate(isRushed && dr.rushOption ? dr.rushOption.date : dr.deliveryDate)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 4 }}>AVAILABILITY</div>
                        <div style={{ fontSize: 14, color: dr.fulfillment === "full" ? "#2a8a4a" : "#b8860b", fontWeight: 600 }}>
                          {dr.fulfillment === "full" ? "\u2713 Fully available" : "\u26a0 Partial \u2014 may have slight delay"}
                        </div>
                      </div>
                    </div>
                    {dr.surcharge > 0 && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(184,134,11,0.06)", borderRadius: 6, fontSize: 12, color: "#b8860b", fontWeight: 600 }}>
                        Cross-region shipping: +{fmt(dr.surcharge)}
                      </div>
                    )}
                    {dr.rushOption && !isRushed && (
                      <div style={{ marginTop: 12, padding: "12px 14px", background: "#f0f6fa", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0B2F4A" }}>{"⚡"} Rush Delivery Available</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                            Get it by <strong>{fmtDate(dr.rushOption.date)}</strong> {"\u2014"} {dr.rushOption.daysSaved} days sooner
                          </div>
                        </div>
                        <button style={{ ...BS.btnAccent, fontSize: 11, padding: "8px 16px" }} onClick={() => setRushSelections((p) => ({ ...p, [item.id]: true }))}>
                          +{fmt(dr.rushOption.fee)} RUSH
                        </button>
                      </div>
                    )}
                    {isRushed && (
                      <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(31,126,166,0.08)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#1F7EA6" }}>{"⚡"} Rush Delivery Selected</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                            Delivering by <strong>{fmtDate(dr.rushOption.date)}</strong> (+{fmt(dr.rushOption.fee)})
                          </div>
                        </div>
                        <button
                          style={{ background: "none", border: "none", color: "#C81F25", fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => setRushSelections((p) => { const n = { ...p }; delete n[item.id]; return n; })}
                        >
                          Remove Rush
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Montserrat',sans-serif", fontSize: 20, fontWeight: 700, color: "#0B2F4A", padding: "18px 0 10px", borderTop: "2px solid #eee", marginTop: 10 }}>
                <span>ESTIMATED TOTAL</span>
                <span>{fmt(bagTotal)}</span>
              </div>
              <button style={{ ...BS.btnP, width: "100%", marginTop: 10 }} onClick={() => setPage("checkout")}>
                CONTINUE TO PAYMENT
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{"\ud83d\udce6"}</div>
              <p style={{ fontSize: 14 }}>Enter your location and we'll find the best delivery option for you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

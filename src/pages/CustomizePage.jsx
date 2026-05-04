import { COLORS_DATA } from "../data/colors";
import ProductPreview from "../components/ProductPreview";
import Section from "../components/Section";
import DesignPicker from "../components/DesignPicker";
import { BS } from "../styles/theme";
import { fmt, isLight } from "../utils/helpers";

export default function CustomizePage({
  customizing,
  setPage,
  // Quantity
  custQty,
  setCustQty,
  // Color
  custColor,
  setCustColor,
  custSplitMode,
  setCustSplitMode,
  custColorSplits,
  setCustColorSplits,
  // Front design
  custFrontDesignMode,
  setCustFrontDesignMode,
  custFrontDesign,
  setCustFrontDesign,
  // Back design
  custBackDesignMode,
  setCustBackDesignMode,
  custBackDesign,
  setCustBackDesign,
  // AI
  custAiPrompt,
  setCustAiPrompt,
  custAiResult,
  custAiLoading,
  custAiConfirmed,
  custAiSide,
  setCustAiSide,
  generateAiDesign,
  confirmAiDesign,
  resetAi,
  // Preview
  previewSide,
  setPreviewSide,
  // Price & actions
  currentItemPrice,
  addToBag,
  // Modal
  showAddedModal,
  setShowAddedModal,
}) {
  const splitTotal = Object.values(custColorSplits).reduce((a, b) => a + b, 0);
  const splitRem = custQty - splitTotal;
  const currentPlacement =
    custFrontDesign && custBackDesign
      ? "front and back"
      : custFrontDesign
        ? "front"
        : custBackDesign
          ? "back"
          : "none";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
      {/* Added-to-bag modal */}
      {showAddedModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowAddedModal(false)}>
          <div style={{ background: "#fff", borderRadius: 18, padding: "44px 36px", textAlign: "center", maxWidth: 420, width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#2a8a4a", color: "#fff", fontSize: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              {"\u2713"}
            </div>
            <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 18, fontWeight: 700, color: "#0B2F4A", margin: "0 0 6px" }}>ADDED TO BAG</h3>
            <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
              {customizing.name} {"\u00d7"} {custQty}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={BS.btnS} onClick={() => { setShowAddedModal(false); setPage("browse"); }}>CONTINUE SHOPPING</button>
              <button style={BS.btnP} onClick={() => { setShowAddedModal(false); setPage("bag"); }}>VIEW BAG</button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ padding: "18px 0 8px", fontSize: 13, color: "#888" }}>
        <span style={{ cursor: "pointer", textDecoration: "underline", color: "#1F7EA6" }} onClick={() => setPage("browse")}>
          {customizing.category}
        </span>
        <span style={{ margin: "0 7px" }}>/</span>
        <span>{customizing.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, paddingTop: 12 }}>
        {/* Preview */}
        <div style={{ position: "sticky", top: 80, alignSelf: "start" }}>
          <div style={{ background: "#f6f6f4", borderRadius: 18, padding: "44px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 360 }}>
            <ProductPreview
              product={customizing}
              color={custSplitMode ? (Object.keys(custColorSplits).find((k) => custColorSplits[k] > 0) || "#2B2B2B") : custColor}
              design={previewSide === "front" ? custFrontDesign : custBackDesign}
              placement={currentPlacement}
              side={previewSide}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
            {["front", "back"].map((s) => (
              <button
                key={s}
                style={{
                  background: previewSide === s ? "#0B2F4A" : "#eee",
                  color: previewSide === s ? "#fff" : "#666",
                  border: "none",
                  padding: "9px 22px",
                  fontSize: 11,
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  borderRadius: 22,
                }}
                onClick={() => setPreviewSide(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 28, fontWeight: 700, color: "#0B2F4A", margin: "0 0 8px", lineHeight: 1.2 }}>
            {customizing.name}
          </h1>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, margin: "0 0 10px" }}>{customizing.desc}</p>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 26, fontWeight: 700, color: "#1F7EA6", marginBottom: 22 }}>
            {fmt(currentItemPrice)}
          </div>

          {/* Quantity */}
          <Section title="QUANTITY">
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <button style={{ width: 42, height: 42, border: "1px solid #ddd", background: "#fff", fontSize: 18, cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }} onClick={() => setCustQty((q) => Math.max(1, q - 1))}>
                {"\u2212"}
              </button>
              <input type="number" min={1} value={custQty} onChange={(e) => setCustQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 68, height: 42, border: "1px solid #ddd", borderLeft: "none", borderRight: "none", textAlign: "center", fontSize: 15, fontWeight: 600, color: "#333" }} />
              <button style={{ width: 42, height: 42, border: "1px solid #ddd", background: "#fff", fontSize: 18, cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0" }} onClick={() => setCustQty((q) => q + 1)}>
                +
              </button>
            </div>
          </Section>

          {/* Color */}
          <Section title="COLOR">
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={custSplitMode} onChange={(e) => setCustSplitMode(e.target.checked)} style={{ accentColor: "#0B2F4A" }} />
              <span style={{ fontSize: 13, color: "#555" }}>Split quantity across multiple colors</span>
            </label>
            {!custSplitMode ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {COLORS_DATA.map((c) => (
                  <div
                    key={c.hex}
                    title={c.name}
                    style={{
                      width: 38, height: 38, borderRadius: "50%", background: c.hex, cursor: "pointer",
                      border: custColor === c.hex ? "3px solid #0B2F4A" : "2px solid #ddd",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: custColor === c.hex ? "0 0 0 2px rgba(11,47,74,0.2)" : "none",
                    }}
                    onClick={() => setCustColor(c.hex)}
                  >
                    {custColor === c.hex && <span style={{ color: isLight(c.hex) ? "#333" : "#fff", fontSize: 14, fontWeight: 700 }}>{"\u2713"}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>
                  Remaining: <strong style={{ color: splitRem < 0 ? "#C81F25" : splitRem === 0 ? "#2a8a4a" : "#0B2F4A" }}>{splitRem}</strong> of {custQty}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {COLORS_DATA.map((c) => (
                    <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.hex, border: "1px solid #ddd", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, flex: 1, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={custColorSplits[c.hex] || ""}
                        onChange={(e) => {
                          const v = Math.max(0, parseInt(e.target.value) || 0);
                          setCustColorSplits((p) => {
                            const n = { ...p };
                            if (v === 0) delete n[c.hex];
                            else n[c.hex] = v;
                            return n;
                          });
                        }}
                        style={{ width: 54, padding: "5px 6px", border: "1px solid #ddd", borderRadius: 4, textAlign: "center", fontSize: 12 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Front Design */}
          <Section title="FRONT DESIGN">
            <DesignPicker
              side="front"
              designMode={custFrontDesignMode}
              setDesignMode={setCustFrontDesignMode}
              design={custFrontDesign}
              setDesign={setCustFrontDesign}
              aiPrompt={custAiPrompt}
              setAiPrompt={setCustAiPrompt}
              aiResult={custAiResult}
              aiLoading={custAiLoading}
              aiConfirmed={custAiConfirmed && custAiSide === "front"}
              generateAi={() => { setCustAiSide("front"); generateAiDesign(); }}
              confirmAi={confirmAiDesign}
              setAiSide={setCustAiSide}
              aiSide={custAiSide}
              resetAi={resetAi}
            />
          </Section>

          {/* Back Design */}
          <Section title="BACK DESIGN" defaultOpen={false}>
            <DesignPicker
              side="back"
              designMode={custBackDesignMode}
              setDesignMode={setCustBackDesignMode}
              design={custBackDesign}
              setDesign={setCustBackDesign}
              aiPrompt={custAiPrompt}
              setAiPrompt={setCustAiPrompt}
              aiResult={custAiResult}
              aiLoading={custAiLoading}
              aiConfirmed={custAiConfirmed && custAiSide === "back"}
              generateAi={() => { setCustAiSide("back"); generateAiDesign(); }}
              confirmAi={confirmAiDesign}
              setAiSide={setCustAiSide}
              aiSide={custAiSide}
              resetAi={resetAi}
            />
          </Section>

          <button
            style={{ ...BS.btnP, width: "100%", padding: "17px 24px", fontSize: 14, marginTop: 26, opacity: custSplitMode && splitRem < 0 ? 0.4 : 1 }}
            disabled={custSplitMode && splitRem < 0}
            onClick={addToBag}
          >
            ADD TO BAG {"\u2014"} {fmt(currentItemPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}

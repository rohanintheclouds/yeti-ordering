import { PRE_DESIGNS } from "../data/designs";
import { BS } from "../styles/theme";

export default function DesignPicker({
  side,
  designMode,
  setDesignMode,
  design,
  setDesign,
  aiPrompt,
  setAiPrompt,
  aiResult,
  aiLoading,
  aiConfirmed,
  generateAi,
  confirmAi,
  setAiSide,
  aiSide,
  resetAi,
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { k: "prebuilt", l: "Pre-Built" },
          { k: "upload", l: "Upload" },
          { k: "ai", l: "AI Generate" },
          { k: null, l: "None" },
        ].map(({ k, l }) => (
          <button
            key={l}
            style={{
              flex: 1,
              padding: "10px 8px",
              border: designMode === k ? "1px solid #0B2F4A" : "1px solid #ddd",
              background: designMode === k ? "#0B2F4A" : "#fff",
              color: designMode === k ? "#fff" : "#666",
              fontSize: 10,
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 600,
              letterSpacing: "0.04em",
              cursor: "pointer",
              borderRadius: 6,
              textAlign: "center",
            }}
            onClick={() => {
              setDesignMode(k);
              if (k === null) setDesign(null);
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {designMode === "prebuilt" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
          {PRE_DESIGNS.map((d) => (
            <div
              key={d.id}
              style={{
                padding: "15px 8px",
                border: design?.id === d.id ? "2px solid #0B2F4A" : "2px solid #eee",
                borderRadius: 10,
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                background: design?.id === d.id ? "#f0f6fa" : "#fff",
              }}
              onClick={() => setDesign(d)}
            >
              <span style={{ fontSize: 30 }}>{d.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#555" }}>{d.name}</span>
            </div>
          ))}
        </div>
      )}

      {designMode === "upload" && (
        <div style={{ border: "2px dashed #ddd", borderRadius: 14, padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 34, color: "#bbb", marginBottom: 8 }}>{"\u2191"}</div>
          <button
            style={{
              background: "#fff",
              color: "#0B2F4A",
              border: "2px solid #0B2F4A",
              padding: "8px 18px",
              fontSize: 11,
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 5,
              marginTop: 8,
            }}
            onClick={() => setDesign({ id: "uploaded-" + side, name: "Uploaded Logo", icon: "\ud83d\udcc1", svg: null })}
          >
            SIMULATE UPLOAD
          </button>
          {design?.id === "uploaded-" + side && (
            <div style={{ color: "#2a8a4a", fontSize: 12, marginTop: 10, fontWeight: 600 }}>
              {"\u2713"} Logo uploaded for {side}
            </div>
          )}
        </div>
      )}

      {designMode === "ai" && (
        <div>
          <textarea
            style={{
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 13,
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              color: "#333",
            }}
            rows={3}
            placeholder={`Describe the ${side} design\u2026`}
            value={aiSide === side ? aiPrompt : ""}
            onChange={(e) => {
              setAiSide(side);
              setAiPrompt(e.target.value);
            }}
          />
          <button
            style={{
              ...BS.btnP,
              marginTop: 8,
              width: "100%",
              opacity: aiLoading || !(aiSide === side && aiPrompt) ? 0.5 : 1,
            }}
            onClick={generateAi}
            disabled={aiLoading || !(aiSide === side && aiPrompt)}
          >
            {aiLoading && aiSide === side ? "GENERATING\u2026" : "GENERATE DESIGN"}
          </button>
          {aiResult && aiSide === side && !aiConfirmed && (
            <div style={{ marginTop: 18, padding: 18, border: "2px solid #ddd", borderRadius: 10, background: "#fafafa" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>
                GENERATED DESIGN
              </div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: "8px 0" }}>{aiResult.description}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button style={BS.btnS} onClick={resetAi}>
                  Try Again
                </button>
                <button style={BS.btnP} onClick={confirmAi}>
                  USE THIS DESIGN
                </button>
              </div>
            </div>
          )}
          {aiConfirmed && (
            <div style={{ marginTop: 18, padding: 16, border: "2px solid #2a8a4a", borderRadius: 10, background: "#f6fdf8" }}>
              <div style={{ color: "#2a8a4a", fontWeight: 700, fontSize: 12 }}>
                {"\u2713"} Design confirmed for {side}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

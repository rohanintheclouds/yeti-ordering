import { CATEGORIES } from "../data/products";
import { PRODUCTS } from "../data/products";
import ProductPreview from "../components/ProductPreview";
import { BS } from "../styles/theme";

export default function HomePage({ setSelectedCategory, setPage }) {
  return (
    <>
      <div style={{ background: "linear-gradient(170deg,#0B2F4A 0%,#0d3a58 50%,#1a4f6e 100%)", padding: "110px 24px 130px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 58, fontWeight: 900, letterSpacing: "0.05em", color: "#fff", lineHeight: 1.08, margin: "0 0 18px" }}>
            BUILT FOR{"\n"}THE WILD
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 36px", maxWidth: 480 }}>
            Custom branded YETI products with intelligent fulfillment, premium design tools, and seamless delivery.
          </p>
          <button
            style={BS.btnAccent}
            onClick={() => {
              setSelectedCategory("Bottles");
              setPage("browse");
            }}
          >
            SHOP CUSTOM PRODUCTS
          </button>
        </div>
        <svg viewBox="0 0 1200 200" style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}>
          <polygon points="0,200 80,100 160,150 280,50 420,130 520,40 680,110 800,30 920,90 1020,55 1120,105 1200,70 1200,200" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 80px" }}>
        <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 28, color: "#0B2F4A" }}>
          SHOP BY CATEGORY
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {CATEGORIES.map((cat) => {
            const sample = PRODUCTS.find((p) => p.category === cat);
            return (
              <div
                key={cat}
                style={{ background: "#f6f6f4", borderRadius: 14, padding: "36px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.25s", border: "2px solid transparent" }}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage("browse");
                }}
              >
                <div style={{ height: 170, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <ProductPreview product={sample} color="#2B2B2B" />
                </div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.1em", color: "#0B2F4A" }}>
                  {cat.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 5 }}>{PRODUCTS.filter((p) => p.category === cat).length} products</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

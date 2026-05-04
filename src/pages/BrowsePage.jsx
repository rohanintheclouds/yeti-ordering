import { PRODUCTS, CATEGORIES } from "../data/products";
import ProductPreview from "../components/ProductPreview";
import { fmt } from "../utils/helpers";

export default function BrowsePage({ selectedCategory, setSelectedCategory, startCustomize }) {
  const prods = PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
      <div style={{ padding: "36px 0 8px" }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 34, fontWeight: 700, letterSpacing: "0.08em", color: "#0B2F4A", margin: 0 }}>
          {selectedCategory.toUpperCase()}
        </h1>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 28, borderBottom: "2px solid #eee", paddingBottom: 14 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            style={{
              background: selectedCategory === c ? "#0B2F4A" : "transparent",
              color: selectedCategory === c ? "#fff" : "#888",
              border: "none",
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              cursor: "pointer",
              padding: "7px 18px",
              borderRadius: 20,
            }}
            onClick={() => setSelectedCategory(c)}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 22 }}>
        {prods.map((p) => (
          <div key={p.id} style={{ background: "#f9f9f7", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid #eee" }} onClick={() => startCustomize(p)}>
            <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", background: "#f2f2ef", padding: 18 }}>
              <ProductPreview product={p} color="#2B2B2B" />
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 700, color: "#0B2F4A", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 7 }}>{p.sizeLabel}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1F7EA6" }}>From {fmt(p.basePrice)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

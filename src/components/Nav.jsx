import { CATEGORIES } from "../data/products";

export default function Nav({ page, selectedCategory, setSelectedCategory, setPage, loggedIn, loyaltyPoints, userName, setLoggedIn, setUserName, setShowLogin, bag }) {
  return (
    <nav style={{ background: "#0B2F4A", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: "0.25em", color: "#fff", cursor: "pointer" }}
          onClick={() => setPage("home")}
        >
          YETI
        </span>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {CATEGORIES.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: page === "browse" && selectedCategory === c ? "#fff" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                borderBottom: page === "browse" && selectedCategory === c ? "2px solid #1F7EA6" : "2px solid transparent",
                paddingBottom: 2,
              }}
              onClick={() => {
                setSelectedCategory(c);
                setPage("browse");
              }}
            >
              {c.toUpperCase()}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {loggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 12px 4px 8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span style={{ color: "#E6F000", fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>
                  {loyaltyPoints.toLocaleString()}
                </span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                {userName}
              </span>
              <span
                style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, cursor: "pointer" }}
                onClick={() => {
                  setLoggedIn(false);
                  setUserName("");
                }}
              >
                Sign Out
              </span>
            </div>
          ) : (
            <span
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, cursor: "pointer" }}
              onClick={() => setShowLogin(true)}
            >
              SIGN IN
            </span>
          )}
          <span style={{ color: "#fff", cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }} onClick={() => bag.length > 0 && setPage("bag")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {bag.length > 0 && (
              <span style={{ position: "absolute", top: -6, right: -10, background: "#1F7EA6", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {bag.length}
              </span>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}

import { BS } from "../styles/theme";

export default function LoginModal({ show, loginEmail, loginPass, setLoginEmail, setLoginPass, onLogin, onClose }) {
  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "40px 36px", maxWidth: 380, width: "90%" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 20, fontWeight: 700, color: "#0B2F4A", margin: "0 0 6px", letterSpacing: "0.05em" }}>
          SIGN IN
        </h3>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>Sign in to your YETI account</p>
        <div style={BS.label}>EMAIL</div>
        <input style={BS.inp} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" />
        <div style={BS.label}>PASSWORD</div>
        <input style={BS.inp} type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"} />
        <button style={{ ...BS.btnP, width: "100%", marginTop: 8 }} onClick={onLogin}>
          SIGN IN
        </button>
        <p
          style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 14, cursor: "pointer" }}
          onClick={() => {
            setLoginEmail("demo@yeti.com");
            setLoginPass("demo");
            setTimeout(onLogin, 200);
          }}
        >
          Use demo account
        </p>
      </div>
    </div>
  );
}

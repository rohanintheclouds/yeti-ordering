import { BS } from "../styles/theme";

export default function AuthPrompt({ show, onSignIn, onCreate, onGuest, onClose }) {
  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "40px 36px", maxWidth: 420, width: "90%" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 20, fontWeight: 700, color: "#0B2F4A", margin: "0 0 6px" }}>
          BEFORE YOU CONTINUE
        </h3>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px", lineHeight: 1.6 }}>
          Sign in to earn loyalty points and save your order details, or continue as a guest.
        </p>
        <button style={{ ...BS.btnP, width: "100%", marginBottom: 10 }} onClick={onSignIn}>
          SIGN IN TO YOUR ACCOUNT
        </button>
        <button style={{ ...BS.btnS, width: "100%", marginBottom: 10 }} onClick={onCreate}>
          CREATE AN ACCOUNT
        </button>
        <button
          style={{ background: "none", border: "none", color: "#1F7EA6", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", textAlign: "center", padding: 8 }}
          onClick={onGuest}
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}

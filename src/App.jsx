import { useState, useMemo } from "react";
import Nav from "./components/Nav";
import LoginModal from "./components/LoginModal";
import AuthPrompt from "./components/AuthPrompt";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import CustomizePage from "./pages/CustomizePage";
import BagPage from "./pages/BagPage";
import LogisticsPage from "./pages/LogisticsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TrackingPage from "./pages/TrackingPage";
import { computePrice, resolveDelivery, LOYALTY_POINTS_PER_DOLLAR } from "./utils/delivery";

export default function App() {
  // ── Auth ──────────────────────────────────────────────
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [userName, setUserName] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(1240);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // ── Navigation ────────────────────────────────────────
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("Bottles");

  // ── Customization ─────────────────────────────────────
  const [customizing, setCustomizing] = useState(null);
  const [custColor, setCustColor] = useState("#2B2B2B");
  const [custQty, setCustQty] = useState(25);
  const [custColorSplits, setCustColorSplits] = useState({});
  const [custSplitMode, setCustSplitMode] = useState(false);
  const [custFrontDesignMode, setCustFrontDesignMode] = useState(null);
  const [custFrontDesign, setCustFrontDesign] = useState(null);
  const [custBackDesignMode, setCustBackDesignMode] = useState(null);
  const [custBackDesign, setCustBackDesign] = useState(null);
  const [custAiPrompt, setCustAiPrompt] = useState("");
  const [custAiResult, setCustAiResult] = useState(null);
  const [custAiLoading, setCustAiLoading] = useState(false);
  const [custAiConfirmed, setCustAiConfirmed] = useState(false);
  const [custAiSide, setCustAiSide] = useState("front");
  const [previewSide, setPreviewSide] = useState("front");
  const [showAddedModal, setShowAddedModal] = useState(false);

  // ── Bag ───────────────────────────────────────────────
  const [bag, setBag] = useState([]);
  const [editingBagIdx, setEditingBagIdx] = useState(null);

  // ── Logistics ─────────────────────────────────────────
  const [country, setCountry] = useState("United States");
  const [zipCode, setZipCode] = useState("");
  const [deliveryResults, setDeliveryResults] = useState(null);
  const [rushSelections, setRushSelections] = useState({});

  // ── Group order ───────────────────────────────────────
  const [groupLink, setGroupLink] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // ── Checkout ──────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [shipAddr, setShipAddr] = useState({ name: "", street: "", city: "", state: "", zip: "" });
  const [payInfo, setPayInfo] = useState({ card: "", exp: "", cvv: "" });
  const [orderNum, setOrderNum] = useState(null);
  const [orderStatus, setOrderStatus] = useState(0);
  const [trackingNum, setTrackingNum] = useState(null);

  // ── Computed values ───────────────────────────────────
  const currentItemPrice = useMemo(
    () => (customizing ? computePrice(customizing, custQty, custFrontDesignMode, custBackDesignMode) : 0),
    [customizing, custQty, custFrontDesignMode, custBackDesignMode]
  );

  const bagTotal = useMemo(() => {
    if (!deliveryResults) return bag.reduce((s, i) => s + i.price, 0);
    return bag.reduce((s, item) => {
      const dr = deliveryResults.find((r) => r.itemId === item.id);
      const rush = rushSelections[item.id] && dr?.rushOption ? dr.rushOption.fee : 0;
      const cross = dr?.surcharge || 0;
      return s + computePrice(item.product, item.qty, item.frontDesignMode, item.backDesignMode, rush, cross);
    }, 0);
  }, [bag, deliveryResults, rushSelections]);

  const earnedPoints = useMemo(() => Math.floor(bagTotal * LOYALTY_POINTS_PER_DOLLAR), [bagTotal]);

  // ── Handlers ──────────────────────────────────────────
  function startCustomize(product) {
    setCustomizing(product);
    setCustColor("#2B2B2B");
    setCustQty(25);
    setCustColorSplits({});
    setCustSplitMode(false);
    setCustFrontDesignMode(null);
    setCustFrontDesign(null);
    setCustBackDesignMode(null);
    setCustBackDesign(null);
    setCustAiPrompt("");
    setCustAiResult(null);
    setCustAiLoading(false);
    setCustAiConfirmed(false);
    setCustAiSide("front");
    setPreviewSide("front");
    setPage("customize");
  }

  function addToBag() {
    const colors = custSplitMode ? { ...custColorSplits } : { [custColor]: custQty };
    const placement =
      custFrontDesign && custBackDesign
        ? "front and back"
        : custFrontDesign
          ? "front"
          : custBackDesign
            ? "back"
            : "none";
    setBag((prev) => [
      ...prev,
      {
        id: Date.now(),
        product: customizing,
        qty: custQty,
        color: custColor,
        colorSplits: colors,
        splitMode: custSplitMode,
        frontDesignMode: custFrontDesignMode,
        frontDesign: custFrontDesign,
        backDesignMode: custBackDesignMode,
        backDesign: custBackDesign,
        placement,
        price: currentItemPrice,
      },
    ]);
    setShowAddedModal(true);
  }

  async function generateAiDesign() {
    setCustAiLoading(true);
    setCustAiConfirmed(false);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a product designer for YETI custom drinkware. A customer wants a custom design for the ${custAiSide} of their ${customizing?.name || "product"}. Their prompt: "${custAiPrompt}"\n\nGenerate a creative description (2-3 sentences). Return ONLY valid JSON: {"description":"..."}`,
            },
          ],
        }),
      });
      const data = await r.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      setCustAiResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch {
      setCustAiResult({
        description: `Custom artwork inspired by: "${custAiPrompt}". A stylized outdoor design for the ${custAiSide}, rendered in YETI\u2019s premium engraving aesthetic.`,
      });
    }
    setCustAiLoading(false);
  }

  function confirmAiDesign() {
    setCustAiConfirmed(true);
    const d = { id: "ai-custom", name: "AI Custom", icon: "\u2728", svg: null };
    if (custAiSide === "front") {
      setCustFrontDesign(d);
      setCustFrontDesignMode("ai");
    } else {
      setCustBackDesign(d);
      setCustBackDesignMode("ai");
    }
  }

  function resetAi() {
    setCustAiResult(null);
    setCustAiConfirmed(false);
  }

  function checkDelivery() {
    if (!country || !zipCode) return;
    const results = resolveDelivery(bag, country, zipCode);
    setDeliveryResults(results);
    setRushSelections({});
  }

  function handleProceedToLogistics() {
    if (!loggedIn) {
      setShowAuthPrompt(true);
      return;
    }
    setDeliveryResults(null);
    setPage("logistics");
  }

  function doLogin() {
    setLoggedIn(true);
    setUserName(loginEmail.split("@")[0] || "User");
    setShowLogin(false);
    setShowAuthPrompt(false);
    setLoginEmail("");
    setLoginPass("");
  }

  function generateGroupLink() {
    setGroupLink("https://yeti.com/group/" + Math.random().toString(36).substring(2, 8).toUpperCase());
    setShowGroupModal(true);
  }

  function submitOrder() {
    setOrderNum("YETI-" + Date.now().toString().slice(-8));
    setOrderStatus(0);
    setTrackingNum(null);
    if (loggedIn) setLoyaltyPoints((p) => p + earnedPoints);
    setPage("tracking");
  }

  // ── Shared nav props ──────────────────────────────────
  const navProps = {
    page,
    selectedCategory,
    setSelectedCategory,
    setPage,
    loggedIn,
    loyaltyPoints,
    userName,
    setLoggedIn,
    setUserName,
    setShowLogin,
    bag,
  };

  // ── Render ────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setSelectedCategory={setSelectedCategory} setPage={setPage} />;

      case "browse":
        return <BrowsePage selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} startCustomize={startCustomize} />;

      case "customize":
        if (!customizing) return null;
        return (
          <CustomizePage
            customizing={customizing}
            setPage={setPage}
            custQty={custQty}
            setCustQty={setCustQty}
            custColor={custColor}
            setCustColor={setCustColor}
            custSplitMode={custSplitMode}
            setCustSplitMode={setCustSplitMode}
            custColorSplits={custColorSplits}
            setCustColorSplits={setCustColorSplits}
            custFrontDesignMode={custFrontDesignMode}
            setCustFrontDesignMode={setCustFrontDesignMode}
            custFrontDesign={custFrontDesign}
            setCustFrontDesign={setCustFrontDesign}
            custBackDesignMode={custBackDesignMode}
            setCustBackDesignMode={setCustBackDesignMode}
            custBackDesign={custBackDesign}
            setCustBackDesign={setCustBackDesign}
            custAiPrompt={custAiPrompt}
            setCustAiPrompt={setCustAiPrompt}
            custAiResult={custAiResult}
            custAiLoading={custAiLoading}
            custAiConfirmed={custAiConfirmed}
            custAiSide={custAiSide}
            setCustAiSide={setCustAiSide}
            generateAiDesign={generateAiDesign}
            confirmAiDesign={confirmAiDesign}
            resetAi={resetAi}
            previewSide={previewSide}
            setPreviewSide={setPreviewSide}
            currentItemPrice={currentItemPrice}
            addToBag={addToBag}
            showAddedModal={showAddedModal}
            setShowAddedModal={setShowAddedModal}
          />
        );

      case "bag":
        return (
          <BagPage
            bag={bag}
            setBag={setBag}
            editingBagIdx={editingBagIdx}
            setEditingBagIdx={setEditingBagIdx}
            loggedIn={loggedIn}
            earnedPoints={earnedPoints}
            setPage={setPage}
            handleProceedToLogistics={handleProceedToLogistics}
            generateGroupLink={generateGroupLink}
            showGroupModal={showGroupModal}
            setShowGroupModal={setShowGroupModal}
            groupLink={groupLink}
          />
        );

      case "logistics":
        return (
          <LogisticsPage
            bag={bag}
            country={country}
            setCountry={setCountry}
            zipCode={zipCode}
            setZipCode={setZipCode}
            deliveryResults={deliveryResults}
            setDeliveryResults={setDeliveryResults}
            rushSelections={rushSelections}
            setRushSelections={setRushSelections}
            checkDelivery={checkDelivery}
            bagTotal={bagTotal}
            setPage={setPage}
          />
        );

      case "checkout":
        return (
          <CheckoutPage
            bag={bag}
            loggedIn={loggedIn}
            userName={userName}
            loginEmail={loginEmail}
            email={email}
            setEmail={setEmail}
            shipAddr={shipAddr}
            setShipAddr={setShipAddr}
            payInfo={payInfo}
            setPayInfo={setPayInfo}
            deliveryResults={deliveryResults}
            rushSelections={rushSelections}
            bagTotal={bagTotal}
            earnedPoints={earnedPoints}
            submitOrder={submitOrder}
          />
        );

      case "tracking":
        return (
          <TrackingPage
            bag={bag}
            loggedIn={loggedIn}
            userName={userName}
            email={email}
            orderNum={orderNum}
            orderStatus={orderStatus}
            setOrderStatus={setOrderStatus}
            trackingNum={trackingNum}
            setTrackingNum={setTrackingNum}
            earnedPoints={earnedPoints}
            bagTotal={bagTotal}
            setBag={setBag}
            setPage={setPage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Helvetica Neue',Helvetica,sans-serif", color: "#1a1a1a" }}>
      <Nav {...navProps} />
      <LoginModal
        show={showLogin}
        loginEmail={loginEmail}
        loginPass={loginPass}
        setLoginEmail={setLoginEmail}
        setLoginPass={setLoginPass}
        onLogin={doLogin}
        onClose={() => setShowLogin(false)}
      />
      <AuthPrompt
        show={showAuthPrompt}
        onSignIn={() => {
          setShowAuthPrompt(false);
          setShowLogin(true);
        }}
        onCreate={() => {
          setLoginEmail("new@yeti.com");
          setShowAuthPrompt(false);
          setShowLogin(true);
        }}
        onGuest={() => {
          setShowAuthPrompt(false);
          setDeliveryResults(null);
          setPage("logistics");
        }}
        onClose={() => setShowAuthPrompt(false)}
      />
      {renderPage()}
    </div>
  );
}

import BottleSVG from "./svg/BottleSVG";
import TumblerSVG from "./svg/TumblerSVG";
import CoolerSVG from "./svg/CoolerSVG";
import OtherSVG from "./svg/OtherSVG";

export default function ProductPreview({ product, color, design, placement, side }) {
  if (!product) return null;
  const c = color || "#2B2B2B";
  const props = { color: c, heightFactor: product.heightFactor, design, placement, side };

  if (product.shape === "tumbler") return <TumblerSVG {...props} />;
  if (product.shape === "bottle") return <BottleSVG {...props} />;
  if (product.shape === "cooler") return <CoolerSVG {...props} />;
  return <OtherSVG {...props} shape={product.shape} />;
}

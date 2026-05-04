import { SUPPLIERS } from "../data/suppliers";
import { PRODUCTS } from "../data/products";
import { COLORS_DATA } from "../data/colors";

function buildInventory() {
  const inv = {};
  let seed = 42;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  SUPPLIERS.forEach((s) => {
    inv[s.id] = {};
    PRODUCTS.forEach((p) => {
      COLORS_DATA.forEach((c) => {
        if (rng() < 0.58) {
          inv[s.id][p.id + "-" + c.hex.replace("#", "").toLowerCase()] =
            Math.floor(rng() * 400) + 10;
        }
      });
    });
  });
  return inv;
}

export const INVENTORY = buildInventory();

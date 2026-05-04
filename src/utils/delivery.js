import { REGIONS } from "../data/regions";
import { SUPPLIERS } from "../data/suppliers";
import { INVENTORY } from "./inventory";
import { addDays } from "./helpers";

export const CROSS_REGION_FEE = 15;
export const RUSH_FEE_MULT = 0.25;
export const CUSTOM_FEE = 3;
export const LOYALTY_POINTS_PER_DOLLAR = 2;

export function getRegionForCountry(cn, zip) {
  if (cn === "United States") {
    const n = parseInt(zip) || 0;
    if (n >= 90000) return "us-west";
    if (n >= 60000) return "us-central";
    return "us-east";
  }
  if (cn === "Canada") {
    return "VTRB".includes((zip || "").charAt(0).toUpperCase())
      ? "ca-west"
      : "ca-east";
  }
  for (const r of REGIONS) {
    if (r.countries.includes(cn)) return r.id;
  }
  return "eu-west";
}

export function computePrice(product, qty, frontDM, backDM, rushFee, crossFee) {
  let base = product.basePrice * qty;
  if (frontDM === "ai" || frontDM === "upload") base += CUSTOM_FEE * qty;
  if (backDM === "ai" || backDM === "upload") base += CUSTOM_FEE * qty;
  base += (rushFee || 0) + (crossFee || 0);
  return base;
}

export function resolveDelivery(bagItems, country, zipCode) {
  const userRegion = getRegionForCountry(country, zipCode);
  const today = new Date();
  const results = [];

  bagItems.forEach((item) => {
    const skus = item.splitMode
      ? Object.entries(item.colorSplits)
          .filter(([, q]) => q > 0)
          .map(([hex, q]) => ({
            sku: item.product.id + "-" + hex.replace("#", "").toLowerCase(),
            qty: q,
          }))
      : [
          {
            sku:
              item.product.id +
              "-" +
              item.color.replace("#", "").toLowerCase(),
            qty: item.qty,
          },
        ];

    let bestLocal = null;
    let bestCross = null;

    SUPPLIERS.forEach((sup) => {
      const inv = INVENTORY[sup.id] || {};
      let canFulfill = true;
      let totalAvail = 0;
      skus.forEach(({ sku, qty }) => {
        const a = inv[sku] || 0;
        totalAvail += Math.min(a, qty);
        if (a < qty) canFulfill = false;
      });
      if (!canFulfill && totalAvail < item.qty * 0.5) return;

      const same = sup.region === userRegion;
      const shipDays = same ? 2 : 6;
      const totalDays = sup.leadDays + shipDays + 2;
      const deliveryDate = addDays(today, totalDays);
      const rushDays = Math.max(Math.floor(sup.leadDays * 0.6), 2);
      const rushTotalDays = rushDays + shipDays + 1;
      const rushDate = addDays(today, rushTotalDays);
      const crossFee = same ? 0 : CROSS_REGION_FEE * item.qty;

      const entry = {
        supplierId: sup.id,
        sameRegion: same,
        canFulfill,
        totalAvail,
        deliveryDate,
        rushDate,
        totalDays,
        rushTotalDays,
        daysSaved: totalDays - rushTotalDays,
        crossFee,
        rating: sup.rating,
        score:
          (canFulfill ? 40 : 15) +
          (same ? 30 : 0) +
          sup.rating * 3 -
          totalDays * 0.5,
      };

      if (same) {
        if (!bestLocal || entry.score > bestLocal.score) bestLocal = entry;
      } else {
        if (!bestCross || entry.score > bestCross.score) bestCross = entry;
      }
    });

    const best = bestLocal || bestCross;
    const rushOption = best
      ? {
          date: best.rushDate,
          fee: Math.round(item.product.basePrice * item.qty * RUSH_FEE_MULT),
          daysSaved: best.daysSaved,
        }
      : null;

    results.push({
      itemId: item.id,
      available: !!best,
      inRegion: !!bestLocal,
      deliveryDate: best?.deliveryDate || addDays(today, 21),
      surcharge: best?.crossFee || 0,
      rushOption,
      fulfillment: best?.canFulfill ? "full" : "partial",
    });
  });

  return results;
}

export const fmt = (n) => "$" + n.toFixed(2);

export function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function fmtDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function genTrackingNum() {
  return (
    "YT" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    Math.floor(Math.random() * 9000 + 1000)
  );
}

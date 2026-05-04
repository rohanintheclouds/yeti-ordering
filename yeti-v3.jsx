import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   YETI ORDER MANAGEMENT SYSTEM — ITERATION 3
   Simplified logistics, hidden supplier complexity, account/loyalty,
   independent front/back designs, group orders, tracking numbers,
   email confirmation, rush upgrade flow.
   ═══════════════════════════════════════════════════════════════════════════ */

const COLORS_DATA = [
  { name: "Charcoal", hex: "#2B2B2B" }, { name: "Off White", hex: "#F4F4F2" },
  { name: "Navy", hex: "#2F3A44" }, { name: "Deep Red", hex: "#C81F25" },
  { name: "Lime Green", hex: "#8ED13F" }, { name: "Orange Red", hex: "#FF4A2A" },
  { name: "Speckled Blue", hex: "#7F8FA3" }, { name: "Slate Purple", hex: "#4B4A63" },
  { name: "Blush Pink", hex: "#E6D3D8" }, { name: "Periwinkle", hex: "#6A6CCF" },
  { name: "Neon Yellow", hex: "#E6F000" }, { name: "Warm Beige", hex: "#CFC9C2" },
  { name: "Coral Pink", hex: "#F0627A" }, { name: "Mint Green", hex: "#9FD5C0" },
  { name: "Light Gray", hex: "#C9C9C7" }, { name: "Metallic Gray", hex: "#8A8A8A" },
];

const PRODUCTS = [
  { id:"rambler-12", category:"Bottles", name:"Rambler\u00ae 12 oz Bottle", size:"12 oz", sizeLabel:"12 oz \u2014 Compact", basePrice:25, desc:"The everyday carry. Perfect for coffee, water, or a quick trail sip.", shape:"bottle", heightFactor:0.55 },
  { id:"rambler-18", category:"Bottles", name:"Rambler\u00ae 18 oz Bottle", size:"18 oz", sizeLabel:"18 oz \u2014 Standard", basePrice:30, desc:"Our most versatile bottle. Goes anywhere, holds plenty.", shape:"bottle", heightFactor:0.65 },
  { id:"rambler-26", category:"Bottles", name:"Rambler\u00ae 26 oz Bottle", size:"26 oz", sizeLabel:"26 oz \u2014 Large", basePrice:35, desc:"Full-day hydration for serious adventures.", shape:"bottle", heightFactor:0.78 },
  { id:"rambler-36", category:"Bottles", name:"Rambler\u00ae 36 oz Bottle", size:"36 oz", sizeLabel:"36 oz \u2014 XL", basePrice:42, desc:"Extended capacity for long hauls and base camps.", shape:"bottle", heightFactor:0.88 },
  { id:"rambler-46", category:"Bottles", name:"Rambler\u00ae 46 oz Bottle", size:"46 oz", sizeLabel:"46 oz \u2014 Max", basePrice:50, desc:"Maximum capacity. Built for expeditions.", shape:"bottle", heightFactor:1.0 },
  { id:"tumbler-20", category:"Bottles", name:"Rambler\u00ae 20 oz Tumbler", size:"20 oz", sizeLabel:"20 oz Tumbler", basePrice:28, desc:"Insulated tumbler with MagSlider\u2122 lid.", shape:"tumbler", heightFactor:0.7 },
  { id:"tumbler-30", category:"Bottles", name:"Rambler\u00ae 30 oz Tumbler", size:"30 oz", sizeLabel:"30 oz Tumbler", basePrice:34, desc:"Large tumbler for all-day sipping.", shape:"tumbler", heightFactor:0.85 },
  { id:"tundra-35", category:"Coolers", name:"Tundra\u00ae 35 Hard Cooler", size:"35 qt", sizeLabel:"35 Quart", basePrice:250, desc:"Weekend-ready. Fits a solid day\u2019s worth of provisions.", shape:"cooler", heightFactor:0.7 },
  { id:"tundra-45", category:"Coolers", name:"Tundra\u00ae 45 Hard Cooler", size:"45 qt", sizeLabel:"45 Quart", basePrice:300, desc:"The workhorse. Our most popular hard cooler size.", shape:"cooler", heightFactor:0.8 },
  { id:"tundra-65", category:"Coolers", name:"Tundra\u00ae 65 Hard Cooler", size:"65 qt", sizeLabel:"65 Quart", basePrice:350, desc:"Expedition-grade. For serious trips and serious crews.", shape:"cooler", heightFactor:1.0 },
  { id:"hopper-m20", category:"Coolers", name:"Hopper\u00ae M20 Soft Cooler", size:"20 L", sizeLabel:"20 Liter Soft", basePrice:275, desc:"Portable soft cooler backpack. Go anywhere.", shape:"softcooler", heightFactor:0.75 },
  { id:"lowball-10", category:"Drinkware", name:"Rambler\u00ae 10 oz Lowball", size:"10 oz", sizeLabel:"10 oz Lowball", basePrice:20, desc:"Stackable. Insulated. Built for camp mornings.", shape:"lowball", heightFactor:0.5 },
  { id:"colster-12", category:"Drinkware", name:"Colster\u00ae Can Insulator", size:"12 oz", sizeLabel:"12 oz Colster", basePrice:22, desc:"Keeps your standard can ice cold.", shape:"colster", heightFactor:0.55 },
  { id:"mug-14", category:"Drinkware", name:"Rambler\u00ae 14 oz Mug", size:"14 oz", sizeLabel:"14 oz Mug", basePrice:26, desc:"Camp mug perfected. Double-wall insulated.", shape:"mug", heightFactor:0.55 },
];

const CATEGORIES = ["Bottles","Coolers","Drinkware"];

const PRE_DESIGNS = [
  { id:"compass", name:"Compass Rose", icon:"\ud83e\udded", svg:"compass" },
  { id:"anchor", name:"Anchor", icon:"\u2693", svg:"anchor" },
  { id:"mountain", name:"Mountain Range", icon:"\ud83c\udfd4\ufe0f", svg:"mountain" },
  { id:"pine", name:"Pine Tree", icon:"\ud83c\udf32", svg:"pine" },
  { id:"wave", name:"Ocean Wave", icon:"\ud83c\udf0a", svg:"wave" },
  { id:"trail", name:"Trail Marker", icon:"\ud83e\udd7e", svg:"trail" },
  { id:"campfire", name:"Campfire", icon:"\ud83d\udd25", svg:"campfire" },
  { id:"sunrise", name:"Sunrise", icon:"\ud83c\udf05", svg:"sunrise" },
];

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Cambodia","Cameroon","Canada","Chile","China","Colombia","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Fiji","Finland","France","Georgia","Germany","Ghana","Greece","Guatemala","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Libya","Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali","Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

const REGIONS = [
  { id:"us-west", name:"US West", countries:["United States"] },
  { id:"us-east", name:"US East", countries:["United States"] },
  { id:"us-central", name:"US Central", countries:["United States"] },
  { id:"ca-east", name:"Canada East", countries:["Canada"] },
  { id:"ca-west", name:"Canada West", countries:["Canada"] },
  { id:"eu-west", name:"Europe West", countries:["France","Spain","Portugal","Ireland","Belgium","Netherlands","Luxembourg","Monaco"] },
  { id:"eu-central", name:"Europe Central", countries:["Germany","Austria","Switzerland","Poland","Czech Republic","Slovakia","Hungary","Slovenia","Croatia"] },
  { id:"eu-north", name:"Europe North", countries:["Sweden","Norway","Denmark","Finland","Iceland","Estonia","Latvia","Lithuania"] },
  { id:"uk", name:"United Kingdom", countries:["United Kingdom"] },
  { id:"au", name:"Australia/NZ", countries:["Australia","New Zealand"] },
  { id:"jp", name:"Japan/Korea", countries:["Japan","South Korea","Taiwan"] },
  { id:"mx", name:"Mexico/Central Am.", countries:["Mexico","Guatemala","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Belize"] },
  { id:"sa", name:"South America", countries:["Brazil","Argentina","Chile","Colombia","Peru","Ecuador","Bolivia","Paraguay","Uruguay","Venezuela"] },
  { id:"mena", name:"Middle East", countries:["Saudi Arabia","United Arab Emirates","Qatar","Kuwait","Bahrain","Oman","Jordan","Lebanon","Israel","Iraq","Iran","Egypt","Turkey"] },
  { id:"sea", name:"Southeast Asia", countries:["Singapore","Malaysia","Thailand","Vietnam","Philippines","Indonesia","Myanmar","Cambodia","Brunei"] },
  { id:"sa-asia", name:"South Asia", countries:["India","Pakistan","Bangladesh","Sri Lanka","Nepal","Bhutan","Maldives"] },
  { id:"africa", name:"Africa", countries:["South Africa","Nigeria","Kenya","Ghana","Ethiopia","Tanzania","Uganda","Senegal","Cameroon","Morocco","Tunisia","Algeria","Mozambique","Madagascar","Rwanda","Botswana","Zimbabwe","Zambia"] },
];

const SUPPLIERS = [
  { id:"S001",name:"Pacific Custom Co.",region:"us-west",leadDays:5,rating:4.8 },
  { id:"S002",name:"Western Engravings",region:"us-west",leadDays:7,rating:4.5 },
  { id:"S003",name:"Atlantic Print Works",region:"us-east",leadDays:4,rating:4.9 },
  { id:"S004",name:"East Coast Customs",region:"us-east",leadDays:6,rating:4.6 },
  { id:"S005",name:"Heartland Imprints",region:"us-central",leadDays:5,rating:4.7 },
  { id:"S006",name:"Prairie Engravings",region:"us-central",leadDays:8,rating:4.3 },
  { id:"S007",name:"Maple Leaf Customs",region:"ca-east",leadDays:6,rating:4.6 },
  { id:"S008",name:"Vancouver Print Co.",region:"ca-west",leadDays:7,rating:4.4 },
  { id:"S009",name:"Euro Print Masters",region:"eu-west",leadDays:8,rating:4.7 },
  { id:"S010",name:"Berlin Custom Works",region:"eu-central",leadDays:7,rating:4.5 },
  { id:"S011",name:"London Engravings",region:"uk",leadDays:5,rating:4.8 },
  { id:"S012",name:"Sydney Print Co.",region:"au",leadDays:9,rating:4.4 },
  { id:"S013",name:"Tokyo Custom Works",region:"jp",leadDays:6,rating:4.9 },
  { id:"S014",name:"Monterrey Imprints",region:"mx",leadDays:7,rating:4.3 },
  { id:"S015",name:"Great Lakes Custom",region:"us-central",leadDays:4,rating:4.8 },
  { id:"S016",name:"Rocky Mountain Prints",region:"us-west",leadDays:6,rating:4.6 },
  { id:"S017",name:"Nordic Print AB",region:"eu-north",leadDays:9,rating:4.2 },
  { id:"S018",name:"Queensland Customs",region:"au",leadDays:10,rating:4.1 },
  { id:"S019",name:"S\u00e3o Paulo Engravings",region:"sa",leadDays:10,rating:4.3 },
  { id:"S020",name:"Dubai Print House",region:"mena",leadDays:8,rating:4.5 },
  { id:"S021",name:"Singapore Customs Co.",region:"sea",leadDays:7,rating:4.7 },
  { id:"S022",name:"Mumbai Print Works",region:"sa-asia",leadDays:9,rating:4.2 },
  { id:"S023",name:"Cape Town Customs",region:"africa",leadDays:11,rating:4.0 },
  { id:"S024",name:"Stockholm Prints",region:"eu-north",leadDays:7,rating:4.6 },
];

function buildInventory() {
  const inv = {}; let seed = 42;
  const rng = () => { seed=(seed*16807)%2147483647; return(seed-1)/2147483646; };
  SUPPLIERS.forEach(s => { inv[s.id]={}; PRODUCTS.forEach(p => { COLORS_DATA.forEach(c => { if(rng()<0.58){ inv[s.id][p.id+"-"+c.hex.replace("#","").toLowerCase()]=Math.floor(rng()*400)+10; }}); }); });
  return inv;
}
const INVENTORY = buildInventory();

function getRegionForCountry(cn, zip) {
  if(cn==="United States"){ const n=parseInt(zip)||0; if(n>=90000)return"us-west"; if(n>=60000)return"us-central"; return"us-east"; }
  if(cn==="Canada"){ return"VTRB".includes((zip||"").charAt(0).toUpperCase())?"ca-west":"ca-east"; }
  for(const r of REGIONS){ if(r.countries.includes(cn))return r.id; }
  return"eu-west";
}

const CROSS_REGION_FEE = 15;
const RUSH_FEE_MULT = 0.25;
const CUSTOM_FEE = 3;
const LOYALTY_POINTS_PER_DOLLAR = 2;
const fmt = n => "$"+n.toFixed(2);
function isLight(hex){ const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return(r*299+g*587+b*114)/1000>170; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function fmtDate(d){ return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"}); }
function genTrackingNum(){ return "YT"+Math.random().toString(36).substring(2,6).toUpperCase()+Math.floor(Math.random()*9000+1000); }

// ─── Backend: Delivery Resolution Engine ────────────────────────────────────
// Hidden from user — resolves best supplier, delivery date, surcharges
function resolveDelivery(bagItems, country, zipCode) {
  const userRegion = getRegionForCountry(country, zipCode);
  const today = new Date();
  const results = [];

  bagItems.forEach(item => {
    const skus = item.splitMode
      ? Object.entries(item.colorSplits).filter(([,q])=>q>0).map(([hex,q])=>({sku:item.product.id+"-"+hex.replace("#","").toLowerCase(),qty:q}))
      : [{sku:item.product.id+"-"+item.color.replace("#","").toLowerCase(),qty:item.qty}];

    let bestLocal = null, bestCross = null;

    SUPPLIERS.forEach(sup => {
      const inv = INVENTORY[sup.id]||{};
      let canFulfill = true, totalAvail = 0;
      skus.forEach(({sku,qty}) => { const a=inv[sku]||0; totalAvail+=Math.min(a,qty); if(a<qty) canFulfill=false; });
      if(!canFulfill && totalAvail < item.qty * 0.5) return; // skip if < 50% available

      const same = sup.region === userRegion;
      const shipDays = same ? 2 : 6;
      const totalDays = sup.leadDays + shipDays + 2; // +2 for processing
      const deliveryDate = addDays(today, totalDays);
      const rushDays = Math.max(Math.floor(sup.leadDays * 0.6), 2);
      const rushTotalDays = rushDays + shipDays + 1;
      const rushDate = addDays(today, rushTotalDays);
      const crossFee = same ? 0 : CROSS_REGION_FEE * item.qty;

      const entry = { supplierId:sup.id, sameRegion:same, canFulfill, totalAvail, deliveryDate, rushDate, totalDays, rushTotalDays, daysSaved: totalDays - rushTotalDays, crossFee, rating:sup.rating, score: (canFulfill?40:15)+(same?30:0)+sup.rating*3-(totalDays*0.5) };

      if(same) { if(!bestLocal || entry.score > bestLocal.score) bestLocal = entry; }
      else { if(!bestCross || entry.score > bestCross.score) bestCross = entry; }
    });

    const best = bestLocal || bestCross;
    const rushOption = best ? { date: best.rushDate, fee: Math.round(item.product.basePrice * item.qty * RUSH_FEE_MULT), daysSaved: best.daysSaved } : null;

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

// ─── SVG Design Shapes ──────────────────────────────────────────────────────
function DesignOverlay({ design, cx, cy, size }) {
  if(!design) return null;
  const s = size||40;
  const shapes = {
    compass:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><polygon points="50,12 54,44 50,36 46,44" fill="white" opacity=".85"/><polygon points="50,88 46,56 50,64 54,56" fill="white" opacity=".5"/><line x1="12" y1="50" x2="88" y2="50" stroke="white" strokeWidth="1.5" opacity=".35"/></g>,
    anchor:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><circle cx="50" cy="20" r="9" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><line x1="50" y1="29" x2="50" y2="82" stroke="white" strokeWidth="2.5" opacity=".8"/><path d="M26,68 Q50,92 74,68" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><line x1="36" y1="44" x2="64" y2="44" stroke="white" strokeWidth="2.5" opacity=".65"/></g>,
    mountain:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><polygon points="50,12 88,82 12,82" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><polygon points="36,44 50,12 64,44" fill="white" opacity=".12"/><polyline points="32,82 56,48 70,62 84,44" fill="none" stroke="white" strokeWidth="1.8" opacity=".45"/></g>,
    pine:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><polygon points="50,10 68,38 32,38" fill="white" opacity=".65"/><polygon points="50,26 73,52 27,52" fill="white" opacity=".5"/><polygon points="50,40 78,70 22,70" fill="white" opacity=".38"/><rect x="44" y="70" width="12" height="18" fill="white" opacity=".55"/></g>,
    wave:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><path d="M8,50 Q22,26 38,50 Q54,74 68,50 Q82,26 98,50" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><path d="M8,64 Q22,40 38,64 Q54,88 68,64 Q82,40 98,64" fill="none" stroke="white" strokeWidth="1.8" opacity=".45"/></g>,
    trail:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><path d="M32,82 L50,18 L68,82" fill="none" stroke="white" strokeWidth="2.5" opacity=".8"/><line x1="37" y1="62" x2="63" y2="62" stroke="white" strokeWidth="1.8" opacity=".55"/><circle cx="50" cy="18" r="5" fill="white" opacity=".65"/></g>,
    campfire:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><path d="M50,16 Q60,34 50,54 Q40,34 50,16" fill="white" opacity=".65"/><path d="M39,26 Q49,44 39,58" fill="none" stroke="white" strokeWidth="1.8" opacity=".45"/><path d="M61,26 Q51,44 61,58" fill="none" stroke="white" strokeWidth="1.8" opacity=".45"/><line x1="26" y1="72" x2="74" y2="72" stroke="white" strokeWidth="2.5" opacity=".55"/></g>,
    sunrise:<g transform={`translate(${cx-s/2},${cy-s/2}) scale(${s/100})`}><path d="M10,58 Q50,12 90,58" fill="white" opacity=".15"/><circle cx="50" cy="40" r="14" fill="white" opacity=".55"/><line x1="50" y1="16" x2="50" y2="8" stroke="white" strokeWidth="2" opacity=".6"/><line x1="26" y1="26" x2="20" y2="20" stroke="white" strokeWidth="2" opacity=".45"/><line x1="74" y1="26" x2="80" y2="20" stroke="white" strokeWidth="2" opacity=".45"/><line x1="10" y1="62" x2="90" y2="62" stroke="white" strokeWidth="2.5" opacity=".8"/></g>,
  };
  return shapes[design.svg||design.id] || <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s*.55} fill="rgba(255,255,255,0.75)">{design.icon||"\u2726"}</text>;
}

// ─── SVG Product Renderers ──────────────────────────────────────────────────
function BottleSVG({color,heightFactor,design,placement,side}){
  const hf=heightFactor||0.7,bodyH=100+hf*120,bodyW=52+hf*10,capW=bodyW-12,capH=18,startY=260-bodyH-capH-10,cx=130;
  const gid="bg"+color.replace("#","");
  // Determine which design to show based on side
  const showDesign = design && ((placement==="full wrap")||(side==="front"&&placement!=="back")||(side==="back"&&placement==="back")||(placement==="front and back"));
  const dk=isLight(color);
  return(<svg viewBox="0 0 260 280" style={{width:"100%",maxWidth:220,height:"auto"}}>
    <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.14)"/><stop offset="35%" stopColor="rgba(255,255,255,0)"/><stop offset="75%" stopColor="rgba(0,0,0,0.08)"/><stop offset="100%" stopColor="rgba(0,0,0,0.18)"/></linearGradient></defs>
    <ellipse cx={cx} cy={268} rx={bodyW*.55} ry={5} fill="rgba(0,0,0,0.06)"/>
    <rect x={cx-capW/2} y={startY} width={capW} height={capH} rx="5" fill="#5a5a5a"/>
    <rect x={cx-capW/2+3} y={startY+2} width={capW-6} height={3.5} rx="1.5" fill="rgba(255,255,255,0.12)"/>
    <rect x={cx-bodyW/2} y={startY+capH} width={bodyW} height={bodyH} rx="8" fill={color}/>
    <rect x={cx-bodyW/2} y={startY+capH} width={bodyW} height={bodyH} rx="8" fill={"url(#"+gid+")"}/>
    <rect x={cx-bodyW/2+2} y={startY+capH+bodyH-7} width={bodyW-4} height={7} rx="3.5" fill="rgba(0,0,0,0.08)"/>
    <text x={cx} y={startY+capH+13} textAnchor="middle" fontSize="7" fill={dk?"rgba(0,0,0,0.22)":"rgba(255,255,255,0.22)"} fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em">{(side||"front").toUpperCase()}</text>
    {showDesign && <DesignOverlay design={design} cx={cx} cy={startY+capH+bodyH*.44} size={bodyW*.62}/>}
  </svg>);
}
function TumblerSVG({color,heightFactor,design,placement,side}){
  const hf=heightFactor||0.7,h=110+hf*80,topW=62,botW=52,cx=130,startY=260-h-15;
  const show=design&&((placement==="full wrap")||(side==="front"&&placement!=="back")||(side==="back"&&placement==="back")||(placement==="front and back"));
  const dk=isLight(color);
  return(<svg viewBox="0 0 260 280" style={{width:"100%",maxWidth:220,height:"auto"}}>
    <ellipse cx={cx} cy={268} rx={28} ry={4.5} fill="rgba(0,0,0,0.06)"/>
    <path d={`M${cx-topW/2},${startY+18} L${cx-botW/2},${startY+h} Q${cx-botW/2},${startY+h+8} ${cx-botW/2+8},${startY+h+8} L${cx+botW/2-8},${startY+h+8} Q${cx+botW/2},${startY+h+8} ${cx+botW/2},${startY+h} L${cx+topW/2},${startY+18} Z`} fill={color}/>
    <rect x={cx-topW/2-2} y={startY} width={topW+4} height={20} rx="5" fill="#555"/>
    <rect x={cx-topW/2+6} y={startY+4} width={topW-8} height={4.5} rx="2" fill="rgba(255,255,255,0.1)"/>
    <text x={cx} y={startY+33} textAnchor="middle" fontSize="7" fill={dk?"rgba(0,0,0,0.22)":"rgba(255,255,255,0.22)"} fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em">{(side||"front").toUpperCase()}</text>
    {show && <DesignOverlay design={design} cx={cx} cy={startY+18+(h-18)*.44} size={botW*.65}/>}
  </svg>);
}
function CoolerSVG({color,heightFactor,design}){
  const cx=140,w=200,h=110+(heightFactor||0.7)*40,y=250-h-30;
  return(<svg viewBox="0 0 280 260" style={{width:"100%",maxWidth:260,height:"auto"}}>
    <ellipse cx={cx} cy={252} rx={w*.4} ry={4.5} fill="rgba(0,0,0,0.06)"/>
    <rect x={cx-w/2} y={y+22} width={w} height={h} rx="10" fill={color}/><rect x={cx-w/2} y={y+22} width={w} height={h} rx="10" fill="rgba(0,0,0,0.03)"/>
    <rect x={cx-w/2-4} y={y} width={w+8} height={26} rx="6" fill={color}/><rect x={cx-w/2-4} y={y} width={w+8} height={26} rx="6" fill="rgba(255,255,255,0.07)"/>
    <rect x={cx-w/2+10} y={y+3} width={36} height={7} rx="3.5" fill="#777"/><rect x={cx+w/2-46} y={y+3} width={36} height={7} rx="3.5" fill="#777"/>
    <rect x={cx-w/2+18} y={y+28} width={13} height={4.5} rx="2" fill="#999"/><rect x={cx+w/2-31} y={y+28} width={13} height={4.5} rx="2" fill="#999"/>
    {design && <DesignOverlay design={design} cx={cx} cy={y+22+h*.48} size={Math.min(w*.28,h*.48)}/>}
  </svg>);
}
function OtherSVG({color,shape,design}){
  const cx=130;
  if(shape==="mug") return(<svg viewBox="0 0 260 240" style={{width:"100%",maxWidth:200,height:"auto"}}><ellipse cx={cx} cy={222} rx={36} ry={4.5} fill="rgba(0,0,0,0.06)"/><rect x={cx-36} y={62} width={72} height={96} rx="6" fill={color}/><path d={`M${cx+36},${82} Q${cx+66},${82} ${cx+66},${110} Q${cx+66},${138} ${cx+36},${138}`} fill="none" stroke="#888" strokeWidth="4.5"/><rect x={cx-36} y={158} width={72} height={5} rx="2.5" fill="rgba(0,0,0,0.08)"/>{design&&<DesignOverlay design={design} cx={cx} cy={115} size={38}/>}</svg>);
  if(shape==="softcooler") return(<svg viewBox="0 0 260 240" style={{width:"100%",maxWidth:220,height:"auto"}}><ellipse cx={cx} cy={225} rx={48} ry={4.5} fill="rgba(0,0,0,0.06)"/><path d={`M${cx-48},52 Q${cx-52},47 ${cx-38},42 L${cx+38},42 Q${cx+52},47 ${cx+48},52 L${cx+52},188 Q${cx+52},208 ${cx+38},208 L${cx-38},208 Q${cx-52},208 ${cx-52},188 Z`} fill={color}/><path d={`M${cx-28},42 Q${cx-28},17 ${cx},17 Q${cx+28},17 ${cx+28},42`} fill="none" stroke={color} strokeWidth="5.5"/><rect x={cx-43} y={47} width={86} height={7} rx="3" fill="rgba(0,0,0,0.1)"/>{design&&<DesignOverlay design={design} cx={cx} cy={130} size={48}/>}</svg>);
  return(<svg viewBox="0 0 260 220" style={{width:"100%",maxWidth:180,height:"auto"}}><ellipse cx={cx} cy={202} rx={34} ry={4.5} fill="rgba(0,0,0,0.06)"/><path d={`M${cx-34},72 L${cx-30},188 Q${cx-30},198 ${cx-20},198 L${cx+20},198 Q${cx+30},198 ${cx+30},188 L${cx+34},72 Q${cx+34},64 ${cx+24},64 L${cx-24},64 Q${cx-34},64 ${cx-34},72 Z`} fill={color}/><rect x={cx-34} y={60} width={68} height={9} rx="4" fill="rgba(0,0,0,0.08)"/>{design&&<DesignOverlay design={design} cx={cx} cy={140} size={34}/>}</svg>);
}

function ProductPreview({product,color,design,placement,side}){
  if(!product) return null;
  const c=color||"#2B2B2B", props={color:c,heightFactor:product.heightFactor,design,placement,side};
  if(product.shape==="tumbler") return <TumblerSVG {...props}/>;
  if(product.shape==="bottle") return <BottleSVG {...props}/>;
  if(product.shape==="cooler") return <CoolerSVG {...props}/>;
  return <OtherSVG {...props} shape={product.shape}/>;
}

function Section({title,children,defaultOpen}){
  const[open,setOpen]=useState(defaultOpen!==false);
  return(<div style={{borderTop:"1px solid #e8e8e8",paddingTop:18,marginTop:18}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",userSelect:"none"}} onClick={()=>setOpen(!open)}>
      <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.12em",color:"#0B2F4A"}}>{title}</span>
      <span style={{fontSize:14,color:"#999",transform:open?"rotate(180deg)":"none",transition:"0.2s"}}>{"\u25be"}</span>
    </div>
    {open&&<div style={{paddingTop:14}}>{children}</div>}
  </div>);
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const BS={
  btnP:{background:"#0B2F4A",color:"#fff",border:"none",padding:"13px 28px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",borderRadius:5,transition:"all 0.2s"},
  btnS:{background:"#fff",color:"#0B2F4A",border:"2px solid #0B2F4A",padding:"11px 24px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",borderRadius:5},
  btnAccent:{background:"#1F7EA6",color:"#fff",border:"none",padding:"13px 28px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",borderRadius:5},
  inp:{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"11px 13px",fontSize:14,boxSizing:"border-box",marginBottom:8,color:"#333",background:"#fff"},
  label:{fontFamily:"'Montserrat',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:"#888",marginBottom:8,display:"block"},
  card:{background:"#f9f9f7",borderRadius:12,padding:22,marginBottom:14},
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function YetiApp(){
  // Auth
  const[loggedIn,setLoggedIn]=useState(false);
  const[showLogin,setShowLogin]=useState(false);
  const[loginEmail,setLoginEmail]=useState("");
  const[loginPass,setLoginPass]=useState("");
  const[userName,setUserName]=useState("");
  const[loyaltyPoints,setLoyaltyPoints]=useState(1240);
  const[showAuthPrompt,setShowAuthPrompt]=useState(false);

  // Navigation
  const[page,setPage]=useState("home");
  const[selectedCategory,setSelectedCategory]=useState("Bottles");

  // Customization
  const[customizing,setCustomizing]=useState(null);
  const[custColor,setCustColor]=useState("#2B2B2B");
  const[custQty,setCustQty]=useState(25);
  const[custColorSplits,setCustColorSplits]=useState({});
  const[custSplitMode,setCustSplitMode]=useState(false);
  // Independent front/back designs
  const[custFrontDesignMode,setCustFrontDesignMode]=useState(null);
  const[custFrontDesign,setCustFrontDesign]=useState(null);
  const[custBackDesignMode,setCustBackDesignMode]=useState(null);
  const[custBackDesign,setCustBackDesign]=useState(null);
  const[custAiPrompt,setCustAiPrompt]=useState("");
  const[custAiResult,setCustAiResult]=useState(null);
  const[custAiLoading,setCustAiLoading]=useState(false);
  const[custAiConfirmed,setCustAiConfirmed]=useState(false);
  const[custAiSide,setCustAiSide]=useState("front"); // which side AI is generating for
  const[previewSide,setPreviewSide]=useState("front");
  const[showAddedModal,setShowAddedModal]=useState(false);

  // Bag
  const[bag,setBag]=useState([]);
  const[editingBagIdx,setEditingBagIdx]=useState(null);

  // Logistics (simplified)
  const[country,setCountry]=useState("United States");
  const[zipCode,setZipCode]=useState("");
  const[countrySearch,setCountrySearch]=useState("");
  const[countryOpen,setCountryOpen]=useState(false);
  const[deliveryResults,setDeliveryResults]=useState(null);
  const[rushSelections,setRushSelections]=useState({}); // itemId -> true/false
  const countryRef=useRef(null);

  // Group order
  const[groupLink,setGroupLink]=useState(null);
  const[showGroupModal,setShowGroupModal]=useState(false);

  // Checkout
  const[email,setEmail]=useState("");
  const[shipAddr,setShipAddr]=useState({name:"",street:"",city:"",state:"",zip:""});
  const[payInfo,setPayInfo]=useState({card:"",exp:"",cvv:""});
  const[orderNum,setOrderNum]=useState(null);
  const[orderStatus,setOrderStatus]=useState(0);
  const[trackingNum,setTrackingNum]=useState(null);

  useEffect(()=>{
    const h=e=>{if(countryRef.current&&!countryRef.current.contains(e.target))setCountryOpen(false);};
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);

  const filteredCountries=useMemo(()=>countrySearch?COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase())):COUNTRIES,[countrySearch]);

  function startCustomize(product){
    setCustomizing(product);setCustColor("#2B2B2B");setCustQty(25);setCustColorSplits({});setCustSplitMode(false);
    setCustFrontDesignMode(null);setCustFrontDesign(null);setCustBackDesignMode(null);setCustBackDesign(null);
    setCustAiPrompt("");setCustAiResult(null);setCustAiLoading(false);setCustAiConfirmed(false);setCustAiSide("front");
    setPreviewSide("front");setPage("customize");
  }

  function computePrice(product,qty,frontDM,backDM,rushFee,crossFee){
    let base=product.basePrice*qty;
    if(frontDM==="ai"||frontDM==="upload") base+=CUSTOM_FEE*qty;
    if(backDM==="ai"||backDM==="upload") base+=CUSTOM_FEE*qty;
    base+=(rushFee||0)+(crossFee||0);
    return base;
  }

  const currentItemPrice=useMemo(()=>customizing?computePrice(customizing,custQty,custFrontDesignMode,custBackDesignMode):0,[customizing,custQty,custFrontDesignMode,custBackDesignMode]);

  function addToBag(){
    const colors=custSplitMode?{...custColorSplits}:{[custColor]:custQty};
    const placement = (custFrontDesign&&custBackDesign)?"front and back":custFrontDesign?"front":custBackDesign?"back":"none";
    setBag(prev=>[...prev,{id:Date.now(),product:customizing,qty:custQty,color:custColor,colorSplits:colors,splitMode:custSplitMode,frontDesignMode:custFrontDesignMode,frontDesign:custFrontDesign,backDesignMode:custBackDesignMode,backDesign:custBackDesign,placement,price:currentItemPrice}]);
    setShowAddedModal(true);
  }

  async function generateAiDesign(){
    setCustAiLoading(true);setCustAiConfirmed(false);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a product designer for YETI custom drinkware. A customer wants a custom design for the ${custAiSide} of their ${customizing?.name||"product"}. Their prompt: "${custAiPrompt}"\n\nGenerate a creative description (2-3 sentences). Return ONLY valid JSON: {"description":"..."}`}]})});
      const data=await r.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      setCustAiResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch{
      setCustAiResult({description:`Custom artwork inspired by: "${custAiPrompt}". A stylized outdoor design for the ${custAiSide}, rendered in YETI\u2019s premium engraving aesthetic.`});
    }
    setCustAiLoading(false);
  }

  function confirmAiDesign(){
    setCustAiConfirmed(true);
    const d={id:"ai-custom",name:"AI Custom",icon:"\u2728",svg:null};
    if(custAiSide==="front"){setCustFrontDesign(d);setCustFrontDesignMode("ai");}
    else{setCustBackDesign(d);setCustBackDesignMode("ai");}
  }

  function checkDelivery(){
    if(!country||!zipCode)return;
    const results=resolveDelivery(bag,country,zipCode);
    setDeliveryResults(results);
    setRushSelections({});
  }

  const bagTotal=useMemo(()=>{
    if(!deliveryResults) return bag.reduce((s,i)=>s+i.price,0);
    return bag.reduce((s,item)=>{
      const dr=deliveryResults.find(r=>r.itemId===item.id);
      const rush=rushSelections[item.id]&&dr?.rushOption?dr.rushOption.fee:0;
      const cross=dr?.surcharge||0;
      return s+computePrice(item.product,item.qty,item.frontDesignMode,item.backDesignMode,rush,cross);
    },0);
  },[bag,deliveryResults,rushSelections]);

  const earnedPoints=useMemo(()=>Math.floor(bagTotal*LOYALTY_POINTS_PER_DOLLAR),[bagTotal]);

  function handleProceedToLogistics(){
    if(!loggedIn){setShowAuthPrompt(true);return;}
    setDeliveryResults(null);setPage("logistics");
  }

  function doLogin(){
    setLoggedIn(true);setUserName(loginEmail.split("@")[0]||"User");setShowLogin(false);setShowAuthPrompt(false);setLoginEmail("");setLoginPass("");
  }

  function generateGroupLink(){
    setGroupLink("https://yeti.com/group/"+Math.random().toString(36).substring(2,8).toUpperCase());
    setShowGroupModal(true);
  }

  function submitOrder(){
    setOrderNum("YETI-"+Date.now().toString().slice(-8));
    setOrderStatus(0);setTrackingNum(null);
    if(loggedIn) setLoyaltyPoints(p=>p+earnedPoints);
    setPage("tracking");
  }

  // ─── NAV ────────────────────────────────────────────────────────────────────
  const Nav=()=>(
    <nav style={{background:"#0B2F4A",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:26,fontWeight:900,letterSpacing:"0.25em",color:"#fff",cursor:"pointer"}} onClick={()=>setPage("home")}>YETI</span>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {CATEGORIES.map(c=>(
            <span key={c} style={{fontFamily:"'Montserrat',sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.12em",color:page==="browse"&&selectedCategory===c?"#fff":"rgba(255,255,255,0.55)",cursor:"pointer",borderBottom:page==="browse"&&selectedCategory===c?"2px solid #1F7EA6":"2px solid transparent",paddingBottom:2}} onClick={()=>{setSelectedCategory(c);setPage("browse");}}>{c.toUpperCase()}</span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          {loggedIn?(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 12px 4px 8px"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                <span style={{color:"#E6F000",fontSize:11,fontWeight:700,fontFamily:"'Montserrat',sans-serif"}}>{loyaltyPoints.toLocaleString()}</span>
              </div>
              <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontFamily:"'Montserrat',sans-serif",fontWeight:600}}>{userName}</span>
              <span style={{color:"rgba(255,255,255,0.35)",fontSize:10,cursor:"pointer"}} onClick={()=>{setLoggedIn(false);setUserName("");}}>Sign Out</span>
            </div>
          ):(
            <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontFamily:"'Montserrat',sans-serif",fontWeight:600,cursor:"pointer"}} onClick={()=>setShowLogin(true)}>SIGN IN</span>
          )}
          <span style={{color:"#fff",cursor:"pointer",position:"relative",display:"flex",alignItems:"center"}} onClick={()=>bag.length>0&&setPage("bag")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {bag.length>0&&<span style={{position:"absolute",top:-6,right:-10,background:"#1F7EA6",color:"#fff",fontSize:10,fontWeight:700,width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{bag.length}</span>}
          </span>
        </div>
      </div>
    </nav>
  );

  // ─── LOGIN MODAL ──────────────────────────────────────────────────────────
  const LoginModal=()=>showLogin?(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowLogin(false)}>
      <div style={{background:"#fff",borderRadius:18,padding:"40px 36px",maxWidth:380,width:"90%"}} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontFamily:"'Montserrat',sans-serif",fontSize:20,fontWeight:700,color:"#0B2F4A",margin:"0 0 6px",letterSpacing:"0.05em"}}>SIGN IN</h3>
        <p style={{color:"#888",fontSize:13,margin:"0 0 20px"}}>Sign in to your YETI account</p>
        <div style={BS.label}>EMAIL</div>
        <input style={BS.inp} value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="you@example.com"/>
        <div style={BS.label}>PASSWORD</div>
        <input style={BS.inp} type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"/>
        <button style={{...BS.btnP,width:"100%",marginTop:8}} onClick={doLogin}>SIGN IN</button>
        <p style={{textAlign:"center",fontSize:12,color:"#888",marginTop:14,cursor:"pointer"}} onClick={()=>{setLoginEmail("demo@yeti.com");setLoginPass("demo");setTimeout(doLogin,200);}}>Use demo account</p>
      </div>
    </div>
  ):null;

  // ─── AUTH PROMPT (at logistics) ───────────────────────────────────────────
  const AuthPrompt=()=>showAuthPrompt?(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAuthPrompt(false)}>
      <div style={{background:"#fff",borderRadius:18,padding:"40px 36px",maxWidth:420,width:"90%"}} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontFamily:"'Montserrat',sans-serif",fontSize:20,fontWeight:700,color:"#0B2F4A",margin:"0 0 6px"}}>BEFORE YOU CONTINUE</h3>
        <p style={{color:"#666",fontSize:13,margin:"0 0 24px",lineHeight:1.6}}>Sign in to earn loyalty points and save your order details, or continue as a guest.</p>
        <button style={{...BS.btnP,width:"100%",marginBottom:10}} onClick={()=>{setShowAuthPrompt(false);setShowLogin(true);}}>SIGN IN TO YOUR ACCOUNT</button>
        <button style={{...BS.btnS,width:"100%",marginBottom:10}} onClick={()=>{setLoginEmail("new@yeti.com");setShowAuthPrompt(false);setShowLogin(true);}}>CREATE AN ACCOUNT</button>
        <button style={{background:"none",border:"none",color:"#1F7EA6",fontSize:12,fontWeight:600,cursor:"pointer",width:"100%",textAlign:"center",padding:8}} onClick={()=>{setShowAuthPrompt(false);setDeliveryResults(null);setPage("logistics");}}>Continue as guest</button>
      </div>
    </div>
  ):null;

  // ─── PAGES ────────────────────────────────────────────────────────────────

  // HOME
  if(page==="home") return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/><AuthPrompt/>
      <div style={{background:"linear-gradient(170deg,#0B2F4A 0%,#0d3a58 50%,#1a4f6e 100%)",padding:"110px 24px 130px",position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:58,fontWeight:900,letterSpacing:"0.05em",color:"#fff",lineHeight:1.08,margin:"0 0 18px"}}>BUILT FOR{"\n"}THE WILD</h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.5)",lineHeight:1.75,margin:"0 0 36px",maxWidth:480}}>Custom branded YETI products with intelligent fulfillment, premium design tools, and seamless delivery.</p>
          <button style={BS.btnAccent} onClick={()=>{setSelectedCategory("Bottles");setPage("browse");}}>SHOP CUSTOM PRODUCTS</button>
        </div>
        <svg viewBox="0 0 1200 200" style={{position:"absolute",bottom:0,left:0,width:"100%"}}><polygon points="0,200 80,100 160,150 280,50 420,130 520,40 680,110 800,30 920,90 1020,55 1120,105 1200,70 1200,200" fill="rgba(255,255,255,0.05)"/></svg>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"64px 24px 80px"}}>
        <h2 style={{fontFamily:"'Montserrat',sans-serif",fontSize:22,fontWeight:700,letterSpacing:"0.1em",marginBottom:28,color:"#0B2F4A"}}>SHOP BY CATEGORY</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
          {CATEGORIES.map(cat=>{const sample=PRODUCTS.find(p=>p.category===cat);return(
            <div key={cat} style={{background:"#f6f6f4",borderRadius:14,padding:"36px 20px",textAlign:"center",cursor:"pointer",transition:"all 0.25s",border:"2px solid transparent"}} onClick={()=>{setSelectedCategory(cat);setPage("browse");}}>
              <div style={{height:170,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}><ProductPreview product={sample} color="#2B2B2B"/></div>
              <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:17,fontWeight:700,letterSpacing:"0.1em",color:"#0B2F4A"}}>{cat.toUpperCase()}</div>
              <div style={{fontSize:13,color:"#888",marginTop:5}}>{PRODUCTS.filter(p=>p.category===cat).length} products</div>
            </div>);
          })}
        </div>
      </div>
    </div>
  );

  // BROWSE
  if(page==="browse"){const prods=PRODUCTS.filter(p=>p.category===selectedCategory);return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 60px"}}>
        <div style={{padding:"36px 0 8px"}}><h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:34,fontWeight:700,letterSpacing:"0.08em",color:"#0B2F4A",margin:0}}>{selectedCategory.toUpperCase()}</h1></div>
        <div style={{display:"flex",gap:8,marginTop:16,marginBottom:28,borderBottom:"2px solid #eee",paddingBottom:14}}>
          {CATEGORIES.map(c=><button key={c} style={{background:selectedCategory===c?"#0B2F4A":"transparent",color:selectedCategory===c?"#fff":"#888",border:"none",fontFamily:"'Montserrat',sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.08em",cursor:"pointer",padding:"7px 18px",borderRadius:20}} onClick={()=>setSelectedCategory(c)}>{c.toUpperCase()}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:22}}>
          {prods.map(p=>(
            <div key={p.id} style={{background:"#f9f9f7",borderRadius:14,overflow:"hidden",cursor:"pointer",border:"1px solid #eee"}} onClick={()=>startCustomize(p)}>
              <div style={{height:230,display:"flex",alignItems:"center",justifyContent:"center",background:"#f2f2ef",padding:18}}><ProductPreview product={p} color="#2B2B2B"/></div>
              <div style={{padding:18}}>
                <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:14,fontWeight:700,color:"#0B2F4A",marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:13,color:"#888",marginBottom:7}}>{p.sizeLabel}</div>
                <div style={{fontSize:16,fontWeight:700,color:"#1F7EA6"}}>From {fmt(p.basePrice)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );}

  // CUSTOMIZE — single page, independent front/back
  if(page==="customize"&&customizing){
    const splitTotal=Object.values(custColorSplits).reduce((a,b)=>a+b,0);
    const splitRem=custQty-splitTotal;
    const currentSideDesign=previewSide==="front"?custFrontDesign:custBackDesign;
    const currentPlacement=(custFrontDesign&&custBackDesign)?"front and back":custFrontDesign?"front":custBackDesign?"back":"none";

    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/>
      {showAddedModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAddedModal(false)}>
          <div style={{background:"#fff",borderRadius:18,padding:"44px 36px",textAlign:"center",maxWidth:420,width:"90%"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"#2a8a4a",color:"#fff",fontSize:24,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{"\u2713"}</div>
            <h3 style={{fontFamily:"'Montserrat',sans-serif",fontSize:18,fontWeight:700,color:"#0B2F4A",margin:"0 0 6px"}}>ADDED TO BAG</h3>
            <p style={{color:"#666",fontSize:14,margin:"0 0 24px"}}>{customizing.name} {"\u00d7"} {custQty}</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button style={BS.btnS} onClick={()=>{setShowAddedModal(false);setPage("browse");}}>CONTINUE SHOPPING</button>
              <button style={BS.btnP} onClick={()=>{setShowAddedModal(false);setPage("bag");}}>VIEW BAG</button>
            </div>
          </div>
        </div>
      )}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 60px"}}>
        <div style={{padding:"18px 0 8px",fontSize:13,color:"#888"}}>
          <span style={{cursor:"pointer",textDecoration:"underline",color:"#1F7EA6"}} onClick={()=>setPage("browse")}>{customizing.category}</span>
          <span style={{margin:"0 7px"}}>/</span><span>{customizing.name}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:44,paddingTop:12}}>
          {/* Preview */}
          <div style={{position:"sticky",top:80,alignSelf:"start"}}>
            <div style={{background:"#f6f6f4",borderRadius:18,padding:"44px 24px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:360}}>
              <ProductPreview product={customizing} color={custSplitMode?(Object.keys(custColorSplits).find(k=>custColorSplits[k]>0)||"#2B2B2B"):custColor} design={previewSide==="front"?custFrontDesign:custBackDesign} placement={currentPlacement} side={previewSide}/>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14}}>
              {["front","back"].map(s=><button key={s} style={{background:previewSide===s?"#0B2F4A":"#eee",color:previewSide===s?"#fff":"#666",border:"none",padding:"9px 22px",fontSize:11,fontFamily:"'Montserrat',sans-serif",fontWeight:600,letterSpacing:"0.08em",cursor:"pointer",borderRadius:22}} onClick={()=>setPreviewSide(s)}>{s.toUpperCase()}</button>)}
            </div>
          </div>
          {/* Options */}
          <div>
            <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:28,fontWeight:700,color:"#0B2F4A",margin:"0 0 8px",lineHeight:1.2}}>{customizing.name}</h1>
            <p style={{fontSize:14,color:"#666",lineHeight:1.65,margin:"0 0 10px"}}>{customizing.desc}</p>
            <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:26,fontWeight:700,color:"#1F7EA6",marginBottom:22}}>{fmt(currentItemPrice)}</div>

            <Section title="QUANTITY">
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <button style={{width:42,height:42,border:"1px solid #ddd",background:"#fff",fontSize:18,cursor:"pointer",color:"#333",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"4px 0 0 4px"}} onClick={()=>setCustQty(q=>Math.max(1,q-1))}>{"\u2212"}</button>
                <input type="number" min={1} value={custQty} onChange={e=>setCustQty(Math.max(1,parseInt(e.target.value)||1))} style={{width:68,height:42,border:"1px solid #ddd",borderLeft:"none",borderRight:"none",textAlign:"center",fontSize:15,fontWeight:600,color:"#333"}}/>
                <button style={{width:42,height:42,border:"1px solid #ddd",background:"#fff",fontSize:18,cursor:"pointer",color:"#333",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"0 4px 4px 0"}} onClick={()=>setCustQty(q=>q+1)}>+</button>
              </div>
            </Section>

            <Section title="COLOR">
              <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer"}}><input type="checkbox" checked={custSplitMode} onChange={e=>setCustSplitMode(e.target.checked)} style={{accentColor:"#0B2F4A"}}/><span style={{fontSize:13,color:"#555"}}>Split quantity across multiple colors</span></label>
              {!custSplitMode?(
                <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
                  {COLORS_DATA.map(c=><div key={c.hex} title={c.name} style={{width:38,height:38,borderRadius:"50%",background:c.hex,cursor:"pointer",border:custColor===c.hex?"3px solid #0B2F4A":"2px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:custColor===c.hex?"0 0 0 2px rgba(11,47,74,0.2)":"none"}} onClick={()=>setCustColor(c.hex)}>{custColor===c.hex&&<span style={{color:isLight(c.hex)?"#333":"#fff",fontSize:14,fontWeight:700}}>{"\u2713"}</span>}</div>)}
                </div>
              ):(
                <div>
                  <div style={{fontSize:13,color:"#555",marginBottom:10}}>Remaining: <strong style={{color:splitRem<0?"#C81F25":splitRem===0?"#2a8a4a":"#0B2F4A"}}>{splitRem}</strong> of {custQty}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {COLORS_DATA.map(c=><div key={c.hex} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}><div style={{width:22,height:22,borderRadius:"50%",background:c.hex,border:"1px solid #ddd",flexShrink:0}}/><span style={{fontSize:11,flex:1,color:"#555",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</span><input type="number" min={0} placeholder="0" value={custColorSplits[c.hex]||""} onChange={e=>{const v=Math.max(0,parseInt(e.target.value)||0);setCustColorSplits(p=>{const n={...p};if(v===0)delete n[c.hex];else n[c.hex]=v;return n;});}} style={{width:54,padding:"5px 6px",border:"1px solid #ddd",borderRadius:4,textAlign:"center",fontSize:12}}/></div>)}
                  </div>
                </div>
              )}
            </Section>

            {/* FRONT DESIGN */}
            <Section title="FRONT DESIGN">
              <DesignPicker side="front" designMode={custFrontDesignMode} setDesignMode={setCustFrontDesignMode} design={custFrontDesign} setDesign={setCustFrontDesign} aiPrompt={custAiPrompt} setAiPrompt={setCustAiPrompt} aiResult={custAiResult} aiLoading={custAiLoading} aiConfirmed={custAiConfirmed&&custAiSide==="front"} generateAi={()=>{setCustAiSide("front");generateAiDesign();}} confirmAi={confirmAiDesign} setAiSide={setCustAiSide} aiSide={custAiSide} resetAi={()=>{setCustAiResult(null);setCustAiConfirmed(false);}}/>
            </Section>

            {/* BACK DESIGN */}
            <Section title="BACK DESIGN" defaultOpen={false}>
              <DesignPicker side="back" designMode={custBackDesignMode} setDesignMode={setCustBackDesignMode} design={custBackDesign} setDesign={setCustBackDesign} aiPrompt={custAiPrompt} setAiPrompt={setCustAiPrompt} aiResult={custAiResult} aiLoading={custAiLoading} aiConfirmed={custAiConfirmed&&custAiSide==="back"} generateAi={()=>{setCustAiSide("back");generateAiDesign();}} confirmAi={confirmAiDesign} setAiSide={setCustAiSide} aiSide={custAiSide} resetAi={()=>{setCustAiResult(null);setCustAiConfirmed(false);}}/>
            </Section>

            <button style={{...BS.btnP,width:"100%",padding:"17px 24px",fontSize:14,marginTop:26,opacity:(custSplitMode&&splitRem<0)?0.4:1}} disabled={custSplitMode&&splitRem<0} onClick={addToBag}>ADD TO BAG {"\u2014"} {fmt(currentItemPrice)}</button>
          </div>
        </div>
      </div>
    </div>);
  }

  // BAG
  if(page==="bag") return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/><AuthPrompt/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px 60px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:28,fontWeight:700,letterSpacing:"0.08em",color:"#0B2F4A",margin:"32px 0 26px"}}>YOUR BAG</h1>
          <button style={{...BS.btnS,fontSize:10,padding:"8px 14px"}} onClick={generateGroupLink}>{"\ud83d\udd17"} CREATE GROUP ORDER</button>
        </div>
        {showGroupModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowGroupModal(false)}>
            <div style={{background:"#fff",borderRadius:18,padding:"36px",maxWidth:440,width:"90%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
              <h3 style={{fontFamily:"'Montserrat',sans-serif",fontSize:18,fontWeight:700,color:"#0B2F4A",margin:"0 0 8px"}}>GROUP ORDER LINK</h3>
              <p style={{color:"#666",fontSize:13,margin:"0 0 16px"}}>Share this link with your team. Anyone with this link can add items to your shared order.</p>
              <div style={{background:"#f0f6fa",borderRadius:8,padding:"12px 16px",fontFamily:"monospace",fontSize:13,color:"#0B2F4A",wordBreak:"break-all",marginBottom:16}}>{groupLink}</div>
              <button style={BS.btnP} onClick={()=>{navigator.clipboard?.writeText(groupLink);setShowGroupModal(false);}}>COPY LINK</button>
            </div>
          </div>
        )}
        {bag.length===0?(
          <div style={{textAlign:"center",padding:64}}><p style={{color:"#888",fontSize:15}}>Your bag is empty.</p><button style={{...BS.btnP,marginTop:18}} onClick={()=>setPage("browse")}>SHOP PRODUCTS</button></div>
        ):(
          <>
            {bag.map((item,idx)=>(
              <div key={item.id} style={{display:"flex",gap:22,padding:22,borderBottom:"1px solid #eee",alignItems:"flex-start"}}>
                <div style={{width:105,flexShrink:0,background:"#f6f6f4",borderRadius:10,padding:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <ProductPreview product={item.product} color={item.color} design={item.frontDesign} placement={item.placement} side="front"/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:16,fontWeight:700,color:"#0B2F4A"}}>{item.product.name}</div>
                  <div style={{fontSize:13,color:"#888",marginTop:4}}>Qty: {item.qty} {"\u2022"} Front: {item.frontDesign?.name||"None"} {"\u2022"} Back: {item.backDesign?.name||"None"}</div>
                  <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                    {item.splitMode?Object.entries(item.colorSplits).filter(([,q])=>q>0).map(([hex,q])=><div key={hex} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:14,height:14,borderRadius:"50%",background:hex,border:"1px solid #ddd"}}/><span style={{fontSize:11,color:"#666"}}>{"\u00d7"}{q}</span></div>)
                    :<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:14,height:14,borderRadius:"50%",background:item.color,border:"1px solid #ddd"}}/><span style={{fontSize:11,color:"#666"}}>{COLORS_DATA.find(c=>c.hex===item.color)?.name}</span></div>}
                  </div>
                  {editingBagIdx===idx?(
                    <div style={{marginTop:14,padding:14,background:"#f8f8f8",borderRadius:10}}>
                      <div style={BS.label}>EDIT COLOR</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                        {COLORS_DATA.map(c=><div key={c.hex} title={c.name} style={{width:30,height:30,borderRadius:"50%",background:c.hex,cursor:"pointer",border:item.color===c.hex?"3px solid #0B2F4A":"2px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{const u=[...bag];u[idx]={...u[idx],color:c.hex};if(!u[idx].splitMode)u[idx].colorSplits={[c.hex]:u[idx].qty};setBag(u);}}>{item.color===c.hex&&<span style={{color:isLight(c.hex)?"#333":"#fff",fontSize:10,fontWeight:700}}>{"\u2713"}</span>}</div>)}
                      </div>
                      <button style={{...BS.btnS,marginTop:10,fontSize:11,padding:"6px 16px"}} onClick={()=>setEditingBagIdx(null)}>Done</button>
                    </div>
                  ):(
                    <div style={{marginTop:10,display:"flex",gap:10}}>
                      <button style={{background:"none",border:"none",color:"#1F7EA6",fontSize:12,fontWeight:600,cursor:"pointer",padding:0,textDecoration:"underline"}} onClick={()=>setEditingBagIdx(idx)}>Edit Color</button>
                      <button style={{background:"none",border:"none",color:"#C81F25",fontSize:12,fontWeight:600,cursor:"pointer",padding:0,textDecoration:"underline"}} onClick={()=>setBag(b=>b.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  )}
                </div>
                <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:20,fontWeight:700,color:"#0B2F4A",flexShrink:0}}>{fmt(item.price)}</div>
              </div>
            ))}
            {loggedIn&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 0",borderBottom:"1px solid #eee"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E6F000" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
              <span style={{fontSize:13,color:"#555"}}>You'll earn <strong style={{color:"#0B2F4A"}}>{earnedPoints} loyalty points</strong> with this order</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"28px 0"}}>
              <button style={BS.btnS} onClick={()=>setPage("browse")}>CONTINUE SHOPPING</button>
              <button style={BS.btnP} onClick={handleProceedToLogistics}>PROCEED TO CHECKOUT</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // LOGISTICS — simplified, system-driven
  if(page==="logistics") return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px 60px"}}>
        <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:28,fontWeight:700,letterSpacing:"0.08em",color:"#0B2F4A",margin:"32px 0 26px"}}>SHIPPING & DELIVERY</h1>
        <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:36}}>
          <div>
            <div style={BS.card}>
              <div style={BS.label}>DELIVERY COUNTRY</div>
              <div ref={countryRef} style={{position:"relative"}}>
                <input style={BS.inp} value={countryOpen?countrySearch:country} onChange={e=>{setCountrySearch(e.target.value);setCountryOpen(true);}} onFocus={()=>{setCountryOpen(true);setCountrySearch("");}} placeholder="Search country\u2026"/>
                {countryOpen&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #ddd",borderRadius:"0 0 8px 8px",maxHeight:250,overflowY:"auto",zIndex:50,boxShadow:"0 6px 16px rgba(0,0,0,0.1)"}}>
                  {filteredCountries.slice(0,15).map(c=><div key={c} style={{padding:"9px 14px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f0f0f0",background:country===c?"#e8f4f8":"transparent"}} onClick={()=>{setCountry(c);setCountryOpen(false);setCountrySearch("");setDeliveryResults(null);}}>{c}</div>)}
                </div>}
              </div>
            </div>
            <div style={BS.card}>
              <div style={BS.label}>ZIP / POSTAL CODE</div>
              <input style={BS.inp} value={zipCode} onChange={e=>{setZipCode(e.target.value.slice(0,10));setDeliveryResults(null);}} placeholder="e.g. 94105" maxLength={10}/>
            </div>
            <button style={{...BS.btnP,width:"100%",marginTop:6,opacity:zipCode?1:0.4}} disabled={!zipCode} onClick={checkDelivery}>CHECK DELIVERY OPTIONS</button>
          </div>
          <div>
            {deliveryResults?(
              <>
                <div style={{marginBottom:16}}>
                  <div style={BS.label}>DELIVERY SUMMARY</div>
                  <p style={{fontSize:12,color:"#999",margin:"4px 0 0"}}>Your items will be fulfilled and shipped directly by YETI.</p>
                </div>
                {bag.map(item=>{
                  const dr=deliveryResults.find(r=>r.itemId===item.id);
                  if(!dr)return null;
                  const isRushed=rushSelections[item.id];
                  return(
                    <div key={item.id} style={{...BS.card,border:dr.inRegion?"2px solid #e8f4f8":"2px solid #fff5e6"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:14,fontWeight:700,color:"#0B2F4A"}}>{item.product.name} <span style={{fontWeight:400,color:"#888"}}>{"\u00d7"} {item.qty}</span></div>
                        </div>
                        {dr.inRegion?<span style={{padding:"3px 10px",background:"rgba(42,138,74,0.1)",color:"#2a8a4a",fontSize:9,fontWeight:700,fontFamily:"'Montserrat',sans-serif",borderRadius:3}}>IN STOCK LOCALLY</span>
                        :<span style={{padding:"3px 10px",background:"rgba(184,134,11,0.1)",color:"#b8860b",fontSize:9,fontWeight:700,fontFamily:"'Montserrat',sans-serif",borderRadius:3}}>SOURCED CROSS-REGION</span>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                        <div>
                          <div style={{fontSize:11,color:"#888",fontWeight:600,marginBottom:4}}>ESTIMATED DELIVERY</div>
                          <div style={{fontSize:16,fontWeight:700,color:"#0B2F4A"}}>{fmtDate(isRushed&&dr.rushOption?dr.rushOption.date:dr.deliveryDate)}</div>
                        </div>
                        <div>
                          <div style={{fontSize:11,color:"#888",fontWeight:600,marginBottom:4}}>AVAILABILITY</div>
                          <div style={{fontSize:14,color:dr.fulfillment==="full"?"#2a8a4a":"#b8860b",fontWeight:600}}>{dr.fulfillment==="full"?"\u2713 Fully available":"\u26a0 Partial \u2014 may have slight delay"}</div>
                        </div>
                      </div>
                      {dr.surcharge>0&&<div style={{marginTop:10,padding:"8px 12px",background:"rgba(184,134,11,0.06)",borderRadius:6,fontSize:12,color:"#b8860b",fontWeight:600}}>Cross-region shipping: +{fmt(dr.surcharge)}</div>}
                      {/* Rush option */}
                      {dr.rushOption&&!isRushed&&(
                        <div style={{marginTop:12,padding:"12px 14px",background:"#f0f6fa",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#0B2F4A"}}>{"⚡"} Rush Delivery Available</div>
                            <div style={{fontSize:12,color:"#555",marginTop:2}}>Get it by <strong>{fmtDate(dr.rushOption.date)}</strong> {"\u2014"} {dr.rushOption.daysSaved} days sooner</div>
                          </div>
                          <button style={{...BS.btnAccent,fontSize:11,padding:"8px 16px"}} onClick={()=>setRushSelections(p=>({...p,[item.id]:true}))}>+{fmt(dr.rushOption.fee)} RUSH</button>
                        </div>
                      )}
                      {isRushed&&(
                        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(31,126,166,0.08)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#1F7EA6"}}>{"⚡"} Rush Delivery Selected</div>
                            <div style={{fontSize:12,color:"#555",marginTop:2}}>Delivering by <strong>{fmtDate(dr.rushOption.date)}</strong> (+{fmt(dr.rushOption.fee)})</div>
                          </div>
                          <button style={{background:"none",border:"none",color:"#C81F25",fontSize:11,fontWeight:600,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setRushSelections(p=>{const n={...p};delete n[item.id];return n;})}>Remove Rush</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Montserrat',sans-serif",fontSize:20,fontWeight:700,color:"#0B2F4A",padding:"18px 0 10px",borderTop:"2px solid #eee",marginTop:10}}>
                  <span>ESTIMATED TOTAL</span><span>{fmt(bagTotal)}</span>
                </div>
                <button style={{...BS.btnP,width:"100%",marginTop:10}} onClick={()=>setPage("checkout")}>CONTINUE TO PAYMENT</button>
              </>
            ):(
              <div style={{textAlign:"center",padding:48,color:"#aaa"}}>
                <div style={{fontSize:40,marginBottom:14}}>{"\ud83d\udce6"}</div>
                <p style={{fontSize:14}}>Enter your location and we'll find the best delivery option for you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // CHECKOUT
  if(page==="checkout"){
    const orderEmail=loggedIn?(loginEmail||userName+"@yeti.com"):email;
    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 60px"}}>
        <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:28,fontWeight:700,letterSpacing:"0.08em",color:"#0B2F4A",margin:"32px 0 26px"}}>CHECKOUT</h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:36}}>
          <div>
            {!loggedIn&&<div style={BS.card}><div style={BS.label}>CONTACT</div><input style={BS.inp} placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/></div>}
            <div style={BS.card}><div style={BS.label}>SHIPPING ADDRESS</div>
              <input style={BS.inp} placeholder="Full name" value={shipAddr.name} onChange={e=>setShipAddr(p=>({...p,name:e.target.value}))}/>
              <input style={BS.inp} placeholder="Street address" value={shipAddr.street} onChange={e=>setShipAddr(p=>({...p,street:e.target.value}))}/>
              <div style={{display:"flex",gap:8}}><input style={{...BS.inp,flex:1}} placeholder="City" value={shipAddr.city} onChange={e=>setShipAddr(p=>({...p,city:e.target.value}))}/><input style={{...BS.inp,width:80}} placeholder="State" value={shipAddr.state} onChange={e=>setShipAddr(p=>({...p,state:e.target.value}))}/><input style={{...BS.inp,width:100}} placeholder="Zip" value={shipAddr.zip} onChange={e=>setShipAddr(p=>({...p,zip:e.target.value}))}/></div>
            </div>
            <div style={BS.card}><div style={BS.label}>PAYMENT</div>
              <input style={BS.inp} placeholder="Card number" value={payInfo.card} onChange={e=>setPayInfo(p=>({...p,card:e.target.value}))}/>
              <div style={{display:"flex",gap:8}}><input style={{...BS.inp,flex:1}} placeholder="MM / YY" value={payInfo.exp} onChange={e=>setPayInfo(p=>({...p,exp:e.target.value}))}/><input style={{...BS.inp,width:80}} placeholder="CVV" value={payInfo.cvv} onChange={e=>setPayInfo(p=>({...p,cvv:e.target.value}))}/></div>
            </div>
            <button style={{...BS.btnP,width:"100%",padding:"17px 24px",fontSize:14}} onClick={submitOrder}>PLACE ORDER {"\u2014"} {fmt(bagTotal)}</button>
          </div>
          <div style={{background:"#f9f9f7",borderRadius:14,padding:26,alignSelf:"flex-start"}}>
            <div style={BS.label}>ORDER SUMMARY</div>
            {bag.map(item=>{
              const dr=deliveryResults?.find(r=>r.itemId===item.id);
              const rush=rushSelections[item.id]&&dr?.rushOption?dr.rushOption.fee:0;
              return <div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#555",padding:"8px 0",borderBottom:"1px solid #eee"}}><span>{item.product.name} {"\u00d7"} {item.qty}</span><span>{fmt(item.product.basePrice*item.qty)}</span></div>;
            })}
            {deliveryResults?.some(d=>d.surcharge>0)&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#b8860b",padding:"8px 0",borderBottom:"1px solid #eee"}}><span>Cross-region shipping</span><span>{fmt(deliveryResults.reduce((s,d)=>s+d.surcharge,0))}</span></div>}
            {Object.keys(rushSelections).length>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#1F7EA6",padding:"8px 0",borderBottom:"1px solid #eee"}}><span>Rush delivery</span><span>{fmt(bag.reduce((s,item)=>{const dr=deliveryResults?.find(r=>r.itemId===item.id);return s+(rushSelections[item.id]&&dr?.rushOption?dr.rushOption.fee:0);},0))}</span></div>}
            {loggedIn&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 0",borderBottom:"1px solid #eee"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg><span style={{fontSize:12,color:"#555"}}>Earning <strong>{earnedPoints} pts</strong></span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Montserrat',sans-serif",fontSize:18,fontWeight:700,color:"#0B2F4A",paddingTop:14,marginTop:8}}><span>TOTAL</span><span>{fmt(bagTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>);
  }

  // TRACKING
  if(page==="tracking"){
    const stages=["Order Placed","Design Approved","In Production","Shipped","Delivered"];
    const orderEmail=loggedIn?(userName+"@yeti.com"):email;
    // Generate tracking num when shipped
    if(orderStatus>=3&&!trackingNum) setTrackingNum(genTrackingNum());

    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",color:"#1a1a1a"}}>
      <Nav/><LoginModal/>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px 60px"}}>
        <div style={{textAlign:"center",padding:"48px 0 24px"}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:"#2a8a4a",color:"#fff",fontSize:28,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{"\u2713"}</div>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:28,fontWeight:700,color:"#0B2F4A",margin:"0 0 6px"}}>ORDER CONFIRMED</h1>
          <p style={{color:"#888",fontSize:15,margin:"0 0 6px"}}>Order #{orderNum}</p>
          <p style={{color:"#555",fontSize:13}}>{"\ud83d\udce7"} Your order confirmation and receipt have been sent to <strong>{orderEmail||"your email"}</strong></p>
          {loggedIn&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f9f7e8",borderRadius:20,padding:"6px 14px",marginTop:10}}><svg width="14" height="14" viewBox="0 0 24 24" fill="#E6F000" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg><span style={{fontSize:12,color:"#555"}}>+{earnedPoints} points earned!</span></div>}
        </div>
        <div style={{display:"flex",alignItems:"center",maxWidth:620,margin:"0 auto 10px"}}>
          {stages.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:i<=orderStatus?"#0B2F4A":"#e8e8e8",color:i<=orderStatus?"#fff":"#aaa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{i<orderStatus?"\u2713":i+1}</div>
            {i<stages.length-1&&<div style={{flex:1,height:3,background:i<orderStatus?"#0B2F4A":"#e8e8e8",margin:"0 5px"}}/>}
          </div>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",maxWidth:620,margin:"0 auto 12px"}}>
          {stages.map((s,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:10,fontWeight:600,fontFamily:"'Montserrat',sans-serif",color:i<=orderStatus?"#0B2F4A":"#bbb",textTransform:"uppercase"}}>{s}</div>)}
        </div>
        {trackingNum&&<div style={{textAlign:"center",margin:"16px 0",padding:"12px 20px",background:"#f0f6fa",borderRadius:8,display:"inline-block"}}>
          <div style={{fontSize:10,fontWeight:700,fontFamily:"'Montserrat',sans-serif",color:"#888",letterSpacing:"0.1em"}}>TRACKING NUMBER</div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"monospace",color:"#0B2F4A",marginTop:4,letterSpacing:"0.05em"}}>{trackingNum}</div>
        </div>}
        <div style={{textAlign:"center",marginTop:20}}>
          <button style={{...BS.btnS,marginRight:12}} onClick={()=>setOrderStatus(s=>Math.min(s+1,4))}>SIMULATE NEXT STATUS</button>
          <button style={BS.btnP} onClick={()=>{setBag([]);setPage("home");}}>BACK TO HOME</button>
        </div>
        <div style={{background:"#f9f9f7",borderRadius:14,padding:26,marginTop:32}}>
          <div style={BS.label}>ORDER DETAILS</div>
          {bag.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#555",padding:"8px 0",borderBottom:"1px solid #eee"}}><span>{item.product.name} {"\u00d7"} {item.qty}</span><span>{fmt(item.price)}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Montserrat',sans-serif",fontSize:18,fontWeight:700,color:"#0B2F4A",paddingTop:14,marginTop:8}}><span>TOTAL</span><span>{fmt(bagTotal)}</span></div>
        </div>
      </div>
    </div>);
  }

  return null;
}

// ─── DESIGN PICKER (reusable for front/back) ────────────────────────────────
function DesignPicker({side,designMode,setDesignMode,design,setDesign,aiPrompt,setAiPrompt,aiResult,aiLoading,aiConfirmed,generateAi,confirmAi,setAiSide,aiSide,resetAi}){
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>
      {[{k:"prebuilt",l:"Pre-Built"},{k:"upload",l:"Upload"},{k:"ai",l:"AI Generate"},{k:null,l:"None"}].map(({k,l})=>(
        <button key={l} style={{flex:1,padding:"10px 8px",border:designMode===k?"1px solid #0B2F4A":"1px solid #ddd",background:designMode===k?"#0B2F4A":"#fff",color:designMode===k?"#fff":"#666",fontSize:10,fontFamily:"'Montserrat',sans-serif",fontWeight:600,letterSpacing:"0.04em",cursor:"pointer",borderRadius:6,textAlign:"center"}} onClick={()=>{setDesignMode(k);if(k===null)setDesign(null);}}>{l}</button>
      ))}
    </div>
    {designMode==="prebuilt"&&(
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
        {PRE_DESIGNS.map(d=><div key={d.id} style={{padding:"15px 8px",border:design?.id===d.id?"2px solid #0B2F4A":"2px solid #eee",borderRadius:10,textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:design?.id===d.id?"#f0f6fa":"#fff"}} onClick={()=>setDesign(d)}><span style={{fontSize:30}}>{d.icon}</span><span style={{fontSize:10,fontWeight:600,color:"#555"}}>{d.name}</span></div>)}
      </div>
    )}
    {designMode==="upload"&&(
      <div style={{border:"2px dashed #ddd",borderRadius:14,padding:32,textAlign:"center"}}>
        <div style={{fontSize:34,color:"#bbb",marginBottom:8}}>{"\u2191"}</div>
        <button style={{background:"#fff",color:"#0B2F4A",border:"2px solid #0B2F4A",padding:"8px 18px",fontSize:11,fontFamily:"'Montserrat',sans-serif",fontWeight:700,cursor:"pointer",borderRadius:5,marginTop:8}} onClick={()=>setDesign({id:"uploaded-"+side,name:"Uploaded Logo",icon:"\ud83d\udcc1",svg:null})}>SIMULATE UPLOAD</button>
        {design?.id===("uploaded-"+side)&&<div style={{color:"#2a8a4a",fontSize:12,marginTop:10,fontWeight:600}}>{"\u2713"} Logo uploaded for {side}</div>}
      </div>
    )}
    {designMode==="ai"&&(
      <div>
        <textarea style={{width:"100%",border:"1px solid #ddd",borderRadius:8,padding:"12px 14px",fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",color:"#333"}} rows={3} placeholder={`Describe the ${side} design\u2026`} value={aiSide===side?aiPrompt:""} onChange={e=>{setAiSide(side);setAiPrompt(e.target.value);}}/>
        <button style={{background:"#0B2F4A",color:"#fff",border:"none",padding:"13px 28px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",borderRadius:5,marginTop:8,width:"100%",opacity:aiLoading||!(aiSide===side&&aiPrompt)?0.5:1}} onClick={generateAi} disabled={aiLoading||!(aiSide===side&&aiPrompt)}>{aiLoading&&aiSide===side?"GENERATING\u2026":"GENERATE DESIGN"}</button>
        {aiResult&&aiSide===side&&!aiConfirmed&&(
          <div style={{marginTop:18,padding:18,border:"2px solid #ddd",borderRadius:10,background:"#fafafa"}}>
            <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"#888"}}>GENERATED DESIGN</div>
            <p style={{fontSize:13,color:"#555",lineHeight:1.6,margin:"8px 0"}}>{aiResult.description}</p>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button style={{background:"#fff",color:"#0B2F4A",border:"2px solid #0B2F4A",padding:"11px 24px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,cursor:"pointer",borderRadius:5}} onClick={resetAi}>Try Again</button>
              <button style={{background:"#0B2F4A",color:"#fff",border:"none",padding:"13px 28px",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:700,cursor:"pointer",borderRadius:5}} onClick={confirmAi}>USE THIS DESIGN</button>
            </div>
          </div>
        )}
        {aiConfirmed&&<div style={{marginTop:18,padding:16,border:"2px solid #2a8a4a",borderRadius:10,background:"#f6fdf8"}}><div style={{color:"#2a8a4a",fontWeight:700,fontSize:12}}>{"\u2713"} Design confirmed for {side}</div></div>}
      </div>
    )}
  </div>);
}

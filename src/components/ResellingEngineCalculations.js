import { EBAY_CATS, AMZ_CATS, WN_CATS, STOCKX_LEVELS, CATEGORIES, CONDITIONS, BASIS } from './ResellingEngineData.js';

/* ==================================================================
   RESELLING ENGINE — number formatting, the fee engine, deal scoring
   and the playbook card rules. Pure functions only, no React and no
   DOM access, so this is the file to edit for anything about how a
   deal's numbers are computed.
   ================================================================== */

export const num = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
  return isFinite(n) ? n : 0;
};
export const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pct = (n) => (isFinite(n) && n !== null ? Math.round(n * 100) + "%" : "—");
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const curve = (x, k) => (x <= 0 ? 0 : 100 * (1 - Math.exp(-x / k)));

/* ==================================================================
   FEE ENGINE
   ================================================================== */
export function computeFees(f, ov) {
  const item = num(f.listPrice);
  const ship = num(f.shipCharged);
  const tax = item * (num(f.taxRate) / 100);
  const ad = num(f.adRate) / 100;
  const lines = [];
  const push = (label, amt) => { if (amt) lines.push({ label, amt }); };
  const P = f.platform;

  const rate = (key, fallback) => (ov[key] !== undefined && ov[key] !== "" ? num(ov[key]) : fallback);

  if (P === "ebay") {
    const cat = EBAY_CATS[f.ebayCat] || EBAY_CATS.standard;
    let pctRate = rate("ebayPct", cat.pct);
    if (f.trp) pctRate = pctRate * 0.9;
    if (f.belowStd) pctRate = pctRate + 6;
    const base = item + ship + tax;
    const fvf = base <= 7500 ? base * (pctRate / 100) : 7500 * (pctRate / 100) + (base - 7500) * 0.0235;
    push("Final value fee (" + pctRate.toFixed(2) + "%)", fvf);
    if (!cat.noPerOrder) push("Per-order fee", base <= 10 ? 0.3 : 0.4);
    push("Regulatory operating fee (0.35%)", base * 0.0035);
  } else if (P === "mercari") {
    push("Selling fee (10%)", (item + ship) * (rate("mercariPct", 10) / 100));
  } else if (P === "poshmark") {
    push(item < 15 ? "Flat commission (under $15)" : "Commission (20%)",
      item === 0 ? 0 : item < 15 ? 2.95 : item * (rate("poshPct", 20) / 100));
  } else if (P === "depop") {
    push("Payment processing (3.3%)", (item + ship) * (rate("depopPct", 3.3) / 100));
    push("Fixed processing fee", item ? 0.45 : 0);
  } else if (P === "facebook") {
    const fee = (item + ship) * (rate("fbPct", 10) / 100);
    push("Marketplace fee (10%, $0.80 min)", item ? Math.max(0.8, fee) : 0);
  } else if (P === "whatnot") {
    const cat = WN_CATS[f.wnCat] || WN_CATS.standard;
    const commissionable = cat.capExempt ? Math.min(item, 1500) : item;
    push("Commission (" + cat.pct + "%)", commissionable * (rate("wnPct", cat.pct) / 100));
    push("Processing (2.9% + $0.30)", item ? (item + ship + tax) * 0.029 + 0.3 : 0);
  } else if (P === "amazon") {
    const cat = AMZ_CATS[f.amzCat] || AMZ_CATS.standard;
    const base = item + ship;
    let ref;
    if (cat.tiered === "apparel") {
      ref = item <= 15 ? base * 0.05 : item <= 20 ? base * 0.1 : base * 0.17;
    } else if (cat.tiered === "jewelry") {
      ref = item <= 250 ? base * 0.2 : 250 * 0.2 + (base - 250) * 0.05;
    } else {
      ref = base * (rate("amzPct", cat.pct) / 100);
    }
    push("Referral fee", item ? Math.max(0.3, ref) : 0);
    if (cat.closing) push("Media closing fee", item ? cat.closing : 0);
  } else if (P === "etsy") {
    push("Transaction fee (6.5%)", (item + ship) * (rate("etsyPct", 6.5) / 100));
    push("Processing (3% + $0.25)", item ? (item + ship) * 0.03 + 0.25 : 0);
    push("Listing fee", item ? 0.2 : 0);
  } else if (P === "offerup") {
    const fee = item * (rate("oufPct", 12.9) / 100);
    push("Service fee (12.9%, $1.99 min)", item ? Math.max(1.99, fee) : 0);
  } else if (P === "stockx") {
    const lvl = rate("sxPct", STOCKX_LEVELS[f.sxLevel] || 9);
    const t = item * (lvl / 100) + item * 0.03;
    push("Transaction + processing (" + lvl + "% + 3%)", item ? Math.max(5, t) : 0);
    push("US shipping fee", item ? 5 : 0);
  } else if (P === "grailed") {
    const base = item + ship;
    const commission = item >= 120 ? base * 0.09 : Math.max(1.99, base * 0.06);
    push(item >= 120 ? "Commission (9%)" : "Commission (6%, $1.99 min)", item ? commission : 0);
    push("Processing (2.9% + $0.30)", item ? base * 0.029 + 0.3 : 0);
  }

  const adFee = item * ad;
  push("Ads / promoted listings", adFee);

  const total = lines.reduce((s, l) => s + l.amt, 0);
  return { total, lines, adFee };
}

/* Solve fee as a function of item price — used for break-even and max offer.
   Numeric, so it handles every tier and minimum without algebra per platform. */
export function feeAtPrice(f, ov, price) {
  return computeFees({ ...f, listPrice: String(price) }, ov).total;
}

export function runNumbers(f, ov, targetRoi) {
  const price = num(f.listPrice);
  const shipIn = num(f.shipCharged);
  const cost = num(f.sourceCost);
  const supplies = num(f.supplies);
  const inbound = num(f.inbound);
  const outbound = num(f.outbound);
  const other = num(f.other);
  const hours = num(f.hours);
  const days = num(f.days);

  const fees = computeFees(f, ov);
  const revenue = price + shipIn;
  const cashAtRisk = cost + supplies + inbound + other;
  const totalCost = cashAtRisk + outbound;
  const net = revenue - fees.total - totalCost;

  const roi = cashAtRisk > 0 ? net / cashAtRisk : null;
  const margin = revenue > 0 ? net / revenue : null;
  const annualRoi = roi !== null && days > 0 ? roi * (365 / days) : null;
  const hourly = hours > 0 ? net / hours : null;
  const takeRate = revenue > 0 ? fees.total / revenue : 0;

  // Break-even sale price: bisect until net crosses zero.
  let lo = 0, hi = Math.max(50, totalCost * 4 + 50), breakeven = null;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const n = mid + shipIn - feeAtPrice(f, ov, mid) - totalCost;
    if (n > 0) hi = mid; else lo = mid;
  }
  if (price > 0 || totalCost > 0) breakeven = hi;

  // Max offer: most you can pay for the item and still hit the target return.
  const gross = revenue - fees.total - supplies - inbound - other - outbound;
  const maxOffer = (gross - targetRoi * (supplies + inbound + other)) / (1 + targetRoi);

  // Taxes
  const seTax = f.taxOn ? Math.max(0, net) * 0.153 : 0;
  const incTax = f.taxOn ? Math.max(0, net - seTax) * (num(f.incRate) / 100) : 0;
  const afterTax = net - seTax - incTax;

  return {
    price, revenue, fees, cashAtRisk, totalCost, outbound, net, roi, margin,
    annualRoi, hourly, takeRate, breakeven, maxOffer, days, hours, cost,
    seTax, incTax, afterTax, shipShare: revenue > 0 ? outbound / revenue : 0,
  };
}

/* ==================================================================
   SCORING
   ================================================================== */
export function scoreDeal(f, r) {
  const cat = CATEGORIES[f.category];
  const cond = CONDITIONS[f.condition];
  const str = num(f.str);

  let risk = 92 - cat.risk - cond.risk;
  if (f.basis === "gut") risk -= 12;
  if (f.basis === "active") risk -= 5;
  if (["sneakers", "jewelry", "electronics"].includes(f.category) && f.condition !== "new") risk -= 6;
  if (r.cashAtRisk > 300) risk -= 6;
  risk = clamp(risk, 0, 100);

  const velocity = str > 0
    ? clamp(str, 0, 100)
    : r.days > 0 ? clamp(100 * Math.exp(-r.days / 90), 0, 100) : 0;

  const parts = [
    { key: "Profit per flip", w: 0.2, v: curve(r.net, 60), detail: money(r.net) },
    { key: "Return on cash", w: 0.2, v: r.roi === null ? 0 : curve(r.roi, 0.8), detail: r.roi === null ? "add a cost" : pct(r.roi) },
    { key: "How fast it moves", w: 0.15, v: velocity, detail: str > 0 ? str + "% sell-through" : r.days > 0 ? r.days + " days" : "no estimate" },
    { key: "Cash turned per year", w: 0.15, v: r.annualRoi === null ? 0 : curve(r.annualRoi, 3), detail: r.annualRoi === null ? "—" : pct(r.annualRoi) },
    { key: "Margin after fees", w: 0.1, v: r.margin === null ? 0 : curve(r.margin, 0.25), detail: r.margin === null ? "—" : pct(r.margin) },
    { key: "Pay for your time", w: 0.1, v: r.hourly === null ? 0 : curve(r.hourly, 50), detail: r.hourly === null ? "add hours" : money(r.hourly) + "/hr" },
    { key: "Risk of the item", w: 0.1, v: risk, detail: cat.name.toLowerCase() + ", " + cond.name.toLowerCase() },
  ];

  let total = parts.reduce((s, p) => s + p.v * p.w, 0);
  if (r.net <= 0) total = Math.min(total, 18);
  if (r.roi !== null && r.roi < 0.15) total = Math.min(total, 45);
  if (str > 0 && str < 20) total = Math.min(total, 52);

  const score = Math.round(clamp(total, 0, 100));
  const verdict = r.net <= 0 ? "pass" : score >= 72 ? "buy" : score >= 55 ? "thin" : "pass";
  return { score, verdict, parts, risk, velocity };
}

export function buyRules(f, r) {
  const str = num(f.str);
  const rules = [
    { name: "3x rule", pass: r.cost > 0 && r.price >= r.cost * 3, detail: r.cost > 0 ? (r.price / r.cost).toFixed(1) + "x on your cost" : "enter a cost", why: "Sale price at least three times what you pay covers fees, shipping and the misses." },
    { name: "$15 net floor", pass: r.net >= 15, detail: money(r.net) + " net", why: "Below this, the listing and packing time is not worth doing." },
    { name: "ROI at 100%", pass: r.roi !== null && r.roi >= 1, detail: r.roi === null ? "—" : pct(r.roi), why: "Doubling your cash per flip is the common bar for used goods." },
    { name: "Margin at 30%", pass: r.margin !== null && r.margin >= 0.3, detail: r.margin === null ? "—" : pct(r.margin), why: "Under 20%, a single return wipes out several sales." },
    { name: "Sell-through 50%+", pass: str >= 50, detail: str > 0 ? str + "%" : "not entered", why: "Sold ÷ (sold + active) over 30 days. Under 20% is a flooded market." },
  ];
  return rules;
}

export function scoreInputs(f, r, comps) {
  const rows = [];
  const add = (label, got, max, fix) => rows.push({ label, got, max, fix });

  add("Where the sale price came from", BASIS[f.basis].weight, 30,
    f.basis === "sold" ? "" : "Filter for sold, not active. Asking prices are what sellers hope for, not what buyers paid.");

  const n = comps.length;
  add("Number of sold comps logged", n >= 5 ? 14 : n * 3, 14,
    n >= 5 ? "" : "Log " + (5 - n) + " more sold prices. Five is where the median stops moving on you.");

  const cs = comps.length >= 2 ? compStats(comps) : null;
  add("How tight the comps are", cs === null ? 0 : cs.cv < 0.2 ? 9 : cs.cv < 0.35 ? 5 : 2, 9,
    cs === null ? "Two comps minimum to measure spread." : cs.cv >= 0.35 ? "Prices are scattered. You are probably mixing variants, sizes or conditions." : "");

  add("Sell-through rate checked", num(f.str) > 0 ? 10 : 0, 10,
    num(f.str) > 0 ? "" : "Count sold and active listings for the same search. Sold ÷ (sold + active) tells you if it moves.");

  add("Your real cost in the item", num(f.sourceCost) > 0 ? 9 : 0, 9,
    num(f.sourceCost) > 0 ? "" : "Enter what you will actually pay, or use the max offer on the tag as your ceiling.");

  add("Shipping worked out", num(f.outbound) > 0 || ["local", "poshmark"].includes(f.platform) ? 10 : 0, 10,
    num(f.outbound) > 0 || ["local", "poshmark"].includes(f.platform) ? "" : "Weigh it and price a real label. Shipping is where thin flips die.");

  add("Condition documented", f.condition ? 5 : 0, 5, "");

  add("Time-to-sell estimate", num(f.days) > 0 ? 6 : 0, 6,
    num(f.days) > 0 ? "" : "Typical for " + CATEGORIES[f.category].name.toLowerCase() + " is around " + CATEGORIES[f.category].typicalDays + " days.");

  add("Hours you will put in", num(f.hours) > 0 ? 5 : 0, 5,
    num(f.hours) > 0 ? "" : "Count sourcing, cleaning, photos, listing and packing. Most items run 0.5 to 1.5 hours.");

  add("Fee schedule confirmed", f.feeTouched ? 7 : 3, 7,
    f.feeTouched ? "" : "Open the Fees panel. Store subscriptions, seller levels and category rates all change the number.");

  const got = rows.reduce((s, x) => s + x.got, 0);
  const max = rows.reduce((s, x) => s + x.max, 0);
  return { rows, score: Math.round((got / max) * 100) };
}

export function compStats(list) {
  const s = [...list].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  const median = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  const sd = Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / s.length);
  const q = (p) => s[clamp(Math.floor(p * (s.length - 1)), 0, s.length - 1)];
  return { median, mean, low: s[0], high: s[s.length - 1], cv: mean > 0 ? sd / mean : 0, q1: q(0.25), q3: q(0.75) };
}

/* ==================================================================
   PLAYBOOK CARDS
   ================================================================== */
export function buildCards(f, r, deal) {
  const cards = [];
  const str = num(f.str);

  if (r.net > 0 && deal.score >= 55 && deal.score < 72) {
    cards.push({
      tone: "warn", title: "This one is thin. Here is where the money hides",
      body: [
        "Raise the realized price before you touch anything else. Front-load the title with the exact search terms a buyer types: brand, model, size, colorway, part number.",
        "Right-size the box. Going from a 5 lb box to a 2 lb box on a zone 7 shipment saves about $7, which is often the whole difference.",
        "Send offers to watchers rather than dropping the list price. You keep the higher price for everyone else.",
        "Go back and negotiate the buy. Every dollar off the purchase is a full dollar of profit, while a dollar added to the price is only about 85 cents after fees.",
      ],
    });
  }

  if (r.net <= 0 || deal.score < 55) {
    cards.push({
      tone: "stop", title: "The numbers say walk",
      body: [
        "Your break-even sale price is " + (r.breakeven ? money(r.breakeven) : "—") + ". If the comps do not support that with room above it, there is no deal here at this cost.",
        "Buy backward instead: take the realistic sale price, subtract fees, shipping and the profit you need, and that is your ceiling. The tag at the top does this for you.",
        "If you already own it, price against the last 30 days of sold comps. Sitting above the median is the single biggest reason inventory does not move.",
        "A no is free. Sourcing regret costs you a few minutes; dead stock costs you the cash for a year.",
      ],
    });
  }

  if (deal.score >= 72) {
    cards.push({
      tone: "go", title: "Good deal. Do not give it back",
      body: [
        "Do not underprice out of eagerness. If the trend line is rising, list at the high end of your comps and use offers to come down.",
        r.price > 150
          ? "At this price, add signature confirmation and insurance, and photograph the item and the packing before it ships. High-value items attract not-as-described claims."
          : "Photograph flaws honestly. Nearly every not-as-described case starts with something the seller did not show.",
        "For sneakers, watches, handbags and cards above the authentication thresholds, sell through the platform's authentication program. It costs a little and removes the fraud tail.",
        "Log the source. A supplier that produced one good deal will produce more.",
      ],
    });
  }

  if (r.takeRate > 0.22 && r.revenue > 0) {
    cards.push({
      tone: "warn", title: "The marketplace is taking " + pct(r.takeRate) + " of this sale",
      body: [
        "Compare platforms before you list. On a $60 item, Poshmark takes about $12 while Depop takes about $2.45 — same item, $9 difference.",
        "Ads stack on top of the commission. Start without them and add a promoted rate only once the item has sat and the margin can carry it.",
        "For local-friendly goods like furniture and tools, a cash sale keeps the entire spread.",
      ],
    });
  }

  if (r.shipShare > 0.18 && r.outbound > 0) {
    cards.push({
      tone: "warn", title: "Shipping is eating " + pct(r.shipShare) + " of the sale",
      body: [
        "Ground Advantage beats Priority at almost every weight and zone unless the buyer needs speed.",
        "Charge shipping separately on heavy items rather than offering it free — free shipping on a 10 lb item to zone 8 is a $30 hit.",
        "Bundle. Two items in one box roughly doubles revenue on nearly the same label cost.",
        "Keep free mailers and boxes from your own deliveries. Supply cost is the quietest margin leak there is.",
      ],
    });
  }

  if ((str > 0 && str < 20) || r.days > 90) {
    cards.push({
      tone: "stop", title: "Dead-stock risk",
      body: [
        "Under 20% sell-through means the market is flooded. Price is not your problem — supply is.",
        "Run a 90-day rule. If it has not sold in 90 days at a fair price, it is dead stock and the plan changes from selling to clearing.",
        "The clearing order: cut price toward the sold median, then bundle it with something desirable, then move it to a different platform, then local or lot sale, then donate and take the write-off.",
        "The purchase price is gone either way. Decide only on what it is worth from here.",
      ],
    });
  }

  if (f.basis !== "sold") {
    cards.push({
      tone: "warn", title: "Your price is not built on sold data",
      body: [
        "On eBay, filter Sold Items and Completed Items. In Seller Hub, Product Research is free and goes back further than the 90-day filter.",
        "Accepted offers hide the real price — eBay shows the struck-through asking price. A sale marked at list often closed 15% to 25% lower. 130point surfaces the accepted number for free.",
        "Match the comp exactly: same variant, size, condition, colorway, and whether the box and accessories were included.",
      ],
    });
  }

  if (r.cost > 0 && r.cost > r.maxOffer && r.price > 0) {
    cards.push({
      tone: "stop", title: "You are paying " + money(r.cost - r.maxOffer) + " over your ceiling",
      body: [
        "Your target return puts the ceiling at " + money(Math.max(0, r.maxOffer)) + ". You are above it.",
        "At an estate sale, ask about the last day and make a whole-lot offer. At a thrift, learn the color-tag markdown schedule. On Facebook, offer cash for a bundle and be ready to walk.",
        "Set the max before you get emotionally attached to the item. Auctions punish people who decide their limit while bidding.",
      ],
    });
  }

  return cards;
}

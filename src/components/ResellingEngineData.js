/* ==================================================================
   RESELLING ENGINE — static data
   Fee schedules, category tables and reference content for the
   Reselling Pricing Desk. Edit rates/copy here; ResellingEngineCalculations.js
   is where the numbers get used.
   ================================================================== */

/* ---------- eBay category final value fees (on item + shipping + tax) ---------- */
export const EBAY_CATS = {
  standard: { name: "Most categories", pct: 13.6 },
  media: { name: "Books, DVDs, music (not vinyl)", pct: 15.3 },
  cards: { name: "Trading cards & collectibles", pct: 13.25 },
  jewelry: { name: "Jewelry, watches, handbags", pct: 15 },
  guitars: { name: "Guitars & basses", pct: 6.7 },
  sneakers: { name: "Authenticated sneakers $150+", pct: 8, noPerOrder: true },
};

/* ---------- Amazon referral fees (on item + shipping, not tax) ---------- */
export const AMZ_CATS = {
  standard: { name: "Most categories", pct: 15 },
  electronics: { name: "Consumer electronics", pct: 8 },
  apparel: { name: "Apparel (tiered)", tiered: "apparel" },
  jewelry: { name: "Jewelry (tiered)", tiered: "jewelry" },
  accessories: { name: "Amazon device accessories", pct: 45 },
  media: { name: "Books & media", pct: 15, closing: 1.8 },
};

/* ---------- Whatnot commission by category ---------- */
export const WN_CATS = {
  standard: { name: "Most categories", pct: 8, capExempt: true },
  electronics: { name: "Electronics", pct: 5 },
  coins: { name: "Coins & money", pct: 4, capExempt: true },
};

export const STOCKX_LEVELS = { 1: 9, 2: 8.5, 3: 8, 4: 7.5, 5: 7 };

export const PLATFORMS = {
  ebay: {
    name: "eBay",
    feeBase: "item + shipping + sales tax",
    adLabel: "Promoted Listings rate",
    note:
      "13.6% up to $7,500 per item, then 2.35% above. Plus $0.30 per order at $10 and under, $0.40 above. " +
      "A ~0.35% regulatory operating fee applies in most states. Top Rated Plus takes 10% off the variable fee; " +
      "Below Standard adds 6 points. Authenticated sneakers $150+ pay 8% with no per-order fee.",
    catKey: "ebayCat",
  },
  mercari: {
    name: "Mercari",
    feeBase: "item + buyer-paid shipping",
    note: "Flat 10% selling fee. The buyer pays a separate 3.6% buyer protection charge — that is not your cost.",
  },
  poshmark: {
    name: "Poshmark",
    feeBase: "item price only",
    note:
      "20% commission at $15 and up, flat $2.95 below that. Shipping and tax are outside the fee base, and a " +
      "prepaid USPS label up to 5 lb is included — leave your label cost at zero unless you exceed the weight.",
  },
  depop: {
    name: "Depop",
    feeBase: "item + shipping",
    adLabel: "Boosted Listings rate",
    note: "No selling fee for US sellers. You pay 3.3% + $0.45 payment processing. Boosted Listings run roughly 8–12% when used.",
  },
  facebook: {
    name: "Facebook",
    feeBase: "item + shipping",
    note: "10% on shipped orders with a $0.80 minimum. Local pickup costs nothing — set the rate to 0 for a cash meetup.",
  },
  whatnot: {
    name: "Whatnot",
    feeBase: "commission on item, processing on the full order",
    note:
      "8% commission on most categories, 5% electronics, 4% coins. Plus 2.9% + $0.30 processing on the whole order. " +
      "In select categories there is no commission on the portion of an order above $1,500.",
    catKey: "wnCat",
  },
  amazon: {
    name: "Amazon",
    feeBase: "item + shipping (not tax)",
    note:
      "Referral fee runs 5–45% by category, 15% in most. A $0.30 per-item minimum applies. Apparel and jewelry are tiered. " +
      "Referral is charged on the listed price before any coupon. FBA fulfillment is separate.",
    catKey: "amzCat",
  },
  etsy: {
    name: "Etsy",
    feeBase: "item + shipping",
    adLabel: "Etsy Ads rate",
    note: "6.5% transaction fee, 3% + $0.25 processing, and the $0.20 listing fee. Roughly 9.5% + $0.45 all in.",
  },
  offerup: {
    name: "OfferUp",
    feeBase: "item price only",
    note: "12.9% on shipped orders with a $1.99 minimum. Local sales are free.",
  },
  stockx: {
    name: "StockX",
    feeBase: "sale price",
    note:
      "Transaction fee runs 9% at Level 1 down to 7% at Level 5, plus 3% processing and a $5 US shipping fee. " +
      "Minimum seller fee is $5. Levels reset quarterly.",
  },
  grailed: {
    name: "Grailed",
    feeBase: "item + shipping",
    note:
      "9% at $120 and above; 6% below with a $1.99 minimum. Plus about 2.9% + $0.30 processing. " +
      "International sales add roughly 4.99% + $0.49.",
  },
  vinted: {
    name: "Vinted",
    feeBase: "no seller fee",
    note: "No seller fee in the US. The buyer pays $0.70 + 5% buyer protection, so your listed price is what lands.",
  },
  local: {
    name: "Cash / local",
    feeBase: "no fee",
    note: "No marketplace cut. You pay in time, meetups and no-shows instead.",
  },
};

/* ---------- USPS Ground Advantage estimates, mid-2026 commercial-ish ---------- */
export const SHIP_TABLE = {
  labels: ["Zones 1–4", "Zones 5–6", "Zones 7–8"],
  rows: [
    { w: "Under 8 oz", v: [4.9, 5.4, 6.1] },
    { w: "8 oz – 1 lb", v: [7.61, 8.6, 9.9] },
    { w: "2 lb", v: [8.9, 10.4, 12.3] },
    { w: "3 lb", v: [9.9, 12.1, 14.8] },
    { w: "5 lb", v: [11.6, 15.2, 19.4] },
    { w: "10 lb", v: [14.2, 22.0, 30.5] },
    { w: "20 lb", v: [16.5, 34.0, 48.0] },
  ],
};

export const CATEGORIES = {
  clothing: { name: "Clothing", risk: 6, typicalDays: 45, note: "Fast for known brands, slow for generic. Fit returns are the main leak." },
  sneakers: { name: "Shoes & sneakers", risk: 16, typicalDays: 21, note: "Sizes 9–11 move fastest. Authentication risk is real above $150." },
  electronics: { name: "Electronics", risk: 20, typicalDays: 14, note: "Turns fastest of any category. Test function before you list." },
  cards: { name: "Cards & collectibles", risk: 12, typicalDays: 30, note: "Price swings with the player or set. Check recent sales, not last year's." },
  furniture: { name: "Home & furniture", risk: 10, typicalDays: 60, note: "Local only in most cases. Shipping usually kills the margin." },
  tools: { name: "Tools & equipment", risk: 6, typicalDays: 30, note: "Steady demand, heavy boxes. Weigh before you commit to a price." },
  toys: { name: "Toys & games", risk: 6, typicalDays: 40, note: "Sealed and vintage carry the margin. Loose pieces sit." },
  media: { name: "Books, games & media", risk: 3, typicalDays: 75, note: "Slow but cheap to hold. eBay charges 15.3% here, which hurts at low prices." },
  jewelry: { name: "Jewelry & watches", risk: 22, typicalDays: 60, note: "High margin, high fraud exposure. Photograph hallmarks and serials." },
  auto: { name: "Auto & parts", risk: 12, typicalDays: 45, note: "Fitment questions drive returns. List the part number in the title." },
  other: { name: "Something else", risk: 8, typicalDays: 45, note: "" },
};

export const CONDITIONS = {
  new: { name: "New or sealed", risk: 0 },
  likenew: { name: "Like new", risk: 3 },
  good: { name: "Good, used", risk: 7 },
  fair: { name: "Fair, flawed", risk: 13 },
  parts: { name: "For parts", risk: 20 },
};

export const BASIS = {
  sold: { name: "Sold comps", weight: 30 },
  active: { name: "Active listings", weight: 12 },
  gut: { name: "Gut feel", weight: 3 },
};

export const REFERENCE = [
  {
    title: "Where to find real sold prices",
    body: [
      "eBay sold and completed filter, plus Product Research inside Seller Hub — free and goes back two to three years.",
      "130point for accepted best-offer prices on cards and collectibles. Free.",
      "PriceCharting for video games, sealed media and graded items. Free tier is usable.",
      "Keepa for Amazon price and sales-rank history. Free graph, paid tier for the buy box and rank data.",
      "Card Ladder for sports and trading cards, tracking every public sale back to 2000. Paid.",
      "WorthPoint for antiques and oddities where nothing recent has sold. Paid, archive-deep.",
      "Poshmark, Mercari, StockX and Whatnot all show their own sold or past-auction history for free.",
    ],
  },
  {
    title: "How to pick comps that are actually comparable",
    body: [
      "Sold only. Never price off active listings.",
      "Use a 90-day window by default. Go shorter only when prices are moving fast.",
      "Match variant, size, condition, colorway and what was included in the box.",
      "Aim for five or more, throw out the extremes, and use the median rather than the average.",
      "If the comp was an accepted offer you cannot see, knock 15% to 25% off the listed price.",
      "Sell-through rate = sold ÷ (sold + active) over 30 days. Over 50% is a healthy signal; over 75% with flat or rising prices is a green light; under 20% is a flooded market.",
    ],
  },
  {
    title: "Buy rules experienced sellers use",
    body: [
      "The 3x rule: expect roughly three times your money back. Two is acceptable on fast, low-risk movers; four or five on slow or risky items.",
      "Set a dollar floor as well as a percentage. Most sellers will not list for under about $15 net, because the time cost is the same either way.",
      "Margin at 30% or better after all fees. Under 20%, one return erases several sales.",
      "Think in annual return, not per-item margin. $20 profit turning weekly beats $120 profit twice a year by a wide margin.",
      "Cash turned is the real scoreboard. A pile of high-margin inventory that does not move is a savings account you cannot withdraw from.",
    ],
  },
  {
    title: "Taxes worth modeling now, not in April",
    body: [
      "The federal 1099-K threshold is back to $20,000 and 200 transactions. Some states are much lower — $600 in MA, MD, VT, VA and DC, $1,000 in IL.",
      "All of it is taxable whether or not a form arrives. The threshold governs paperwork, not liability.",
      "Track cost of goods: purchase price, inbound shipping, supplies. You are taxed on profit, not on gross sales.",
      "Mileage for 2026 splits mid-year: 72.5 cents through June 30, then 76 cents from July 1. Keep two totals.",
      "If this is a business, budget about 15.3% self-employment tax on net profit on top of income tax. The tax toggle in the money panel models both.",
    ],
  },
];

export const BLANK = {
  item: "", platform: "ebay", category: "clothing", condition: "good", basis: "gut",
  ebayCat: "standard", amzCat: "standard", wnCat: "standard", sxLevel: 1,
  trp: false, belowStd: false,
  listPrice: "", shipCharged: "0", sourceCost: "", supplies: "", inbound: "",
  outbound: "", other: "", adRate: "0", taxRate: "7", hours: "", days: "", str: "",
  taxOn: false, incRate: "22", feeTouched: false,
};

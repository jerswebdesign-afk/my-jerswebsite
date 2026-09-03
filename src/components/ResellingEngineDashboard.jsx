import { useState, useEffect, useMemo } from "react";
import { BLANK, PLATFORMS, CATEGORIES, CONDITIONS, BASIS } from './ResellingEngineData.js';
import { num, runNumbers, scoreDeal, scoreInputs, buyRules, buildCards, compStats } from './ResellingEngineCalculations.js';
import { storage } from './ResellingEngineStorage.js';
import { resellingEngineStyles } from './ResellingEngineStyles.js';
import ResellingEngineHeader from './ResellingEngineHeader.jsx';
import ResellingEngineTicket from './ResellingEngineTicket.jsx';
import ResellingEngineInputs from './ResellingEngineInputs.jsx';
import ResellingEngineResults from './ResellingEngineResults.jsx';

/* ==================================================================
   RESELLING PRICING DESK — the gated Reselling Engine dashboard.
   This file owns all state, derived values and handlers; it composes
   the presentational pieces below rather than rendering everything
   itself. To change:
     - fee/scoring math or copy tables      -> ResellingEngineCalculations.js / ResellingEngineData.js
     - the title/subtitle/platform chips    -> ResellingEngineHeader.jsx
     - the "most you should pay" banner     -> ResellingEngineTicket.jsx
     - the left-column form panels          -> ResellingEngineInputs.jsx and its 4 panel files
     - the right-column stats/tabs          -> ResellingEngineResults.jsx and its tab files
     - colors/layout/animation              -> ResellingEngineStyles.js
   ================================================================== */

export default function ResellingEngineDashboard() {
  const [f, setF] = useState(BLANK);
  const [ov, setOv] = useState({});
  const [comps, setComps] = useState([]);
  const [compDraft, setCompDraft] = useState("");
  const [targetRoi, setTargetRoi] = useState(1.0);
  const [tab, setTab] = useState("score");
  const [showFees, setShowFees] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const [ai, setAi] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [research, setResearch] = useState(null);
  const [researchBusy, setResearchBusy] = useState(false);
  const [log, setLog] = useState([]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const toggle = (k) => () => setF((p) => ({ ...p, [k]: !p[k] }));

  const r = useMemo(() => runNumbers(f, ov, targetRoi), [f, ov, targetRoi]);
  const deal = useMemo(() => scoreDeal(f, r), [f, r]);
  const inputs = useMemo(() => scoreInputs(f, r, comps), [f, r, comps]);
  const rules = useMemo(() => buyRules(f, r), [f, r]);
  const cards = useMemo(() => buildCards(f, r, deal), [f, r, deal]);
  const cs = comps.length ? compStats(comps) : null;
  const plat = PLATFORMS[f.platform];

  useEffect(() => {
    (async () => {
      try {
        const keys = await storage.list("flip:");
        const rows = [];
        for (const k of keys.keys || []) {
          try { const g = await storage.get(k); if (g) rows.push(JSON.parse(g.value)); } catch (e) {}
        }
        rows.sort((a, b) => b.at - a.at);
        setLog(rows);
      } catch (e) {}
    })();
  }, []);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3500); };

  const addComp = () => {
    const v = num(compDraft);
    if (v > 0) { setComps((c) => [...c, v]); setCompDraft(""); }
  };

  const saveFlip = async () => {
    const row = {
      id: "flip:" + Date.now(), at: Date.now(), item: f.item || "Untitled item",
      platform: plat.name, cost: r.cashAtRisk, price: r.price, net: r.net,
      roi: r.roi, score: deal.score, verdict: deal.verdict,
    };
    try {
      await storage.set(row.id, JSON.stringify(row));
      setLog((l) => [row, ...l]);
      flash("Saved to your log.");
    } catch (e) { flash("Could not save. Write the numbers down — they are still correct."); }
  };

  const removeRow = async (id) => {
    try { await storage.delete(id); } catch (e) {}
    setLog((l) => l.filter((x) => x.id !== id));
  };

  const resetItem = () => { setF(BLANK); setComps([]); setAi(null); setResearch(null); setOv({}); };

  const selectPlatform = (k) => { setF((p) => ({ ...p, platform: k })); setOv({}); };

  const askClaude = async () => {
    setAiBusy(true); setAi(null);
    const payload = {
      item: f.item, marketplace: plat.name, fee_base: plat.feeBase,
      category: CATEGORIES[f.category].name, condition: CONDITIONS[f.condition].name,
      price_basis: BASIS[f.basis].name, sold_comps: comps,
      sell_through_pct: num(f.str), list_price: r.price, shipping_charged: num(f.shipCharged),
      item_cost: r.cost, label_cost: r.outbound,
      other_cash: num(f.supplies) + num(f.inbound) + num(f.other),
      ad_rate_pct: num(f.adRate), est_days_to_sell: r.days, est_hours: r.hours,
      computed: {
        marketplace_fees: +r.fees.total.toFixed(2), take_rate: +(r.takeRate * 100).toFixed(1),
        net_profit: +r.net.toFixed(2), roi: r.roi, margin: r.margin,
        annualized_roi: r.annualRoi, breakeven_price: r.breakeven ? +r.breakeven.toFixed(2) : null,
        max_offer_at_target: +r.maxOffer.toFixed(2), target_roi: targetRoi,
        deal_score: deal.score, input_confidence: inputs.score,
        buy_rules_failed: rules.filter((x) => !x.pass).map((x) => x.name),
      },
    };
    const prompt =
      "You are a blunt, experienced reseller reviewing one sourcing decision for another reseller. Deal:\n" +
      JSON.stringify(payload, null, 1) +
      "\n\nJudge the quality of the inputs, not only the deal. Call out anything unrealistic: a resale price that " +
      "looks like retail, a label cost too low for the category and weight, a days-to-sell guess that ignores how " +
      "the category actually moves, a missing sell-through check. Respond with ONLY a JSON object, no markdown " +
      "fences and no preamble:\n" +
      '{"verdict":"buy|thin|pass","headline":"one blunt sentence","input_review":[{"field":"short name",' +
      '"rating":"solid|shaky|missing","note":"under 18 words"}],"blind_spots":["under 16 words each"],' +
      '"price_ladder":{"list":number,"accept":number,"floor":number,"why":"under 20 words"},' +
      '"listing_title":"under 80 chars, front-loaded with search terms","next_actions":["under 12 words each"]}\n' +
      "Cap input_review at 4, blind_spots at 3, next_actions at 3.";
    try {
      const res = await fetch("/api/reselling-ai-review", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAi(JSON.parse(String(data.text || "").replace(/```json|```/g, "").trim()));
    } catch (e) { flash("The review did not come back. Try again in a moment."); }
    setAiBusy(false);
  };

  const runResearch = async () => {
    if (!f.item.trim()) { flash("Name the item first — the search needs something to look for."); return; }
    setResearchBusy(true); setResearch(null);
    try {
      const res = await fetch("/api/reselling-ai-review", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          web_search: true,
          prompt:
            "Research the current secondhand resale market for: \"" + f.item + "\" in " +
            CONDITIONS[f.condition].name + " condition, category " + CATEGORIES[f.category].name +
            ", selling on " + plat.name + ". Look for actual recent sold prices, not asking prices. " +
            "Tell me: the realistic sold range, what separates the high end from the low end, how quickly " +
            "these move, and any variant or detail that changes the value a lot. Under 140 words, plain " +
            "sentences, no headings or bullet points. Finish with exactly two lines:\nRANGE: $low-$high\nTYPICAL: $number",
        }),
      });
      const data = await res.json();
      const text = String(data.text || "").trim();
      const typical = /TYPICAL:\s*\$?([\d,.]+)/i.exec(text);
      setResearch({ text, typical: typical ? num(typical[1]) : null });
    } catch (e) { flash("The market search did not come back. Try again in a moment."); }
    setResearchBusy(false);
  };

  const totals = log.reduce((a, x) => ({ net: a.net + x.net, cost: a.cost + x.cost }), { net: 0, cost: 0 });

  return (
    <div className="desk">
      <style>{resellingEngineStyles}</style>

      <div className="wrap">
        <ResellingEngineHeader platform={f.platform} onSelectPlatform={selectPlatform} />

        <ResellingEngineTicket r={r} deal={deal} targetRoi={targetRoi} />

        <div className="grid2">
          <ResellingEngineInputs
            f={f} set={set} setF={setF} toggle={toggle} plat={plat} r={r}
            targetRoi={targetRoi} setTargetRoi={setTargetRoi}
            showFees={showFees} setShowFees={setShowFees} showShip={showShip} setShowShip={setShowShip}
            ov={ov} setOv={setOv}
          />

          <ResellingEngineResults
            f={f} r={r} onSave={saveFlip} onReset={resetItem} msg={msg}
            tab={tab} setTab={setTab}
            deal={deal} rules={rules} inputs={inputs} ai={ai} aiBusy={aiBusy} onAskClaude={askClaude}
            comps={comps} setComps={setComps} compDraft={compDraft} setCompDraft={setCompDraft} onAddComp={addComp} cs={cs} setF={setF}
            research={research} researchBusy={researchBusy} onRunResearch={runResearch}
            cards={cards}
            log={log} totals={totals} onRemoveRow={removeRow}
          />
        </div>

        <p className="note" style={{ maxWidth: "64ch" }}>
          Fee rates are US seller rates as of September 2026 and many depend on your account — store subscription,
          seller level, performance standing and category all move them. Confirm yours on the platform's fee page
          and override the rate above. Every number on this page moves when that rate does.
        </p>
      </div>
    </div>
  );
}

import ResellingEngineField from './ResellingEngineField.jsx';
import { EBAY_CATS, AMZ_CATS, WN_CATS, STOCKX_LEVELS } from './ResellingEngineData.js';
import { money } from './ResellingEngineCalculations.js';

/* Per-platform fee inputs, the computed fee line items, and the rate
   override escape hatch. */
export default function ResellingEngineFeesPanel({ f, set, setF, toggle, plat, r, showFees, setShowFees, ov, setOv }) {
  return (
    <div className="panel">
      <h2>Fees on {plat.name}</h2>
      <p className="note" style={{ marginTop: 0 }}>{plat.note}</p>
      <p className="note">Fee base: {plat.feeBase}.</p>

      {f.platform === "ebay" && (
        <>
          <ResellingEngineField id="ec" label="eBay category">
            <select id="ec" value={f.ebayCat} onChange={(e) => { set("ebayCat")(e); setF((p) => ({ ...p, feeTouched: true, ebayCat: e.target.value })); }}>
              {Object.entries(EBAY_CATS).map(([k, v]) => <option key={k} value={k}>{v.name} — {v.pct}%</option>)}
            </select>
          </ResellingEngineField>
          <label className="switch">
            <input type="checkbox" checked={f.trp} onChange={toggle("trp")} style={{ width: 18 }} />
            Top Rated Plus (10% off the variable fee)
          </label>
          <label className="switch">
            <input type="checkbox" checked={f.belowStd} onChange={toggle("belowStd")} style={{ width: 18 }} />
            Below Standard seller (adds 6 points)
          </label>
          <ResellingEngineField id="tr" label="Sales tax the buyer pays" hint="eBay charges its fee on this too">
            <input id="tr" inputMode="decimal" value={f.taxRate} onChange={set("taxRate")} />
          </ResellingEngineField>
        </>
      )}
      {f.platform === "amazon" && (
        <ResellingEngineField id="ac" label="Amazon category">
          <select id="ac" value={f.amzCat} onChange={(e) => setF((p) => ({ ...p, amzCat: e.target.value, feeTouched: true }))}>
            {Object.entries(AMZ_CATS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </ResellingEngineField>
      )}
      {f.platform === "whatnot" && (
        <ResellingEngineField id="wc" label="Whatnot category">
          <select id="wc" value={f.wnCat} onChange={(e) => setF((p) => ({ ...p, wnCat: e.target.value, feeTouched: true }))}>
            {Object.entries(WN_CATS).map(([k, v]) => <option key={k} value={k}>{v.name} — {v.pct}%</option>)}
          </select>
        </ResellingEngineField>
      )}
      {f.platform === "stockx" && (
        <ResellingEngineField id="sl" label="Your seller level">
          <select id="sl" value={f.sxLevel} onChange={(e) => setF((p) => ({ ...p, sxLevel: e.target.value, feeTouched: true }))}>
            {Object.entries(STOCKX_LEVELS).map(([k, v]) => <option key={k} value={k}>Level {k} — {v}%</option>)}
          </select>
        </ResellingEngineField>
      )}

      {r.fees.lines.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {r.fees.lines.map((l, i) => (
            <div className="feeline" key={i}><span>{l.label}</span><b>{money(l.amt)}</b></div>
          ))}
          <div className="feeline" style={{ borderTop: "1px solid var(--rule)", marginTop: 4, paddingTop: 6 }}>
            <span>Total taken from this sale</span><b>{money(r.fees.total)}</b>
          </div>
        </div>
      )}

      <div className="btnrow">
        <button className="btn ghost" onClick={() => { setShowFees(!showFees); setF((p) => ({ ...p, feeTouched: true })); }}>
          {showFees ? "Done editing rates" : "Override the rate"}
        </button>
      </div>
      {showFees && (
        <>
          <ResellingEngineField id="ovp" label="Main percentage" hint="Whatever your account actually pays">
            <input id="ovp" inputMode="decimal" placeholder="e.g. 12.35"
              value={ov.ebayPct ?? ov.mercariPct ?? ov.poshPct ?? ""}
              onChange={(e) => setOv({
                ebayPct: e.target.value, mercariPct: e.target.value, poshPct: e.target.value,
                depopPct: e.target.value, fbPct: e.target.value, wnPct: e.target.value,
                amzPct: e.target.value, etsyPct: e.target.value, oufPct: e.target.value, sxPct: e.target.value,
              })} />
          </ResellingEngineField>
          <p className="note">Applies to whichever platform is selected. Clear it to return to the standard rate.</p>
        </>
      )}
    </div>
  );
}

import { money, pct } from './ResellingEngineCalculations.js';

/* "What you actually clear": the headline stat grid plus save/reset. */
export default function ResellingEngineSummaryPanel({ f, r, onSave, onReset, msg }) {
  return (
    <div className="panel">
      <h2>What you actually clear</h2>
      <div className="stats">
        <div className="stat"><b style={{ color: r.net >= 0 ? "var(--ink)" : "var(--stop)" }}>{money(r.net)}</b><span>Net profit</span></div>
        <div className="stat"><b>{pct(r.roi)}</b><span>Return on your cash</span></div>
        <div className="stat"><b>{pct(r.margin)}</b><span>Margin</span></div>
        <div className="stat"><b>{pct(r.annualRoi)}</b><span>Annualized return</span></div>
        <div className="stat"><b>{money(r.fees.total)}</b><span>Marketplace takes {pct(r.takeRate)}</span></div>
        <div className="stat"><b>{r.hourly === null ? "—" : money(r.hourly)}</b><span>Per hour of your time</span></div>
        <div className="stat"><b>{r.breakeven ? money(r.breakeven) : "—"}</b><span>Break-even sale price</span></div>
        <div className="stat"><b>{money(r.cashAtRisk)}</b><span>Cash tied up</span></div>
        {f.taxOn && <div className="stat"><b>{money(r.afterTax)}</b><span>After tax</span></div>}
        {f.taxOn && <div className="stat"><b>{money(r.seTax + r.incTax)}</b><span>Set aside for tax</span></div>}
      </div>
      <div className="btnrow">
        <button className="btn" onClick={onSave} disabled={r.price <= 0}>Save to log</button>
        <button className="btn ghost" onClick={onReset}>New item</button>
      </div>
      {msg && <p className="note">{msg}</p>}
    </div>
  );
}

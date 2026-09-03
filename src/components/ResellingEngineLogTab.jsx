import { money, pct } from './ResellingEngineCalculations.js';

/* Log tab: running totals plus each saved flip, with a remove action. */
export default function ResellingEngineLogTab({ log, totals, onRemoveRow }) {
  return (
    <div className="panel">
      <h2>Your log</h2>
      {log.length === 0 ? (
        <p className="note" style={{ marginTop: 0 }}>
          Nothing saved yet. Score a deal and hit save — the log keeps running totals across sessions.
        </p>
      ) : (
        <>
          <div className="stats" style={{ marginBottom: 6 }}>
            <div className="stat"><b>{money(totals.net)}</b><span>Projected profit, {log.length} items</span></div>
            <div className="stat"><b>{money(totals.cost)}</b><span>Cash deployed</span></div>
            <div className="stat"><b>{totals.cost > 0 ? pct(totals.net / totals.cost) : "—"}</b><span>Blended return</span></div>
            <div className="stat"><b>{money(totals.net / log.length)}</b><span>Average per item</span></div>
          </div>
          {log.map((row) => (
            <div className="logrow" key={row.id}>
              <span>{row.item}<em style={{ fontStyle: "normal", color: "var(--muted)" }}> · {row.platform}</em></span>
              <span style={{ whiteSpace: "nowrap" }}>
                {money(row.net)} · {row.score}
                <button className="x" onClick={() => onRemoveRow(row.id)} aria-label="Remove">×</button>
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

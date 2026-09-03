import { money } from './ResellingEngineCalculations.js';
import { REFERENCE } from './ResellingEngineData.js';
import ResellingEngineResourceCard from './ResellingEngineResourceCard.jsx';

/* Comps tab: sold-comp entry and spread stats, the market research
   lookup, and the first two reference cards. */
export default function ResellingEngineCompsTab({
  comps, setComps, compDraft, setCompDraft, onAddComp, cs, setF,
  research, researchBusy, onRunResearch,
}) {
  return (
    <>
      <div className="panel">
        <h2>Sold comps</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input inputMode="decimal" value={compDraft} placeholder="Sold price"
            onChange={(e) => setCompDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddComp()}
            style={{ flex: 1, textAlign: "left" }} />
          <button className="btn ghost" onClick={onAddComp}>Add</button>
        </div>
        {comps.length === 0 ? (
          <p className="note" style={{ marginTop: 0 }}>
            Nothing logged yet. Add five sold prices and the median becomes a number you can bet cash on.
          </p>
        ) : (
          <>
            <div>
              {comps.map((c, i) => (
                <span className="comp-chip" key={i}>{money(c)}
                  <button onClick={() => setComps(comps.filter((_, j) => j !== i))} aria-label="Remove">×</button>
                </span>
              ))}
            </div>
            <div className="stats" style={{ marginTop: 8 }}>
              <div className="stat"><b>{money(cs.median)}</b><span>Median sold</span></div>
              <div className="stat"><b>{money(cs.low)}–{money(cs.high)}</b><span>Full range</span></div>
              <div className="stat"><b>{money(cs.q1)}–{money(cs.q3)}</b><span>Middle half</span></div>
              <div className="stat"><b>{Math.round(cs.cv * 100)}%</b><span>Spread {cs.cv < 0.2 ? "— tight" : cs.cv < 0.35 ? "— workable" : "— too scattered"}</span></div>
            </div>
            <div className="btnrow">
              <button className="btn ghost" onClick={() => setF((p) => ({ ...p, listPrice: cs.median.toFixed(2), basis: "sold" }))}>
                Price at the median
              </button>
              <button className="btn ghost" onClick={() => setF((p) => ({ ...p, listPrice: (cs.median * 0.8).toFixed(2), basis: "sold" }))}>
                Price to move fast
              </button>
            </div>
            {cs.cv >= 0.35 && (
              <p className="note">
                A spread this wide usually means the comps are not the same item. Check size, variant,
                condition and whether the box was included before you trust the median.
              </p>
            )}
          </>
        )}
      </div>

      <div className="panel">
        <h2>Check the market</h2>
        <p className="note" style={{ marginTop: 0 }}>
          Searches the web for what this is actually selling for now, and what moves the price.
        </p>
        <div className="btnrow">
          <button className="btn" onClick={onRunResearch} disabled={researchBusy}>
            {researchBusy ? "Searching…" : "Search sold prices"}
          </button>
          {research?.typical && (
            <button className="btn ghost" onClick={() => setF((p) => ({ ...p, listPrice: research.typical.toFixed(2) }))}>
              Use {money(research.typical)}
            </button>
          )}
        </div>
        {research && <p className="note" style={{ whiteSpace: "pre-wrap" }}>{research.text}</p>}
      </div>

      <ResellingEngineResourceCard title={REFERENCE[0].title} body={REFERENCE[0].body} />
      <ResellingEngineResourceCard title={REFERENCE[1].title} body={REFERENCE[1].body} />
    </>
  );
}

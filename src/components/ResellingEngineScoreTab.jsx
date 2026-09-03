import { money, pct, num } from './ResellingEngineCalculations.js';

/* Score tab: deal score breakdown, buy rules, input confidence, and the
   optional Claude "second opinion" review. */
export default function ResellingEngineScoreTab({ deal, rules, inputs, price, ai, aiBusy, onAskClaude }) {
  return (
    <>
      <div className="panel">
        <h2>Deal score: {deal.score} out of 100</h2>
        {deal.parts.map((p) => (
          <div className="srow" key={p.key}>
            <div className="srow-top"><span>{p.key}</span><em>{p.detail}</em></div>
            <div className="bar"><i style={{ width: Math.round(p.v) + "%" }} /></div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Buy rules</h2>
        {rules.map((x) => (
          <div className="rule" key={x.name}>
            <div>
              <span style={{ fontWeight: 600 }}>{x.name}</span>
              <small>{x.why}</small>
            </div>
            <span style={{ color: x.pass ? "var(--go)" : "var(--stop)", fontWeight: 600, whiteSpace: "nowrap", fontSize: 13.5 }}>
              {x.pass ? "✓ " : "✕ "}{x.detail}
            </span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>How solid your inputs are: {inputs.score} out of 100</h2>
        {inputs.rows.map((row) => {
          const ratio = row.got / row.max;
          const color = ratio >= 0.9 ? "var(--go)" : ratio > 0 ? "var(--warn)" : "var(--rule)";
          return (
            <div className="check" key={row.label}>
              <span className="dot" style={{ background: color }} />
              <div><p>{row.label}</p>{row.fix && <small>{row.fix}</small>}</div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <h2>Second opinion</h2>
        <p className="note" style={{ marginTop: 0 }}>
          Sends the whole deal to Claude for a read on whether your assumptions hold up, plus a price
          ladder and a listing title.
        </p>
        <div className="btnrow">
          <button className="btn" onClick={onAskClaude} disabled={aiBusy || price <= 0}>
            {aiBusy ? "Reading the deal…" : "Review this deal"}
          </button>
        </div>
        {ai && (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px" }}>
              <span className="flag" style={{
                background: ai.verdict === "buy" ? "var(--go)" : ai.verdict === "thin" ? "var(--warn)" : "var(--stop)",
                marginRight: 8,
              }}>{ai.verdict}</span>{ai.headline}
            </p>
            {ai.input_review?.map((x, i) => (
              <div className="check" key={i}>
                <span className="dot" style={{ background: x.rating === "solid" ? "var(--go)" : x.rating === "shaky" ? "var(--warn)" : "var(--stop)" }} />
                <div><p>{x.field}</p><small>{x.note}</small></div>
              </div>
            ))}
            {ai.price_ladder && (
              <>
                <div className="stats" style={{ marginTop: 12 }}>
                  <div className="stat"><b>{money(num(ai.price_ladder.list))}</b><span>List at</span></div>
                  <div className="stat"><b>{money(num(ai.price_ladder.accept))}</b><span>Take an offer at</span></div>
                  <div className="stat"><b>{money(num(ai.price_ladder.floor))}</b><span>Floor</span></div>
                </div>
                <p className="note">{ai.price_ladder.why}</p>
              </>
            )}
            {ai.listing_title && <p className="note"><strong style={{ color: "var(--ink)" }}>Title:</strong> {ai.listing_title}</p>}
            {ai.blind_spots?.length > 0 && (
              <div className="card warn" style={{ marginTop: 12 }}>
                <h3>What you might be missing</h3>
                {ai.blind_spots.map((b, i) => <p key={i}>{b}</p>)}
              </div>
            )}
            {ai.next_actions?.length > 0 && (
              <div className="card go">
                <h3>Do this next</h3>
                {ai.next_actions.map((b, i) => <p key={i}>{b}</p>)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

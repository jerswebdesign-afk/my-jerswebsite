import { money, pct } from './ResellingEngineCalculations.js';

const VERDICT_COLOR = { buy: "var(--go)", thin: "var(--warn)", pass: "var(--stop)" };
const VERDICT_WORD = { buy: "Buy it", thin: "Thin", pass: "Walk" };

/* The "most you should pay for it" headline banner. */
export default function ResellingEngineTicket({ r, deal, targetRoi }) {
  return (
    <div className="ticket">
      <div className="punch" />
      <p className="tick-label">Most you should pay for it</p>
      <p className="tick-num">{r.price > 0 ? money(Math.max(0, r.maxOffer)) : "—"}</p>
      <p className="tick-note">
        {r.price > 0
          ? "Your ceiling at " + pct(targetRoi) + " return on cash. Break-even sale price is " +
            (r.breakeven ? money(r.breakeven) : "—") + "."
          : "Enter a sale price below and this becomes your walk-away number at the table."}
      </p>
      <div className="tick-v">
        <b style={{ color: VERDICT_COLOR[deal.verdict] }}>{VERDICT_WORD[deal.verdict]}</b>
        <span>{deal.score}/100</span>
      </div>
    </div>
  );
}

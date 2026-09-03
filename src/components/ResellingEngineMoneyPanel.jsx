import ResellingEngineField from './ResellingEngineField.jsx';
import { SHIP_TABLE } from './ResellingEngineData.js';
import { money } from './ResellingEngineCalculations.js';

/* "The money" panel: sale price, costs, ad rate, the shipping estimator
   and the self-employment/income tax toggle. */
export default function ResellingEngineMoneyPanel({ f, set, setF, toggle, plat, showShip, setShowShip }) {
  return (
    <div className="panel">
      <h2>The money</h2>
      {[
        ["listPrice", "Sale price", "What the buyer pays for the item"],
        ["shipCharged", "Shipping you charge", "Zero if you offer free shipping"],
        ["sourceCost", "What you pay for it", "Your cost at the table"],
        ["outbound", "Label and packing", "Real label price, not a guess"],
        ["supplies", "Supplies", "Mailers, tape, tags"],
        ["inbound", "Getting it home", "Gas, buyer premium, pickup"],
        ["other", "Anything else", "Cleaning, repairs, authentication"],
      ].map(([k, label, hint]) => (
        <ResellingEngineField key={k} id={k} label={label} hint={hint}>
          <input id={k} inputMode="decimal" value={f[k]} onChange={set(k)} placeholder="0.00" />
        </ResellingEngineField>
      ))}
      <ResellingEngineField id="adRate" label={plat.adLabel || "Ad rate"} hint="Percent of item price, if you promote">
        <input id="adRate" inputMode="decimal" value={f.adRate} onChange={set("adRate")} />
      </ResellingEngineField>
      <div className="btnrow">
        <button className="btn ghost" onClick={() => setShowShip(!showShip)}>
          {showShip ? "Hide shipping estimates" : "Estimate a label"}
        </button>
      </div>
      {showShip && (
        <>
          <table>
            <thead><tr><th>Weight</th>{SHIP_TABLE.labels.map((l) => <th key={l}>{l}</th>)}</tr></thead>
            <tbody>
              {SHIP_TABLE.rows.map((row) => (
                <tr key={row.w}>
                  <td>{row.w}</td>
                  {row.v.map((v, i) => (
                    <td key={i}>
                      <button className="x" style={{ color: "var(--ink)" }}
                        onClick={() => setF((p) => ({ ...p, outbound: v.toFixed(2) }))}>{money(v)}</button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            USPS Ground Advantage, mid-2026 commercial rates. Tap a number to use it. A temporary
            transportation surcharge runs through January 2027, so price the real label before a thin deal.
          </p>
        </>
      )}
      <label className="switch">
        <input type="checkbox" checked={f.taxOn} onChange={toggle("taxOn")} style={{ width: 18 }} />
        Model self-employment and income tax on the profit
      </label>
      {f.taxOn && (
        <ResellingEngineField id="incRate" label="Your income tax rate" hint="Self-employment tax of 15.3% is added automatically">
          <input id="incRate" inputMode="decimal" value={f.incRate} onChange={set("incRate")} />
        </ResellingEngineField>
      )}
    </div>
  );
}

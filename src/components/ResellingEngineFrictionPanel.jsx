import ResellingEngineField from './ResellingEngineField.jsx';
import { CATEGORIES } from './ResellingEngineData.js';

/* "The friction" panel: sell-through, time-to-sell, hours and target return. */
export default function ResellingEngineFrictionPanel({ f, set, targetRoi, setTargetRoi }) {
  return (
    <div className="panel">
      <h2>The friction</h2>
      <ResellingEngineField id="str" label="Sell-through rate" hint="Sold ÷ (sold + active) over 30 days, as a percent">
        <input id="str" inputMode="decimal" value={f.str} onChange={set("str")} placeholder="—" />
      </ResellingEngineField>
      <ResellingEngineField id="days" label="Days until it sells" hint={"Typical for this category is around " + CATEGORIES[f.category].typicalDays + " days"}>
        <input id="days" inputMode="decimal" value={f.days} onChange={set("days")} placeholder={String(CATEGORIES[f.category].typicalDays)} />
      </ResellingEngineField>
      <ResellingEngineField id="hours" label="Hours of your time" hint="Sourcing, photos, listing, packing">
        <input id="hours" inputMode="decimal" value={f.hours} onChange={set("hours")} placeholder="1.0" />
      </ResellingEngineField>
      <ResellingEngineField id="troi" label="Return you want" hint="Sets the max offer on the tag">
        <select id="troi" value={targetRoi} onChange={(e) => setTargetRoi(parseFloat(e.target.value))}>
          <option value={0.5}>50% on cash</option>
          <option value={0.75}>75% on cash</option>
          <option value={1}>Double your money</option>
          <option value={1.5}>150% on cash</option>
          <option value={2}>Triple your money</option>
        </select>
      </ResellingEngineField>
    </div>
  );
}

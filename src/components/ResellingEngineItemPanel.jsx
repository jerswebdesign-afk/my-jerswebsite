import ResellingEngineField from './ResellingEngineField.jsx';
import { CATEGORIES, CONDITIONS, BASIS } from './ResellingEngineData.js';

/* "The item" panel: what it is, category, condition, price basis. */
export default function ResellingEngineItemPanel({ f, set }) {
  return (
    <div className="panel">
      <h2>The item</h2>
      <div className="field full" style={{ display: "block" }}>
        <label htmlFor="it">What is it</label>
        <input id="it" value={f.item} onChange={set("item")} placeholder="Carhartt J130 Detroit jacket, XL, brown" />
      </div>
      <ResellingEngineField id="cat" label="Category">
        <select id="cat" value={f.category} onChange={set("category")}>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </ResellingEngineField>
      <ResellingEngineField id="con" label="Condition">
        <select id="con" value={f.condition} onChange={set("condition")}>
          {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </ResellingEngineField>
      <ResellingEngineField id="bas" label="Your price came from">
        <select id="bas" value={f.basis} onChange={set("basis")}>
          {Object.entries(BASIS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </ResellingEngineField>
      {CATEGORIES[f.category].note && <p className="note">{CATEGORIES[f.category].note}</p>}
    </div>
  );
}

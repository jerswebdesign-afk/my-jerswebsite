import ResellingEngineSummaryPanel from './ResellingEngineSummaryPanel.jsx';
import ResellingEngineControls from './ResellingEngineControls.jsx';
import ResellingEngineScoreTab from './ResellingEngineScoreTab.jsx';
import ResellingEngineCompsTab from './ResellingEngineCompsTab.jsx';
import ResellingEnginePlaybookTab from './ResellingEnginePlaybookTab.jsx';
import ResellingEngineLogTab from './ResellingEngineLogTab.jsx';

/* Right column: the summary stat panel, the tab switcher, and whichever
   result tab is active. Add a new tab here plus its own file rather
   than growing one of the existing tab components. */
export default function ResellingEngineResults({
  f, r, onSave, onReset, msg,
  tab, setTab,
  deal, rules, inputs, ai, aiBusy, onAskClaude,
  comps, setComps, compDraft, setCompDraft, onAddComp, cs, setF,
  research, researchBusy, onRunResearch,
  cards,
  log, totals, onRemoveRow,
}) {
  return (
    <div>
      <ResellingEngineSummaryPanel f={f} r={r} onSave={onSave} onReset={onReset} msg={msg} />

      <ResellingEngineControls tab={tab} setTab={setTab} />

      {tab === "score" && (
        <ResellingEngineScoreTab deal={deal} rules={rules} inputs={inputs} price={r.price} ai={ai} aiBusy={aiBusy} onAskClaude={onAskClaude} />
      )}

      {tab === "comps" && (
        <ResellingEngineCompsTab
          comps={comps} setComps={setComps} compDraft={compDraft} setCompDraft={setCompDraft} onAddComp={onAddComp} cs={cs} setF={setF}
          research={research} researchBusy={researchBusy} onRunResearch={onRunResearch}
        />
      )}

      {tab === "play" && <ResellingEnginePlaybookTab cards={cards} />}

      {tab === "log" && <ResellingEngineLogTab log={log} totals={totals} onRemoveRow={onRemoveRow} />}
    </div>
  );
}

const TABS = [["score", "Score"], ["comps", "Comps"], ["play", "Playbook"], ["log", "Log"]];

/* The Score / Comps / Playbook / Log tab switcher for the results side. */
export default function ResellingEngineControls({ tab, setTab }) {
  return (
    <div className="tabs" role="tablist">
      {TABS.map(([k, label]) => (
        <button key={k} role="tab" className="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
      ))}
    </div>
  );
}

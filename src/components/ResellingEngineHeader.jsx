import { PLATFORMS } from './ResellingEngineData.js';

/* Title, subtitle and the marketplace selector chips. */
export default function ResellingEngineHeader({ platform, onSelectPlatform }) {
  return (
    <>
      <h1>Reselling pricing desk</h1>
      <p className="sub">
        Work out what a flip actually pays after this marketplace takes its cut, get the most you should offer,
        and see how solid your inputs are before you hand over cash.
      </p>

      <div className="chips">
        {Object.entries(PLATFORMS).map(([k, v]) => (
          <button key={k} className="chip" aria-pressed={platform === k}
            onClick={() => onSelectPlatform(k)}>{v.name}</button>
        ))}
      </div>
    </>
  );
}

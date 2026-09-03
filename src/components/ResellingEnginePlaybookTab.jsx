import { REFERENCE } from './ResellingEngineData.js';
import ResellingEngineResourceCard from './ResellingEngineResourceCard.jsx';

/* Playbook tab: the situational advice cards this specific deal
   triggered, plus the buy-rules and tax reference cards. */
export default function ResellingEnginePlaybookTab({ cards }) {
  return (
    <>
      {cards.length === 0 && (
        <div className="panel">
          <p className="note" style={{ marginTop: 0 }}>
            Fill in a sale price and a cost and the levers for this specific deal show up here.
          </p>
        </div>
      )}
      {cards.map((c, i) => (
        <div className="panel" key={i}>
          <div className={"card " + c.tone}>
            <h3>{c.title}</h3>
            {c.body.map((b, j) => <p key={j}>{b}</p>)}
          </div>
        </div>
      ))}
      {REFERENCE.slice(2).map((c, i) => (
        <ResellingEngineResourceCard key={i} title={c.title} body={c.body} />
      ))}
    </>
  );
}

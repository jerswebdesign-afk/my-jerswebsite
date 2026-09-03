/* One reference/education card from ResellingEngineData's REFERENCE list. */
export default function ResellingEngineResourceCard({ title, body }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {body.map((b, i) => <p key={i} style={{ margin: "0 0 6px", fontSize: 14 }}>{b}</p>)}
    </div>
  );
}

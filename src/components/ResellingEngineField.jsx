/* Shared label/hint/input row used across the input panels. */
export default function ResellingEngineField({ id, label, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{hint && <small>{hint}</small>}</label>
      {children}
    </div>
  );
}

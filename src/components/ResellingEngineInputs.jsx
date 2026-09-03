import ResellingEngineItemPanel from './ResellingEngineItemPanel.jsx';
import ResellingEngineMoneyPanel from './ResellingEngineMoneyPanel.jsx';
import ResellingEngineFrictionPanel from './ResellingEngineFrictionPanel.jsx';
import ResellingEngineFeesPanel from './ResellingEngineFeesPanel.jsx';

/* Left column: everything the deal calculation reads from. Add a new
   input panel here rather than growing one of the existing ones. */
export default function ResellingEngineInputs({
  f, set, setF, toggle, plat, r,
  targetRoi, setTargetRoi,
  showFees, setShowFees, showShip, setShowShip,
  ov, setOv,
}) {
  return (
    <div>
      <ResellingEngineItemPanel f={f} set={set} />
      <ResellingEngineMoneyPanel f={f} set={set} setF={setF} toggle={toggle} plat={plat} showShip={showShip} setShowShip={setShowShip} />
      <ResellingEngineFrictionPanel f={f} set={set} targetRoi={targetRoi} setTargetRoi={setTargetRoi} />
      <ResellingEngineFeesPanel f={f} set={set} setF={setF} toggle={toggle} plat={plat} r={r} showFees={showFees} setShowFees={setShowFees} ov={ov} setOv={setOv} />
    </div>
  );
}

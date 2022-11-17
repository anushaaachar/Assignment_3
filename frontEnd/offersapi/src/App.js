import "./App.css";
import Sort from "./toBeSortedData/Sort";
import TargetUpdate from "./toBeSortedData/TargetUpdate";
function App() {
  return (
    <div className="App">
      <p>Update Specific offers targeted condition</p>
      <TargetUpdate />
      <p>Sort the offers by DRAGGING with respect to OFFER ID </p>
      <Sort />
    </div>
  );
}

export default App;

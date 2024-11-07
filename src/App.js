// import './App.css';
import ParentComponent from "./components/maps/ParentComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={
            <center> <h2> WELCOME !!! </h2> </center>}
          />
          <Route exact path="/maps" element={<ParentComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

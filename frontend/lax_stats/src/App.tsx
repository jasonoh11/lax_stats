import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Nav from "./Components/NavBar";
import HowItWorks from "./Components/HowItWorks";
import "./App.css"



function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

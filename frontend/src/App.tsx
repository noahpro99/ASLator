import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Hand from './pages/Hand';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Holistics from "./pages/Holistics";
function App() {
  return (
    <div >
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hand" element={<Hand />} />
                <Route path="/Holistics" element={<Holistics />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

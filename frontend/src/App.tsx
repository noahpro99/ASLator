import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ASLTranslator from './pages/ASLTranslator';
function App() {
  return (
    <div className='flex flex-col h-screen'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/asl_translator" element={<ASLTranslator />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

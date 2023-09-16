import React from 'react';
import ReactDOM from 'react-dom/client';
import './input.css';
import App from './App';
import './input.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hand from './pages/Hand';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/hand" element={<Hand />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

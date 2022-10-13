import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import crypto from 'crypto';

import LoginPage from './pages/loginPage/loginPage';
import MainPage from './pages/mainPage/mainPage';
import './App.css';


const App = () => {
  // const iv = crypto.randomBytes(16);
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/auth" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

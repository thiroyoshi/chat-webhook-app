import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatops from './pages/chatops';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chatops/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

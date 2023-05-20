import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { firebaseApp } from "./firebase";
import Root from "./pages/Root";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        {/* <Route path="/create" element={<Create />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

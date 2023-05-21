import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { firebaseApp } from "./utils/firebase";
import Root from "./pages/Root";
import { createRoom } from "./utils/createRoom";

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

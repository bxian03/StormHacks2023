import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home";
import Kanji from "./pages/Kanji";
import Hiragana from "./pages/Hiragana";
import Win from "./pages/Win";
import Lose from "./pages/Lose";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />,
      <Route path="/kanji/:roomId/:playerName" element={<Kanji />} />
      <Route path="/hiragana/:roomId/:playerName" element={<Hiragana />} />
      <Route path="/win" element={<Win />} />
      <Route path="/lose" element={<Lose />} />
    </>
  )
);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);

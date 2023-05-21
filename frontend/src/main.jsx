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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />,
      <Route
        path="/kanji/:roomId"
        element={<Kanji />}
        // loader={async ({ params }) => {
        //   return fetch(`${import.meta.env.VITE_API_URL}/questions/hiragana-romaji`);
        // }}
        // action={({ params }) => {}}
      />
    </>
  )
);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);

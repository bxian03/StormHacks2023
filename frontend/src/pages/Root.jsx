import React from "react";
import { useNavigate } from "react-router";

export default function Root() {
  const navigate = useNavigate();
  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <h1 className="text-5xl">Japanago</h1>
        <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={navigate("/create")}>
          new game
        </button>
        <button className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
          join game
        </button>
      </header>
    </div>
  );
}

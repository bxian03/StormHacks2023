import React, { useState } from "react";
import { firebaseApp } from "./firebase";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white"></header>
    </div>
  );
}

export default App;

import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useLoaderData } from "react-router";

export default function Kanji() {
  const questions = useLoaderData();
  let questionNum = 0;
  const [answer, setAnswer] = useState("");
  return (
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black selection:bg-green-900">
      <h1 className="text-5xl font-serif py-8">Test Your Kanji Knowledge</h1>
      {/* <img src={questions[questionNum].image} alt="kanji" /> */}
=======
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-center text-white selection:bg-green-900">
      <h1 className="text-5xl">Test Your Kanji Knowledge</h1>
      <img src={questions[questionNum].image} alt="kanji" />
>>>>>>> e2df71fa8e97566a33a4bb2ee867e24af5d7a9c0
      <TextField value={answer} onChange={(e) => setAnswer(e.target.value)} />
    </div>
  );
}

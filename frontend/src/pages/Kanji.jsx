import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useLoaderData } from "react-router";

export default function Kanji() {
  // const questions = useLoaderData();
  // let questionNum = 0;
  const [answer, setAnswer] = useState("");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black selection:bg-green-900">
      <h1 className="text-5xl font-serif py-8">Test Your Kanji Knowledge</h1>
      {/* <img src={questions[questionNum].image} alt="kanji" /> */}
      <TextField value={answer} onChange={(e) => setAnswer(e.target.value)} />
    </div>
  );
}

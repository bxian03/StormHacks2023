import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router";
import { Button } from "@mui/base";
import ConfettiExplosion from "react-confetti-explosion";

export default function Lose() {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black">
        <button
          className="align-center fixed left-0 top-0 my-6 h-10 bg-[#C8A2C8] px-10 font-serif outline outline-2"
          onClick={handleHomeClick}>
          Home
        </button>
        <div className="text-center font-serif text-8xl text-black">You Lose</div>
      </div>
    </>
  );
}

import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router";
import { Button } from "@mui/base";
import Confetti from "react-dom-confetti";

export default function Win() {
  const [isExploding, setIsExploding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsExploding(!isExploding);
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 100,
    elementCount: 150,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  return (
    <>
      <Confetti active={isExploding} config={config} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black">
        <button
          className="align-center fixed left-0 top-0 my-6 h-10 bg-[#C8A2C8] px-10 font-serif outline outline-2"
          onClick={handleHomeClick}>
          Home
        </button>
        <div className="text-center text-2xl text-black">You Win!</div>
      </div>
    </>
  );
}

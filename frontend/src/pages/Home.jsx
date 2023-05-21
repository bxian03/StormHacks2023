import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Player from "../utils/Player";
import { createRoom } from "../utils/createRoom";
import InputName from "../components/InputName";
import { Button } from "@mui/base";
import japangologo from "../../public/images/japangologo.png"
import WebFont from 'webfontloader';

import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState("kanji");
  const player = new Player(crypto.randomUUID(), gameType);

  const handleChange = (event) => {
    setGameType(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black selection:bg-green-900">
      <h1 className="text-6xl font-serif">Japango</h1>

      <div className="py-8">
      <img className="" style={{ width: 300, height: 300 }} src={japangologo} alt="Japango Logo"/>
      </div>

      <h2 className="text-4xl font-serif">Please Enter a name:</h2>
      <h2 className="text-2xl font-serif">お名前を入力してください：</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const room = await createRoom(player, gameType);
          navigate(`/kanji/${room.child("id").val()}`);
        }}>
        <FormControl>
          <RadioGroup row>
            <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
            <FormControlLabel value="grammar" control={<Radio />} label="Grammar" />
          </RadioGroup>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </FormControl>
      </form>
    </div>
  );
}
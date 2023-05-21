import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Player from "../utils/Player";
import { createRoom, joinRoom } from "../utils/createRoom";
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
  const [gameType, setGameType] = useState("hiragana");
  const player = new Player(crypto.randomUUID(), gameType);
  const [roomId, setRoomId] = useState("");

  const handleChange = (event) => {
    setGameType(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black">
      <h1 className="text-6xl font-serif">Japango</h1>

      <div className="py-8">
        <img className="" style={{ width: 300, height: 300 }} src={japangologo} alt="Japango Logo"/>
      </div>

      <div className="flex justify-center">
        <RadioGroup row
          onChange={handleChange}
        >
          <FormControlLabel value="hiragana" control={<Radio />} label="Hiragana" />
          <FormControlLabel value="katakana" control={<Radio />} label="Katakana" />
          <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
        </RadioGroup>
      </div>

      <h2 className="text-4xl pt-4 font-serif">Please Enter a name:</h2>
      <h2 className="text-2xl font-serif">お名前を入力してください：</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const roomId = await createRoom(player, gameType);
          navigate(`/${gameType}/${roomId}`);
        }}>
        <FormControl>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="py-4 color-black"
          />
        </FormControl>
      </form>
      <div className="pt-4" >Enter a 4-letter room code:</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await joinRoom(player, roomId);
          navigate(`/${gameType}/${roomId}`);
        }}>

        <div className="flex flex-col">
          <TextField
            inputProps={{ maxLength: 4 }}
            value={roomId}
            onChange={(e) => (roomId.length < 4 ? setRoomId(e.target.value) : null)}
            placeholder="Code" // TODO make sure this is 4 letters
          />
          <button type="submit" className="pt-2">Join Room</button>
        </div>

      </form>
    </div>
  );
}

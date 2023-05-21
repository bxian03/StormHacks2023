import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Player from "../utils/Player";
import { createRoom, joinRoom } from "../utils/createRoom";
import InputName from "../components/InputName";
import { Button } from "@mui/base";
import japangologo from "../../public/images/japangologo.png";
import WebFont from "webfontloader";

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
  const player = new Player(name);
  const [roomId, setRoomId] = useState("");

  const handleChange = (event) => {
    setGameType(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black selection:bg-green-900">
      <h1 className="font-serif text-6xl">Japango</h1>

      <div className="py-8">
        <img
          className=""
          style={{ width: 300, height: 300 }}
          src={japangologo}
          alt="Japango Logo"
        />
      </div>

      <h2 className="font-serif text-4xl">Please Enter a name:</h2>
      <h2 className="font-serif text-2xl">お名前を入力してください：</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const roomId = await createRoom(player, gameType);
          navigate(`/kanji/${roomId}`);
        }}>
        <FormControl>
          <div className="flex justify-center">
            <RadioGroup row>
              <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
              <FormControlLabel value="grammar" control={<Radio />} label="Grammar" />
            </RadioGroup>
          </div>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </FormControl>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await joinRoom(player, roomId);
          navigate(`/kanji/${roomId}`);
        }}>
        <div className="flex flex-col">
          <TextField
            inputProps={{ maxLength: 4 }}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter 4 letter code"
          />
          <button type="submit">Join Room</button>
        </div>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Player from "../utils/Player";
import { createRoom, joinRoom } from "../utils/createRoom";
import InputName from "../components/InputName";
import { Button } from "@mui/base";

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
  const [roomId, setRoomId] = useState("");

  const handleChange = (event) => {
    setGameType(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-center text-white selection:bg-green-900">
      <h1 className="text-5xl">Japanago</h1>
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
            value={roomId}
            onChange={(e) => (roomId.length < 4 ? setRoomId(e.target.value) : null)}
            placeholder="Enter 4 letter code" // TODO make sure this is 4 letters
          />
          <button type="submit">Join Room</button>
        </div>
      </form>
    </div>
  );
}

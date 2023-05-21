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
  InputAdornment,
  IconButton,
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState("hiragana");
  const player = new Player(name);
  const [roomId, setRoomId] = useState("");

  const handleChange = (event) => {
    setGameType(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] py-20 text-center text-black">
      <h1 className="font-serif text-6xl">Japango</h1>

      <div className="py-8">
        <img style={{ width: 300, height: 300 }} src={japangologo} alt="Japango Logo" />
      </div>

      <div className="flex justify-center">
        <RadioGroup defaultValue={"hiragana"} row onChange={handleChange}>
          <FormControlLabel value="hiragana" control={<Radio />} label="Hiragana" />
          <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
        </RadioGroup>
      </div>

      <h2 className="pt-6 font-serif text-4xl">Please Enter a name:</h2>
      <h2 className="pb-4 font-serif text-2xl">お名前を入力してください：</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const roomId = await createRoom(player, gameType);
          navigate(`/${gameType}/${roomId}/${player.name}`);
        }}>
        <FormControl>
          <TextField
            required
            id="required"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            InputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
            className="color-black py-4"
          />
        </FormControl>

        <div className="w-30 my-4 h-10 bg-[#C8A2C8] outline outline-2">
          <button type="submit" className="pt-2">
            Create Room
          </button>
        </div>
      </form>

      <div className="pt-6 font-serif">Enter a 4-letter room code:</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const room = await joinRoom(player, roomId);
          navigate(`/${gameType}/${roomId}/${player.name}`);
        }}>
        <div className="flex flex-col">
          <TextField
            required
            id="required"
            inputProps={{ maxLength: 4, style: { backgroundColor: "white" } }}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Code"
          />

          <div className="w-30 my-4 h-10 bg-[#C8A2C8] outline outline-2">
            <button type="submit" className="pt-2">
              Join Room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import { Snackbar, TextField, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router";
import { checkReady, getUsers } from "../utils/createRoom";
import { Button } from "@mui/base";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { gameLength } from "../utils/constants";
import CircleIcon from "@mui/icons-material/Circle";
import { set } from "firebase/database";
// mui icon button library for home button

export default function Kanji() {
  const roomId = useParams().roomId;
  const playerName = useParams().playerName;
  const navigate = useNavigate();

  const socket = useRef();
  useEffect(() => {
    socket.current = new WebSocket(
      `ws://${import.meta.env.VITE_API_DOMAIN}/ws/${roomId}/kanji-hiragana`
    );

    socket.current.onopen = () => {
      console.log("Connected to socket server");
    };

    socket.current.onclose = () => {
      socket.current.send(JSON.stringify({ action: "end" }));
      console.log("Disconnected");
    };

    console.log(opponentScore);

    socket.current.onmessage = (event) => {
      // console.log(event);
      const data = JSON.parse(event.data);
      console.log(event);
      switch (data.action) {
        case "start":
          setGlobalReady(true);
          setQuestion(data.question);
          break;
        case "win":
          setScore((prev) => prev + 1);
          reset();
          break;
        case "lose":
          setOppponentScore((prev) => prev + 1);
          reset();
          break;
        case "incorrect":
          setOpen(true);
          break;
        case "loseGame":
          navigate("/lose");
          break;
      }
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const [ready, setReady] = useState(false);
  const [opponentName, setOpponentName] = useState("Player Two");

  const [users, setUsers] = useState();
  useEffect(async () => {
    const users = await getUsers(roomId);
    const u = [];
    Object.values(users).forEach((user) => u.push(user.name));
    setUsers(u);
    setOpponentName(u.filter((user) => user !== playerName)[0]);
  }, [ready]);

  const [answer, setAnswer] = useState("");
  const [globalReady, setGlobalReady] = useState(false);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(0);
  const [opponentScore, setOppponentScore] = useState(0);
  const [open, setOpen] = useState(false);
  const [scoreIcon, setScoreIcon] = useState([
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
  ]);
  const [opponentScoreIcon, setOppponentScoreIcon] = useState([
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
    <RadioButtonUncheckedIcon key={crypto.randomUUID()} />,
  ]);

  useEffect(() => {
    if (score > 0) {
      setScoreIcon(() => {
        const sliced = scoreIcon.slice(1);
        sliced.push(<CircleIcon key={crypto.randomUUID()} />);
        return sliced;
      });
    }
  }, [score]);

  useEffect(() => {
    if (score === gameLength) {
      socket.current.send(JSON.stringify({ action: "winGame" }));
      navigate("/win");
    }
  }, [score]);

  useEffect(() => {
    console.log("opponentScore refresh");
    if (opponentScore > 0) {
      console.log("setting opponent score icon");
      setOppponentScoreIcon(() => {
        const sliced = opponentScoreIcon.slice(1);
        sliced.push(<CircleIcon key={crypto.randomUUID()} />);
        console.log(sliced.map((s) => s.type));
        return sliced;
      });
    }
  }, [opponentScore]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const handleReady = async () => {
    setReady(!ready);
    const message = {
      action: "ready",
    };
    socket.current.send(JSON.stringify(message));
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    const message = {
      action: "answer",
      answer: answer,
    };
    socket.current.send(JSON.stringify(message));
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  function reset() {
    setAnswer("");
    setReady(false);
    setGlobalReady(false);
  }

  console.log(users);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFACD] text-center text-black">
      <div className="fixed left-0 top-0 font-mono font-bold"> Room ID: {roomId}</div>
      <button
        className="align-center fixed left-0 top-0 my-6 h-10 bg-[#C8A2C8] px-10 font-serif outline outline-2"
        onClick={handleHomeClick}>
        Home
      </button>
      <div className="fixed left-0 top-20 my-6">
        {users !== undefined && (
          <div className="flex flex-col items-center gap-2 px-5 align-middle">
            <h1>{playerName}</h1> {scoreIcon}
            <div className="p-2" />
            <h1>{opponentName}</h1> {opponentScoreIcon}
          </div>
        )}
      </div>

      {globalReady ? (
        <>
          <h1 className="pb-8 text-9xl"> {question}</h1>
          <h1 className="pt-8 font-serif text-4xl">
            Please enter a reading for this kanji in hiragana:
          </h1>
          <h2 className="pb-4 font-serif text-2xl">この漢字の読みをひらがなで入力してください：</h2>

          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message={"Incorrect Submission"}
            action={action}
          />
          <form onSubmit={handleAnswer}>
            <TextField
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              inputProps={{ style: { backgroundColor: "white" } }}
              autoFocus
            />
          </form>
        </>
      ) : (
        <>
          <button
            className="align-center display-flex my-6 h-24 w-60 justify-center bg-[#90EE90] text-3xl outline outline-2"
            onClick={handleReady}>
            Ready 準備
          </button>
          <div>{ready ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />}</div>
        </>
      )}
    </div>
  );
}

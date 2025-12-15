import React, { useState, useRef } from "react";
import WelcomePage from "./components/WelcomePage";
import WaitingRoom from "./components/WaitingRoom";
import GameRoom from "./components/GameRoom.tsx";

export default function App() {
  const [phase, setPhase] = useState("welcome"); // welcome → waiting → game
  const [playerName, setPlayerName] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [dealtCards, setDealtCards] = useState(null);

  const wsRef = useRef(null);

  const BACKEND_WS_URL = "ws://localhost:9090/ws/paoyao";
//   const BACKEND_WS_URL = "wss://paoyao.zhaojunan.com/ws/paoyao";

  const joinGame = (name) => {
    setPlayerName(name);

    const ws = new WebSocket(BACKEND_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          name: name,
        })
      );
      setPhase("waiting");
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log("FROM SERVER:", data);

      switch (data.type) {
        case "joined":
          setPlayerId(data.payload.playerId);
          break;

        case "player_list":
          setPlayerList(data.payload);
          break;

        case "game_start":
          setPhase("game");
          break;

        case "deal_cards":
          setDealtCards(data.payload);
          break;

        default:
          console.warn("Unknown message:", data);
      }
    };

    ws.onerror = () => {
      alert("Failed to connect to server");
    };
  };

  if (phase === "welcome") {
    return <WelcomePage onJoin={joinGame} />;
  }

  if (phase === "waiting") {
    return (
      <WaitingRoom
        players={playerList}
        selfName={playerName}
      />
    );
  }

  if (phase === "game") {
    return (
        <GameRoom
          players={playerList}
          selfId={playerId}
          dealtCards={dealtCards}
        />
     );
  }

  return null;
}


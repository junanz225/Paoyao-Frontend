import WelcomePage from "./components/WelcomePage";
import WaitingRoom from "./components/WaitingRoom";
import GameRoom from "./components/GameRoom";
import {useRef, useState} from "react";
import {GameStatePayload} from "./models/Game";
import {sendMessage} from "./utilities/wsClient";

export default function App() {
  const [phase, setPhase] = useState("welcome"); // welcome → waiting → game
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerList, setPlayerList] = useState([]);
  const [hand, setHand] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameStatePayload | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const BACKEND_WS_URL = "ws://localhost:9090/ws/paoyao";
//   const BACKEND_WS_URL = "wss://paoyao.zhaojunan.com/ws/paoyao";

  const joinGame = (name: string) => {
    setPlayerName(name);

    const ws = new WebSocket(BACKEND_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      sendMessage(ws, "join", {
        name,
      });
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
          setHand(data.payload.cards);
          break;

        case "game_state":
          setGameState(data.payload);
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

  if (phase === "game" && gameState) {
    return (
        <GameRoom
            gameState={gameState}
            selfId={playerId!}
            hand={hand}
        />
    );
  }

  return null;
}


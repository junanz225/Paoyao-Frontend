import WelcomePage from "./components/WelcomePage";
import {useState} from "react";
import GameRoomPage from "./pages/GameRoomPage";

export default function App() {
  const [joined, setJoined] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);


  if (!joined) {
    return(
        <WelcomePage
            onJoin={(name: string) => {
              setPlayerName(name);
              setJoined(true)
            }}
        />
    );
  }

  return <GameRoomPage playerName={playerName!} />;
}


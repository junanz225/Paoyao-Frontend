import WaitingRoom from "../components/WaitingRoom";
import GameRoom from "../components/GameRoom";
import {useGameSocket} from "../hooks/useGameSocket";
import {GameStatePayload} from "../models/Game";
import {useState} from "react";
import { PlayerStateDTO } from "../models/Game";

export default function GameRoomPage() {
    const [phase, setPhase] = useState<"waiting" | "game">("waiting");
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerStateDTO[]>([]);
    const [hand, setHand] = useState<string[]>([]);
    const [gameState, setGameState] = useState<GameStatePayload | null>(null);

    const socket = useGameSocket({
        onJoined: setPlayerId,
        onPlayerList: setPlayers,
        onGameStart: () => setPhase("game"),
        onDealCards: setHand,
        onGameState: setGameState,
    });

    if (phase === "waiting") {
        return <WaitingRoom players={players} />;
    }

    if (phase === "game" && gameState && playerId) {
        return (
            <GameRoom
                gameState={gameState}
                selfId={playerId}
                hand={hand}
                onConfirmPlay={socket.playCards}
            />
        );
    }

    return null;
}
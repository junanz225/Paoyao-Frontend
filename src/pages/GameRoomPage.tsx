import WaitingRoom from "../components/WaitingRoom";
import GameRoom from "../components/GameRoom";
import {useGameSocket} from "../hooks/useGameSocket";
import {GameStatePayload} from "../models/Game";
import {useEffect, useRef, useState} from "react";
import { PlayerStateDTO } from "../models/Game";

export default function GameRoomPage({ playerName } : {playerName: string}) {
    const [phase, setPhase] = useState<"waiting" | "game">("waiting");
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerStateDTO[]>([]);
    const [hand, setHand] = useState<string[]>([]);
    const [gameState, setGameState] = useState<GameStatePayload | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [roundWinner, setRoundWinner] = useState<string | null>(null);
    const [teamScores, setTeamScores] = useState<Record<string, number>>({ "0": 0, "1": 0 });

    const socket = useGameSocket({
        onJoined: setPlayerId,
        onPlayerList: setPlayers,
        onGameStart: () => setPhase("game"),
        onDealCards: setHand,
        onGameState: setGameState,
        onHandUpdate: setHand,
        onError: setErrorMessage,
        onRoundEnd: (payload) => {
            setRoundWinner(payload.winnerName);
            setTeamScores(payload.teamScores);
        }
    });

    const hasConnectedRef = useRef(false)

    useEffect(() => {
        if (hasConnectedRef.current) return;

        socket.connect(playerName);
        hasConnectedRef.current = true;
    }, [socket, playerName]);

    useEffect(() => {
        if (!errorMessage) return;
        const timer = setTimeout(() => setErrorMessage(null), 2500);
        return () => clearTimeout(timer);
    }, [errorMessage]);

    useEffect(() => {
        if (!roundWinner) return;
        const timer = setTimeout(() => setRoundWinner(null), 2500);
        return () => clearTimeout(timer);
    }, [roundWinner]);


    if (phase === "waiting") {
        return <WaitingRoom players={players} />;
    }

    if (phase === "game" && gameState && playerId) {
        return (
            <>
                {errorMessage && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white
                                     px-6 py-3 rounded-lg shadow-lg z-[100] font-bold">
                        {errorMessage}
                    </div>
                )}
                {roundWinner && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white
                                     px-6 py-3 rounded-lg shadow-lg z-[100] font-bold">
                        {roundWinner} won the round!
                    </div>
                )}
                <GameRoom
                    gameState={gameState}
                    selfId={playerId}
                    hand={hand}
                    teamScores={teamScores}
                    onConfirmPlay={socket.playCards}
                    onPass={socket.pass}
                />
            </>
        );
    }

    return null;
}
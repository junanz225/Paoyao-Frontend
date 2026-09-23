import PlayerHand from "./PlayerHand";
import {GameStatePayload} from "../models/Game";
import {arrangeTable} from "../utilities/table";
import AnimatedCard from "./AnimatedCard";

interface GameRoomProps {
  gameState: GameStatePayload;
  selfId: string;
  hand: string[];
  teamScores: Record<string, number>;
  onConfirmPlay: (cards: string[]) => void;
  onPass: () => void;
  isGameOver: boolean;
}

export default function GameRoom({ gameState, selfId, hand, teamScores, onConfirmPlay, onPass, isGameOver }: GameRoomProps) {

  const tableState = gameState.tableState ?? {
    lastPlayedPlayerId: null,
    cards: [],
  };

  if (!gameState || !gameState.playerStates || gameState.playerStates.length === 0 || !selfId) {
    return <div>Waiting for game state...</div>;
  }

  const tablePositions = arrangeTable(gameState.playerStates, selfId);

  const isCurrentTurn = (playerId: string) =>
      gameState.currentTurnPlayerId === playerId;

  const getCardBacks = (playerId: string) => {
    const player = gameState.playerStates.find(p => p.playerId === playerId);
    return player ? Array(player.cardCount).fill("BACK") : [];
  };

  if (!tablePositions.bottom) {
    return <div>Loading table...</div>;
  }

  const teamAPlayers = gameState.playerStates.filter(p => p.team === 0).map(p => p.playerName);
  const teamBPlayers = gameState.playerStates.filter(p => p.team === 1).map(p => p.playerName);

  return (
    <div className="min-h-screen bg-green-300 p-2 flex items-center justify-center">
      <div className="relative w-screen h-screen bg-green-300">
        {/* Team scores: top left */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg z-50 font-bold">
            <div>Team {teamAPlayers.join(" ")}: {teamScores["0"] ?? 0}</div>
            <div>Team {teamBPlayers.join(" ")}: {teamScores["1"] ?? 0}</div>
        </div>

        {/* Table info: top right */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg z-50 font-bold">
            <div>
              Last played by:{" "}
              {tableState.cards.length === 0
                ? "—"
                : gameState.playerStates.find(
                    p => p.playerId === tableState.lastPlayedPlayerId
                  )?.playerName ?? "Unknown"}
            </div>
            <div>Points on table: {gameState.tablePoints}</div>
        </div>

        {/* Table (center) */}
        <div className="absolute top-1/2 left-1/2 w-[65vw] h-[35vw] bg-green-600 shadow-inner
                       -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-2xl font-bold">
          {tableState.cards.length === 0 ? (
              <div className="text-xl opacity-70">No cards on table</div>
          ) : (
                    <div className="flex gap-2">
                      {tableState.cards.map((card, idx) => (
                          <AnimatedCard
                              key={idx}
                              cardName={card}
                              direction="horizontal"
                          />
                      ))}
                    </div>
              )}
        </div>

        {/* Top */}
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 rounded-xl transition-all ${
            isCurrentTurn(tablePositions.top.playerId) ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <PlayerHand
            cards={getCardBacks(tablePositions.top.playerId)}
            direction="horizontal"
            playerName={tablePositions.top.playerName}
            position="top"
          />
        </div>

        {/* Bottom (SELF) */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl transition-all ${
            isCurrentTurn(tablePositions.bottom.playerId) ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <PlayerHand
            cards={hand}
            direction="horizontal"
            playerName={tablePositions.bottom.playerName}
            position="bottom"
            onConfirm={onConfirmPlay}
            onPass={onPass}
            isGameOver={isGameOver}
          />
        </div>

        {/* Left */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-xl transition-all ${
            isCurrentTurn(tablePositions.left.playerId) ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <PlayerHand
            cards={getCardBacks(tablePositions.left.playerId)}
            direction="vertical"
            playerName={tablePositions.left.playerName}
            position="left"
          />
        </div>

        {/* Right */}
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-xl transition-all ${
            isCurrentTurn(tablePositions.right.playerId) ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <PlayerHand
            cards={getCardBacks(tablePositions.right.playerId)}
            direction="vertical"
            playerName={tablePositions.right.playerName}
            position="right"
          />
        </div>

      </div>
    </div>
  );
}

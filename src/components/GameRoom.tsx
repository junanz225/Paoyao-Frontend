import PlayerHand from "./PlayerHand";
import {GameStatePayload} from "../models/Game";
import {arrangeTable} from "../utilities/table";
import AnimatedCard from "./AnimatedCard";

interface GameRoomProps {
  gameState: GameStatePayload;
  selfId: string;
  hand: string[];
  onConfirmPlay: (cards: string[]) => void;
}

export default function GameRoom({ gameState, selfId, hand, onConfirmPlay }: GameRoomProps) {

  const tableState = gameState.tableState ?? {
    lastPlayedPlayerId: null,
    cards: [],
  };

  if (!gameState || !gameState.playerStates || gameState.playerStates.length === 0 || !selfId) {
    return <div>Waiting for game state...</div>;
  }

  const tablePositions = arrangeTable(gameState.playerStates, selfId);

  const getCardBacks = (playerId: string) => {
    const player = gameState.playerStates.find(p => p.playerId === playerId);
    return player ? Array(player.cardCount).fill("BACK") : [];
  };

  if (!tablePositions.bottom) {
    return <div>Loading table...</div>;
  }

  return (
    <div className="min-h-screen bg-green-300 p-2 flex items-center justify-center">
      <div className="relative w-screen h-screen bg-green-300">

        {/* Table (center) */}
        <div className="absolute top-1/2 left-1/2 w-[65vw] h-[35vw] bg-green-600 shadow-inner
                       -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-2xl font-bold">
          {tableState.cards.length === 0 ? (
              <div className="text-xl opacity-70">No cards on table</div>
          ) : (
                  <>
                    {/* Last played player */}
                    <div className="mb-3 text-lg">
                      Last played by:{" "}
                      {
                          gameState.playerStates.find(
                              p => p.playerId === tableState.lastPlayedPlayerId
                          )?.playerName ?? "Unknown"
                      }
                    </div>

                    {/* Cards */}
                    <div className="flex gap-2">
                      {tableState.cards.map((card, idx) => (
                          <AnimatedCard
                              key={idx}
                              cardName={card}
                              direction="horizontal"
                          />
                      ))}
                    </div>
                  </>
              )}
        </div>

        {/* Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <PlayerHand
            cards={getCardBacks(tablePositions.top.playerId)}
            direction="horizontal"
            playerName={tablePositions.top.playerName}
            position="top"
          />
        </div>

        {/* Bottom (SELF) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <PlayerHand
            cards={hand}
            direction="horizontal"
            playerName={tablePositions.bottom.playerName}
            position="bottom"
            onConfirm={onConfirmPlay}
          />
        </div>

        {/* Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <PlayerHand
            cards={getCardBacks(tablePositions.left.playerId)}
            direction="vertical"
            playerName={tablePositions.left.playerName}
            position="left"
          />
        </div>

        {/* Right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
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

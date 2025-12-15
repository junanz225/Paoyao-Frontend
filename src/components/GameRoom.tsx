import React, { useEffect, useState } from 'react';
import PlayerHand from './PlayerHand.tsx';
import Player from '/types/Player.ts';
import { fullDeck } from '../utils/cardPool.ts';

interface GameRoomProps {
  players: Player[];
  selfId: string;
  dealtCards: {
      playerId: string; // player self id
      cards: string[];
  } | null;
}

function shuffle(array: string[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function arrangeTable(players: Player[], selfId: string) {
  if (!players || players.length === 0) return {};

  // find self index
  const selfIndex = players.findIndex((p) => p.playerId === selfId);

  if (selfIndex === -1) return {};

  // rotate array so self is always index 0
  const rotated = [
    players[selfIndex],
    players[(selfIndex + 1) % 4],
    players[(selfIndex + 2) % 4],
    players[(selfIndex + 3) % 4],
  ];

  return {
    bottom: rotated[0],
    right: rotated[1],
    top: rotated[2],
    left: rotated[3],
  };
}

export default function GameRoom({ players, selfId, dealtCards }: GameRoomProps) {
  const [cards, setCards] = useState({
    player1: [] as string[],
    player2: [] as string[],
    player3: [] as string[],
    player4: [] as string[],
  });

  const tablePositions = arrangeTable(players, selfId);

  useEffect(() => {
    if (!dealtCards) return;
    if (dealtCards.playerId !== selfId) return;

    setCards(prev => ({
      ...prev,
      player1: dealtCards.cards, // bottom player = you
    }));
  }, [dealtCards, selfId]);

//   useEffect(() => {
//     const shuffled = shuffle(fullDeck);
//     let index = 0;
//
//     const interval = setInterval(() => {
//       if (index >= 108) {
//         clearInterval(interval);
//         return;
//       }
//
//       const playerIndex = index % 4;
//       const card = shuffled[index];
//       const playerKey = `player${playerIndex + 1}` as keyof typeof cards;
//
//       // don't override real hand for yourself
//       if (playerKey === "player1") {
//           index++;
//           return;
//       }
//
//       setCards((prev) => ({
//         ...prev,
//         [playerKey]: [...prev[playerKey], card],
//       }));
//
//       index++;
//     }, 10);
//
//     return () => clearInterval(interval);
//   }, []);

  if (!tablePositions.bottom) {
    return <div>Loading table...</div>;
  }

  return (
    <div className="min-h-screen bg-green-300 p-2 flex items-center justify-center">
      <div className="relative w-screen h-screen bg-green-300">

        {/* Table (center) */}
        <div className="absolute top-1/2 left-1/2 w-[65vw] h-[35vw] bg-green-600 shadow-inner
                       -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-2xl font-bold">
          Table
        </div>

        {/* Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <PlayerHand
            cards={cards.player3}
            direction="horizontal"
            playerName={tablePositions.top.playerName}
            position="top"
          />
        </div>

        {/* Bottom (SELF) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <PlayerHand
            cards={cards.player1}
            direction="horizontal"
            playerName={tablePositions.bottom.playerName}
            position="bottom"
          />
        </div>

        {/* Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <PlayerHand
            cards={cards.player4}
            direction="vertical"
            playerName={tablePositions.left.playerName}
            position="left"
          />
        </div>

        {/* Right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <PlayerHand
            cards={cards.player2}
            direction="vertical"
            playerName={tablePositions.right.playerName}
            position="right"
          />
        </div>

      </div>
    </div>
  );
}

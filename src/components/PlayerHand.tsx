import { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import AnimatedCard from "./AnimatedCard";

interface PlayerHandProps {
  cards: string[];
  direction?: 'horizontal' | 'vertical';
  playerName: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export default function PlayerHand({
  cards,
  direction = 'horizontal',
  playerName,
  position,
}: PlayerHandProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [playedCards, setPlayedCards] = useState<string[]>([]);
  const [handCards, setHandCards] = useState<string[]>(cards);

  useEffect(() => {
      setHandCards(cards);
    }, [cards]);

  const isBottom = position === 'bottom';
  const isVertical = direction === 'vertical';
  const isSide = position === 'left' || position === 'right';

  const toggleCard = (idx: number) => {
    if (!isBottom) return;
    setSelectedIndexes(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleConfirm = () => {
      const selected = selectedIndexes.map(i => handCards[i]);

      const remaining = handCards.filter((_, i) => !selectedIndexes.includes(i));

      setPlayedCards(selected);
      setHandCards(remaining);
      setSelectedIndexes([]);
  };

  const renderName = () => {
    if (isSide) {
      return (
        <div className="text-black text-2xl font-bold text-center leading-tight whitespace-pre">
          {playerName.split('').join('\n')}
        </div>
      );
    }
    return (
      <div className="text-black text-2xl font-bold text-center whitespace-nowrap">
        {playerName}
      </div>
    );
  };

  const layoutClasses = {
    left: 'flex flex-row-reverse items-center gap-2',
    right: 'flex flex-row items-center gap-2',
    top: 'flex flex-col-reverse items-center gap-2',
    bottom: 'flex flex-col items-center gap-2',
  }[position];

  return (
      <>
        <div className={`${layoutClasses} relative`}>
          {renderName()}
          <div
            className="relative"
            style={{
              width: isVertical ? 100 : (cards.length - 1) * 20 + 100,
              height: isVertical ? (cards.length - 1) * 20 + 140 : 140,
            }}
          >
            {handCards.map((card, idx) => {
              const selected = selectedIndexes.includes(idx);
              const isLast = idx === handCards.length - 1;
              const isPartial = !isLast && !selected;
              const offset = idx * 20;

              return (
                <div
                  key={idx}
                  onClick={() => toggleCard(idx)}
                  style={{
                    position: 'absolute',
                    left: isVertical ? undefined : `${offset}px`,
                    top: isVertical ? `${offset}px` : selected ? '-20px' : '0px',
                    zIndex: idx,
                    overflow: 'visible',
                    height: '140px',
                    width: '100px',
                    transition: 'top 0.2s ease',
                  }}
                >
                  <AnimatedCard
                    cardName={card}
                    partial={isPartial}
                    direction={direction}
                    isSelected={selected}
                  />
                </div>
              );
            })}

            {selectedIndexes.length > 0 && (
              <button
                className="absolute -top-10 px-4 py-2 bg-blue-500 text-white rounded-lg shadow z-50"
                style={{ right: '-100px' }}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            )}
          </div>
        </div>

        {playedCards.length > 0 && (
          createPortal(
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-50">
                {playedCards.map((card, i) => (
                  <AnimatedCard
                    key={i}
                    cardName={card}
                    direction={direction}
                    isSelected
                  />
                ))}
              </div>,
              document.body
        ))}
      </>
  );
}
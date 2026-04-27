import { useState, useEffect } from 'react';
import AnimatedCard from "./AnimatedCard";
import { sortCards } from "../utilities/cardSort";

interface PlayerHandProps {
  cards: string[];
  direction?: 'horizontal' | 'vertical';
  playerName: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  onConfirm?: (cards: string[]) => void;
}

export default function PlayerHand({
  cards,
  direction = 'horizontal',
  playerName,
  position,
  onConfirm
}: PlayerHandProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [handCards, setHandCards] = useState<string[]>(cards);
  const [hasSorted, setHasSorted] = useState(false);

  useEffect(() => {
    setHandCards(cards);
    setHasSorted(false); // reset on new deal
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
    console.log("CONFIRM clicked, selected:", selected);
    onConfirm?.(selected);
    setSelectedIndexes([]);
  };

  const handleSort = () => {
    setHandCards(prev => sortCards(prev));
    setSelectedIndexes([]);
    setHasSorted(true);
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

          {/* One-time sort button — disappears after first use */}
          {isBottom && !hasSorted && (
            <button
              className="absolute px-4 py-2 bg-gray-600 text-white rounded-lg shadow z-50 whitespace-nowrap"
              style={{ top: '-45px', left: '-110px' }}
              onClick={handleSort}
            >
              Sort Cards
            </button>
          )}

          {/* Confirm button — appears when cards are selected */}
          {selectedIndexes.length > 0 && (
            <button
              className="absolute px-4 py-2 bg-blue-500 text-white rounded-lg shadow z-50"
              style={{ top: '-45px', right: '-110px' }}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          )}

        </div>
      </div>
    </>
  );
}
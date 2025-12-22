import { motion } from "framer-motion";

interface AnimatedCardProps {
  cardName: string;
  partial?: boolean;
  direction?: 'horizontal' | 'vertical';
  isSelected?: boolean;
}

export default function AnimatedCard({ cardName, partial = false, direction = 'horizontal', isSelected = false }: AnimatedCardProps) {
  const isVertical = direction === 'vertical';

  // Base card styles
  const cardStyle = {
    height: '140px',
    width: '100px',
    overflow: 'hidden',
  };

  // If selected, render full card normally
  const selectedStyle = isSelected
    ? {
        transform: isVertical ? 'translateY(-20px)' : 'translateY(-20px)',
        zIndex: 100,
      }
    : {};

  // Partial card styles for stacked cards
  const clipStyle = partial && !isSelected
    ? isVertical
      ? { height: '40px' } // vertical stacking, show top only
      : { width: '40px' } // horizontal stacking, show left only
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-md shadow-md"
      style={{ ...cardStyle, ...clipStyle, ...selectedStyle, position: 'relative' }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/cards/${cardName}.svg`}
        alt={cardName}
        onError={(e) => {
            console.warn(`Missing image for card: ${cardName}`);
            (e.target as HTMLImageElement).src = `${process.env.PUBLIC_URL}/cards/back.svg`; // fallback
          }}
        className={`h-full w-full object-cover ${direction === 'vertical' ? 'object-top' : 'object-left'}`}
      />
    </motion.div>
  );
}
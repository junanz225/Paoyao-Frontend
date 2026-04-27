const RANK_ORDER: Record<string, number> = {
  "4": 0, "5": 1, "6": 2, "7": 3, "8": 4,
  "9": 5, "10": 6, "jack": 7, "queen": 8, "king": 9,
  "ace": 10, "2": 11, "3": 12,
  "black_joker": 13, "red_joker": 14,
};

function getRank(cardName: string): number {
  if (cardName === "black_joker") return RANK_ORDER["black_joker"];
  if (cardName === "red_joker") return RANK_ORDER["red_joker"];

  // extracts "4" from "4_of_hearts", "jack" from "jack_of_spades"
  const rank = cardName.split("_of_")[0];
  return RANK_ORDER[rank] ?? -1;
}

export function sortCards(cards: string[]): string[] {
  return [...cards].sort((a, b) => getRank(a) - getRank(b));
}
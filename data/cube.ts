import cardsJson from "./cards.json";

export type Card = {
  id: string;
  name: string;
  manaCost: string;
  cmc: number;
  type: string;
  typeLine: string;
  oracleText: string;
  power: string | null;
  toughness: string | null;
  colors: string[];
  colorIdentity: string[];
  imageUrl: string;
  imageSmall: string;
};

export const cube: Card[] = cardsJson as Card[];

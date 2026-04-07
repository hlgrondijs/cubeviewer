import { cubelist } from "../data/cubelist";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCRYFALL_COLLECTION_URL = "https://api.scryfall.com/cards/collection";
const SCRYFALL_NAMED_URL = "https://api.scryfall.com/cards/named";
const BATCH_SIZE = 75;
const DELAY_MS = 100;

type ScryfallCard = {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity: string[];
  image_uris?: { normal: string; small: string };
  card_faces?: Array<{
    image_uris?: { normal: string; small: string };
  }>;
};

type CollectionResponse = {
  data: ScryfallCard[];
  not_found: Array<{ name: string }>;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBatch(names: string[]): Promise<CollectionResponse> {
  const identifiers = names.map((name) => ({ name }));
  const res = await fetch(SCRYFALL_COLLECTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CubeViewer/1.0",
    },
    body: JSON.stringify({ identifiers }),
  });

  if (!res.ok) {
    throw new Error(`Scryfall API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<CollectionResponse>;
}

function getImageUrl(card: ScryfallCard): string {
  if (card.image_uris) return card.image_uris.normal;
  if (card.card_faces?.[0]?.image_uris) return card.card_faces[0].image_uris.normal;
  return "";
}

function getSmallImageUrl(card: ScryfallCard): string {
  if (card.image_uris) return card.image_uris.small;
  if (card.card_faces?.[0]?.image_uris) return card.card_faces[0].image_uris.small;
  return "";
}

function extractType(typeLine: string): string {
  // "Legendary Creature — Human Soldier" → "Creature"
  const mainType = typeLine.split("—")[0].trim();
  const types = ["Creature", "Instant", "Sorcery", "Enchantment", "Planeswalker", "Artifact", "Land"];
  return types.find((t) => mainType.includes(t)) ?? mainType;
}

async function main() {
  console.log(`Fetching ${cubelist.length} cards from Scryfall...`);

  const allCards: ScryfallCard[] = [];
  const notFound: string[] = [];

  for (let i = 0; i < cubelist.length; i += BATCH_SIZE) {
    const batch = cubelist.slice(i, i + BATCH_SIZE);
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} cards`);

    const result = await fetchBatch(batch);
    allCards.push(...result.data);

    if (result.not_found.length > 0) {
      const missing = result.not_found.map((c) => c.name);
      notFound.push(...missing);
    }

    if (i + BATCH_SIZE < cubelist.length) {
      await sleep(DELAY_MS);
    }
  }

  // Retry not-found cards individually via /cards/named (handles split cards etc.)
  const stillNotFound: string[] = [];
  if (notFound.length > 0) {
    console.log(`\nRetrying ${notFound.length} cards via /cards/named...`);
    for (const name of notFound) {
      await sleep(DELAY_MS);
      const url = `${SCRYFALL_NAMED_URL}?exact=${encodeURIComponent(name)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "CubeViewer/1.0" },
      });
      if (res.ok) {
        const card = (await res.json()) as ScryfallCard;
        allCards.push(card);
        console.log(`  Found: ${card.name}`);
      } else {
        stillNotFound.push(name);
        console.warn(`  Not found: ${name}`);
      }
    }
  }

  if (stillNotFound.length > 0) {
    console.warn(`\nCards not found on Scryfall:`);
    stillNotFound.forEach((name) => console.warn(`  - ${name}`));
  }

  const cards = allCards.map((card) => ({
    id: card.id,
    name: card.name,
    manaCost: card.mana_cost ?? "",
    cmc: card.cmc,
    type: extractType(card.type_line),
    typeLine: card.type_line,
    oracleText: card.oracle_text ?? "",
    power: card.power ?? null,
    toughness: card.toughness ?? null,
    colors: card.colors ?? [],
    colorIdentity: card.color_identity,
    imageUrl: getImageUrl(card),
    imageSmall: getSmallImageUrl(card),
  }));

  const outPath = join(__dirname, "..", "data", "cards.json");
  writeFileSync(outPath, JSON.stringify(cards, null, 2));
  console.log(`\nWrote ${cards.length} cards to data/cards.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

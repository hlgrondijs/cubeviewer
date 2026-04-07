"use client";

import { useState, useMemo } from "react";
import { cube } from "@/data/cube";
import Sidebar from "./components/Sidebar";
import CardGrid from "./components/CardGrid";

const COLOR_ORDER: Record<string, number> = {
  W: 0, U: 1, B: 2, R: 3, G: 4, M: 5, C: 6,
};

function getColorCategory(colors: string[]): string {
  if (colors.length === 0) return "C";
  if (colors.length > 1) return "M";
  return colors[0];
}

function colorSortKey(colors: string[]): number {
  return COLOR_ORDER[getColorCategory(colors)] ?? 7;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [cmcDesc, setCmcDesc] = useState(false);

  const filtered = useMemo(() => {
    return cube
      .filter((card) => {
        if (search && !card.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (selectedColors.length > 0) {
          const category = getColorCategory(card.colors);
          if (!selectedColors.includes(category)) return false;
        }
        if (selectedTypes.length > 0 && !selectedTypes.includes(card.type)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const colorDiff = colorSortKey(a.colors) - colorSortKey(b.colors);
        if (colorDiff !== 0) return colorDiff;
        const cmcDiff = (a.cmc - b.cmc) * (cmcDesc ? -1 : 1);
        if (cmcDiff !== 0) return cmcDiff;
        return a.name.localeCompare(b.name);
      });
  }, [search, selectedColors, selectedTypes, cmcDesc]);

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of cube) {
      const cat = getColorCategory(card.colors);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, []);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of cube) {
      counts[card.type] = (counts[card.type] ?? 0) + 1;
    }
    return counts;
  }, []);

  function toggleColor(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <div className="flex flex-1">
      <Sidebar
        search={search}
        onSearchChange={setSearch}
        selectedColors={selectedColors}
        onColorToggle={toggleColor}
        selectedTypes={selectedTypes}
        onTypeToggle={toggleType}
        colorCounts={colorCounts}
        typeCounts={typeCounts}
        cardCount={filtered.length}
      />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Stijns Pauper Cube Viewer</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCmcDesc((v) => !v)}
              className="text-sm px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              CMC {cmcDesc ? "\u2193" : "\u2191"}
            </button>
          </div>
        </header>
        <CardGrid cards={filtered} />
      </main>
    </div>
  );
}

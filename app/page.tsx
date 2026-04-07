"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
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
  const [selectedCmcs, setSelectedCmcs] = useState<number[]>([]);
  const [cmcDesc, setCmcDesc] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [powerSort, setPowerSort] = useState<"asc" | "desc" | null>(null);
  const [toughnessSort, setToughnessSort] = useState<"asc" | "desc" | null>(null);

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
        if (selectedCmcs.length > 0 && !selectedCmcs.includes(card.cmc)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (powerSort) {
          const ap = a.power !== null ? Number(a.power) || 0 : -1;
          const bp = b.power !== null ? Number(b.power) || 0 : -1;
          const pd = (ap - bp) * (powerSort === "desc" ? -1 : 1);
          if (pd !== 0) return pd;
        }
        if (toughnessSort) {
          const at = a.toughness !== null ? Number(a.toughness) || 0 : -1;
          const bt = b.toughness !== null ? Number(b.toughness) || 0 : -1;
          const td = (at - bt) * (toughnessSort === "desc" ? -1 : 1);
          if (td !== 0) return td;
        }
        const cmcDiff = (a.cmc - b.cmc) * (cmcDesc ? -1 : 1);
        if (cmcDiff !== 0) return cmcDiff;
        const colorDiff = colorSortKey(a.colors) - colorSortKey(b.colors);
        if (colorDiff !== 0) return colorDiff;
        return a.name.localeCompare(b.name);
      });
  }, [search, selectedColors, selectedTypes, selectedCmcs, cmcDesc, powerSort, toughnessSort]);

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

  const cmcCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const card of cube) {
      counts[card.cmc] = (counts[card.cmc] ?? 0) + 1;
    }
    return counts;
  }, []);

  const cmcValues = useMemo(
    () => Object.keys(cmcCounts).map(Number).sort((a, b) => a - b),
    [cmcCounts],
  );

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

  function toggleCmc(cmc: number) {
    setSelectedCmcs((prev) =>
      prev.includes(cmc) ? prev.filter((c) => c !== cmc) : [...prev, cmc]
    );
  }

  return (
    <div className="flex flex-1 relative">
      {/* Mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-4/5 md:hidden">
          <Sidebar
            search={search}
            onSearchChange={setSearch}
            selectedColors={selectedColors}
            onColorToggle={toggleColor}
            selectedTypes={selectedTypes}
            onTypeToggle={toggleType}
            colorCounts={colorCounts}
            typeCounts={typeCounts}
            selectedCmcs={selectedCmcs}
            onCmcToggle={toggleCmc}
            cmcCounts={cmcCounts}
            cmcValues={cmcValues}
            cardCount={filtered.length}
            onCollapse={() => setSidebarOpen(false)}
          />
        </div>
      )}
      {/* Desktop sidebar */}
      {sidebarOpen && (
        <div className="hidden md:block">
          <Sidebar
            search={search}
            onSearchChange={setSearch}
            selectedColors={selectedColors}
            onColorToggle={toggleColor}
            selectedTypes={selectedTypes}
            onTypeToggle={toggleType}
            colorCounts={colorCounts}
            typeCounts={typeCounts}
            selectedCmcs={selectedCmcs}
            onCmcToggle={toggleCmc}
            cmcCounts={cmcCounts}
            cmcValues={cmcValues}
            cardCount={filtered.length}
            onCollapse={() => setSidebarOpen(false)}
          />
        </div>
      )}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src="/stoin.jpeg" alt="Logo" width={200} height={200} className="w-full h-full object-cover object-[30%_55%]" />
            </div>
            <h1 className="text-sm md:text-lg font-semibold">Stijns Pauper Cube</h1>
          </div>
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-sm px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Filter
              </button>
            )}
            <div className="relative">
            <button
              onClick={() => setSortMenuOpen((v) => !v)}
              className="text-sm px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Sort
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 flex flex-col gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-2 min-w-36">
                <button
                  onClick={() => { setCmcDesc((v) => !v); setSortMenuOpen(false); }}
                  className="text-left text-sm px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  CMC {cmcDesc ? "\u2193" : "\u2191"}
                </button>
                <button
                  onClick={() => { setPowerSort((v) => v === null ? "desc" : v === "desc" ? "asc" : null); setSortMenuOpen(false); }}
                  className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                    powerSort ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  Power {powerSort === "asc" ? "\u2191" : powerSort === "desc" ? "\u2193" : ""}
                </button>
                <button
                  onClick={() => { setToughnessSort((v) => v === null ? "desc" : v === "desc" ? "asc" : null); setSortMenuOpen(false); }}
                  className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                    toughnessSort ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  Toughness {toughnessSort === "asc" ? "\u2191" : toughnessSort === "desc" ? "\u2193" : ""}
                </button>
              </div>
            )}
            </div>
          </div>
        </header>
        <CardGrid cards={filtered} />
      </main>
    </div>
  );
}

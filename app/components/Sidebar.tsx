"use client";

const COLOR_MAP: Record<string, { label: string; bg: string }> = {
  W: { label: "White", bg: "bg-amber-100 text-amber-900" },
  U: { label: "Blue", bg: "bg-blue-200 text-blue-900" },
  B: { label: "Black", bg: "bg-zinc-700 text-zinc-100" },
  R: { label: "Red", bg: "bg-red-200 text-red-900" },
  G: { label: "Green", bg: "bg-green-200 text-green-900" },
  C: { label: "Colorless", bg: "bg-zinc-200 text-zinc-700" },
  M: { label: "Multicolor", bg: "bg-yellow-300 text-yellow-900" },
};

const TYPES = ["Creature", "Instant", "Sorcery", "Enchantment", "Planeswalker", "Artifact", "Land"];

type SidebarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  colorCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  selectedCmcs: number[];
  onCmcToggle: (cmc: number) => void;
  cmcCounts: Record<number, number>;
  cmcValues: number[];
  cardCount: number;
  onCollapse: () => void;
};

export default function Sidebar({
  search,
  onSearchChange,
  selectedColors,
  onColorToggle,
  selectedTypes,
  onTypeToggle,
  colorCounts,
  typeCounts,
  selectedCmcs,
  onCmcToggle,
  cmcCounts,
  cmcValues,
  cardCount,
  onCollapse,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 px-4 py-4 pb-16 md:pb-2 md:px-3 md:py-2 flex flex-col gap-5 md:gap-4 h-screen md:sticky md:top-0 overflow-y-auto bg-white dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <span className="text-sm md:text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Viewing {cardCount}/{Object.values(colorCounts).reduce((a, b) => a + b, 0)} cards
        </span>
        <button
          onClick={onCollapse}
          className="text-lg md:text-sm px-2 md:px-1.5 py-0.5 md:py-0 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer leading-tight"
          title="Hide filters"
        >
          {"\u00AB"}
        </button>
      </div>
      <div>
        <h2 className="text-sm md:text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5 md:mb-1">
          Search
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Card text..."
          className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 md:px-2 md:py-1 text-sm md:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h2 className="text-sm md:text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5 md:mb-1">
          Color
        </h2>
        <div className="flex flex-col gap-1 md:gap-0.5">
          {Object.entries(COLOR_MAP).map(([code, { label, bg }]) => {
            const checked = selectedColors.includes(code);
            return (
              <label
                key={code}
                className={`flex items-center gap-2 md:gap-1.5 px-3 py-1.5 md:px-2 md:py-0.5 rounded text-sm md:text-xs font-medium cursor-pointer ${bg}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onColorToggle(code)}
                  className="accent-current h-4 w-4 md:h-3 md:w-3"
                />
                {label} ({colorCounts[code] ?? 0})
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm md:text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5 md:mb-1">
          Type
        </h2>
        <div className="flex flex-col gap-1 md:gap-0.5">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`text-left px-3 py-1.5 md:px-2 md:py-0.5 rounded text-sm md:text-xs transition-colors cursor-pointer ${
                selectedTypes.includes(type)
                  ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {type} ({typeCounts[type] ?? 0})
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm md:text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5 md:mb-1">
          CMC
        </h2>
        <div className="flex flex-wrap gap-1.5 md:gap-1">
          {cmcValues.map((cmc) => {
            const active = selectedCmcs.includes(cmc);
            return (
              <button
                key={cmc}
                onClick={() => onCmcToggle(cmc)}
                className={`flex flex-col items-center min-w-9 md:min-w-7 px-2 md:px-1.5 py-1.5 md:py-1 rounded text-xs md:text-[10px] font-medium transition-colors cursor-pointer border ${
                  active
                    ? "bg-zinc-800 text-white border-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-200"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-500"
                }`}
              >
                <span className="text-sm md:text-xs font-semibold leading-tight">{cmc}</span>
                <span className={`text-[10px] md:text-[9px] leading-tight ${active ? "text-zinc-300 dark:text-zinc-500" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {cmcCounts[cmc] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

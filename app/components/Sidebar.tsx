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
  cardCount: number;
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
  cardCount,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-6">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Viewing {cardCount}/{Object.values(colorCounts).reduce((a, b) => a + b, 0)} cards
      </span>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
          Search
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Card name..."
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
          Color
        </h2>
        <div className="flex flex-col gap-1">
          {Object.entries(COLOR_MAP).map(([code, { label, bg }]) => {
            const checked = selectedColors.includes(code);
            return (
              <label
                key={code}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${bg}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onColorToggle(code)}
                  className="accent-current h-3.5 w-3.5"
                />
                {label} ({colorCounts[code] ?? 0})
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
          Type
        </h2>
        <div className="flex flex-col gap-1">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
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
    </aside>
  );
}

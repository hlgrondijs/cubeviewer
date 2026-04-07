"use client";

import Image from "next/image";
import type { Card } from "@/data/cube";

export default function CardTile({ card }: { card: Card }) {
  return (
    <div className="group relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {card.imageUrl ? (
        <Image
          src={card.imageUrl}
          alt={card.name}
          width={488}
          height={680}
          className="w-full h-auto"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      ) : (
        <div className="aspect-[488/680] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center p-2">
          <span className="text-sm text-center text-zinc-600 dark:text-zinc-400">
            {card.name}
          </span>
        </div>
      )}
    </div>
  );
}

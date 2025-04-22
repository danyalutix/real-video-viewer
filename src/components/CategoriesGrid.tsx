
import React from "react";
import { cn } from "@/lib/utils";

// Emoji/icon map for visual clarity
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Blonde": <span role="img" aria-label="blonde">🔞</span>,
  "MILF": <span role="img" aria-label="milf">🔞</span>,
  "Lesbian": <span role="img" aria-label="lesbian">👩‍❤️‍👩</span>,
  "Teen": <span role="img" aria-label="teen">🔞</span>,
  "Massage": <span role="img" aria-label="massage">🍑</span>,
  "Big Tits": <span role="img" aria-label="big tits">🔞</span>,
  "Anal": <span role="img" aria-label="anal">🍑</span>,
  "Amateur": <span role="img" aria-label="amateur">🎥</span>,
  "Asian": <span role="img" aria-label="asian">🌏</span>,
  "BBW": <span role="img" aria-label="bbw">❤️</span>,
  "Ebony": <span role="img" aria-label="ebony">🏆</span>,
  "POV": <span role="img" aria-label="POV">📷</span>,
  "Public": <span role="img" aria-label="public">🌆</span>,
  "Threesome": <span role="img" aria-label="threesome">👩‍❤️‍👩</span>,
  "Redhead": <span role="img" aria-label="redhead">🦰</span>,
};

interface CategoriesGridProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  // Only show unique categories
  const uniqueCats = Array.from(new Set(categories));
  return (
    <section className="mb-8">
      <div className="mb-2 font-semibold text-lg tracking-tight text-card-foreground">
        <span className="font-bold">Categories</span>
      </div>
      <div
        className={cn(
          "w-full grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2"
        )}
      >
        <button
          className={cn(
            "flex items-center gap-2 font-medium py-1.5 px-3 rounded-full border text-sm transition",
            selected === null
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-primary/10"
          )}
          onClick={() => onSelect(null)}
        >
          <span className="text-lg" role="img" aria-label="all">✨</span>
          All
        </button>
        {uniqueCats.map((cat) => (
          <button
            key={cat}
            className={cn(
              "flex items-center gap-2 font-medium py-1.5 px-3 rounded-full border text-sm transition whitespace-nowrap",
              selected === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-primary/10"
            )}
            onClick={() => onSelect(selected === cat ? null : cat)}
          >
            <span className="text-lg">
              {CATEGORY_ICONS[cat] || "🏷️"}
            </span>
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;


import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CategoryCard from "./CategoryCard";
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

interface CategoryAccordionProps {
  mainCategories: string[];
  subCategoryMap: Record<string, string[]>;
  expandedCount?: number; // default 5
  selected: string | null;
  onSelect: (cat: string | null) => void;
}
const DEFAULT_EXPANDED = 5;

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  mainCategories, // All possible main categories
  subCategoryMap, // { "Main": ["Sub1", "Sub2"] ... }
  expandedCount = DEFAULT_EXPANDED,
  selected,
  onSelect,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? mainCategories : mainCategories.slice(0, expandedCount);

  return (
    <section className="mb-8">
      <div className="mb-2 font-semibold text-lg tracking-tight text-card-foreground">
        <span className="font-bold">Categories</span>
      </div>
      <div className="w-full grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
        {/* "All" always first */}
        <CategoryCard
          label="All"
          icon={<span role="img" aria-label="all">✨</span>}
          selected={selected === null}
          onClick={() => onSelect(null)}
        />
        
        {/* Main categories displayed directly without accordion */}
        {displayed.map((main) => (
          <CategoryCard
            key={main}
            label={main}
            icon={CATEGORY_ICONS[main] || "🏷️"}
            selected={selected === main}
            onClick={() => selected === main ? onSelect(null) : onSelect(main)}
          />
        ))}
        
        {/* Show More/Less Button */}
        {!showAll && mainCategories.length > expandedCount && (
          <button
            type="button"
            className="px-3 py-1.5 rounded border bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
            onClick={() => setShowAll(true)}
          >
            Show More
          </button>
        )}
        {showAll && mainCategories.length > expandedCount && (
          <button
            type="button"
            className="px-3 py-1.5 rounded border bg-muted text-muted-foreground font-medium text-sm hover:bg-accent"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        )}
      </div>
      
      {/* If we have subcategories for the selected category, show them */}
      {selected && subCategoryMap[selected]?.length > 0 && (
        <div className="mt-3 pl-3 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
          {subCategoryMap[selected].map((sub) => (
            <CategoryCard
              key={sub}
              label={sub}
              icon={CATEGORY_ICONS[sub]}
              selected={false}
              onClick={() => onSelect(sub)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryAccordion;

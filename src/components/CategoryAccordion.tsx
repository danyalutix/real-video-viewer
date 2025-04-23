
import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CategoryCard from "./CategoryCard";
import { cn } from "@/lib/utils";

// Dummy icon map (reuse as needed or pass down)
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
      <div className={cn("w-full flex flex-wrap gap-2")}>
        {/* "All" always first */}
        <CategoryCard
          label="All"
          icon={<span role="img" aria-label="all">✨</span>}
          selected={selected === null}
          onClick={() => onSelect(null)}
        />
        {displayed.map((main) => (
          <Accordion type="single" collapsible key={main} className="w-auto">
            <AccordionItem value={main} className="border-none">
              <AccordionTrigger
                className={cn(
                  "p-0 bg-transparent data-[state=open]:bg-primary/10 rounded-full",
                  "flex items-center gap-2 whitespace-nowrap"
                )}
                onClick={() =>
                  selected === main ? onSelect(null) : onSelect(main)
                }
              >
                <CategoryCard
                  label={main}
                  icon={CATEGORY_ICONS[main] || "🏷️"}
                  selected={selected === main}
                  width={120}
                />
              </AccordionTrigger>
              <AccordionContent className="pl-6 pt-1 flex flex-wrap gap-2">
                {subCategoryMap[main]?.map((sub) => (
                  <CategoryCard
                    key={sub}
                    label={sub}
                    icon={CATEGORY_ICONS[sub]}
                    selected={selected === sub}
                    onClick={() => onSelect(sub)}
                    width={120}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        {/* Show More/Less Button */}
        {!showAll && mainCategories.length > expandedCount && (
          <button
            type="button"
            className="ml-2 px-3 py-1.5 rounded border bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
            onClick={() => setShowAll(true)}
          >
            Show More
          </button>
        )}
        {showAll && mainCategories.length > expandedCount && (
          <button
            type="button"
            className="ml-2 px-3 py-1.5 rounded border bg-muted text-muted-foreground font-medium text-sm hover:bg-accent"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryAccordion;

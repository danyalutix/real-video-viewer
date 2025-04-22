
import React from "react";

interface CategoriesBarProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const CategoriesBar: React.FC<CategoriesBarProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted mb-6">
      <div className="flex gap-2 min-w-max py-2">
        <button
          className={`whitespace-nowrap rounded-full border px-4 py-1 text-sm font-medium mr-2 transition ${
            selected === null
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-primary/10"
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`whitespace-nowrap rounded-full border px-4 py-1 text-sm font-medium mr-2 transition ${
              selected === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-primary/10"
            }`}
            onClick={() => onSelect(selected === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBar;

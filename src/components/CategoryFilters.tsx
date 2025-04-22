
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  categories: string[];
  category: string;
  setCategory: (val: string) => void;
}

const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
];

const SORT_OPTIONS = [
  { value: "views", label: "Most Viewed" },
  { value: "date", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const DURATION_OPTIONS = [
  { value: "", label: "Any Duration" },
  { value: "short", label: "Short (&lt; 5min)" },
  { value: "medium", label: "Medium (5-15min)" },
  { value: "long", label: "Long (&gt; 15min)" },
];

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  search, setSearch,
  sort, setSort,
  duration, setDuration,
  categories, category, setCategory,
}) => {
  return (
    <form
      className={cn(
        "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6"
      )}
      onSubmit={e => e.preventDefault()}
      autoComplete="off"
    >
      <div className="flex-1 min-w-[160px]">
        <Input
          placeholder="Search videos, tags, or models..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-card border"
          aria-label="Search videos"
        />
      </div>
      <div className="min-w-[150px]">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[150px]">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[150px]">
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default CategoryFilters;

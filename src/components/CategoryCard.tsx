
import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  width?: number | string;
}

const MAX_LENGTH = 13; // e.g., "Double Pen..." is 13 chars

const truncate = (text: string) =>
  text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH - 3) + "..." : text;

const CategoryCard: React.FC<CategoryCardProps> = ({
  label,
  icon,
  selected,
  onClick,
  className,
  width = 120,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 font-medium py-1.5 px-3 rounded-full border text-sm transition whitespace-nowrap overflow-hidden",
            selected
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-primary/10",
            className
          )}
          style={{ width, maxWidth: width, minWidth: width }}
          onClick={onClick}
        >
          {icon && <span className="text-lg">{icon}</span>}
          <span className="overflow-hidden text-ellipsis" title={label}>
            {truncate(label)}
          </span>
        </button>
      </TooltipTrigger>
      {label.length > MAX_LENGTH && (
        <TooltipContent>
          <span>{label}</span>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

export default CategoryCard;

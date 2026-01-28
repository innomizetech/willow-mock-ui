import React from "react";
import { Button } from "../Button";
import { HiX } from "react-icons/hi";
import { useFilters } from "./FilterProvider";
import Badge from "../Badge";

export interface FilterChipsProps {
  labels?: Record<string, string>;
  onRemove?: (key: string) => void;
}

function renderChip(
  key: string,
  value: unknown,
  labels: Record<string, string> | undefined,
  onRemove: (key: string) => void,
): React.ReactNode {
  const label = labels?.[key] || key;
  let displayValue: string;

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    displayValue =
      value.length === 1 ? String(value[0]) : `${value.length} selected`;
  } else if (value === null || value === undefined || value === "") {
    return null;
  } else {
    displayValue = String(value);
  }

  return (
    <Badge
      key={key}
      variant="success"
      className="flex items-center gap-1.5 px-3 py-1.5"
    >
      <span className="text-xs font-medium">
        {label}: {displayValue}
      </span>
      <button
        type="button"
        onClick={() => onRemove(key)}
        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <HiX className="h-3 w-3" />
      </button>
    </Badge>
  );
}

const FilterChips = ({ labels, onRemove }: FilterChipsProps) => {
  const { applied, setApplied } = useFilters();

  const handleRemove = (key: string) => {
    const newApplied = { ...applied };
    delete newApplied[key];
    setApplied(newApplied);
    onRemove?.(key);
  };

  const handleClearAll = () => {
    setApplied({});
  };

  const hasFilters = Object.keys(applied).length > 0;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {Object.entries(applied).map(([key, value]) =>
        renderChip(key, value, labels, handleRemove),
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearAll}
        className="text-xs"
      >
        Clear all
      </Button>
    </div>
  );
};

export { FilterChips };

import React, { createContext, useContext, useState, ReactNode } from "react";

export type FilterValues = Record<string, unknown> | undefined;

export interface FilterContextValue {
  applied: FilterValues;
  draft: FilterValues;
  setDraft: React.Dispatch<React.SetStateAction<FilterValues>>;
  setApplied: React.Dispatch<React.SetStateAction<FilterValues>>;
  apply: () => void;
  reset: () => void;
  clear: () => void;
}

export interface FilterProviderProps {
  initialFilters?: FilterValues;
  children: ReactNode;
}

const FilterContext = createContext<FilterContextValue | null>(null);

const FilterProvider = ({
  initialFilters = {},
  children,
}: FilterProviderProps) => {
  const [applied, setApplied] = useState<FilterValues>(initialFilters);
  const [draft, setDraft] = useState<FilterValues>(initialFilters);

  const apply = () => setApplied(draft);
  const reset = () => setDraft(initialFilters);
  const clear = () => {
    setDraft({});
    setApplied({});
  };

  return (
    <FilterContext.Provider
      value={{ applied, draft, setDraft, setApplied, apply, reset, clear }}
    >
      {children}
    </FilterContext.Provider>
  );
};

const useFilters = (): FilterContextValue => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

export { FilterProvider, useFilters };

import Badge from "../Badge";
import { Button } from "../Button";
import { useFilters, type FilterValues } from "./FilterProvider";
import { HiOutlineFilter } from "react-icons/hi";

export interface FilterButtonProps {
  onClick: () => void;
  label?: string;
}

function countFilters(applied: FilterValues): number {
  return Object.values(applied).reduce((count: number, value: unknown) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    if (value !== null && value !== undefined && value !== "") {
      return count + 1;
    }
    return count;
  }, 0);
}

const FilterButton = ({ onClick, label = "Filters" }: FilterButtonProps) => {
  const { applied } = useFilters();
  const count = countFilters(applied);

  return (
    <Button
      onClick={onClick}
      variant="outline"
      leftIcon={<HiOutlineFilter />}
      className={`!p-2 ${count > 0 ? "border-xtnd-blue" : ""}`}
    >
      {label}{" "}
      {count > 0 && (
        <Badge variant="primary" className="ml-2 !px-1 !py-0">
          <span className="text-xs">{count}</span>
        </Badge>
      )}
    </Button>
  );
};

export { FilterButton };

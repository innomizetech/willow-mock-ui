import { ReactNode } from "react";
import Drawer, { DrawerHeader, DrawerBody, DrawerFooter } from "../Drawer";
import { Button } from "../Button";
import { useFilters } from "./FilterProvider";

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const FilterDrawer = ({
  open,
  onClose,
  children,
  title = "Filters",
}: FilterDrawerProps) => {
  const { apply, reset } = useFilters();

  return (
    <Drawer open={open} onClose={onClose} position="right" width="w-96">
      <DrawerHeader>
        <h2 className="text-xl font-semibold text-xtnd-dark dark:text-xtnd-white">
          {title}
        </h2>
      </DrawerHeader>

      <DrawerBody>{children}</DrawerBody>

      <DrawerFooter>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
        <Button
          onClick={() => {
            apply();
            onClose();
          }}
        >
          Apply
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};

export { FilterDrawer };

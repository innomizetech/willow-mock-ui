import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

export function Breadcrumbs() {
  return (
    <nav
      className="flex items-center text-sm text-xtnd-dark-500 dark:text-xtnd-light"
      aria-label="Breadcrumb"
    >
      <Link to="/home" className="hover:text-xtnd-blue transition-colors">
        Home
      </Link>

      <HiChevronRight className="mx-2 h-4 w-4 text-xtnd-dark-300 dark:text-xtnd-light-500" />

      <span className="font-semibold text-xtnd-dark dark:text-xtnd-white">
        Prebill
      </span>
    </nav>
  );
}

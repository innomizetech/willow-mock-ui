import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../Button";
import { HiCollection } from "react-icons/hi";

/* =====================
   Types
===================== */

interface NavItem {
  path: string;
  label: string;
  can?: boolean;
  badge?: string | number;
}

interface NavSection {
  title?: string;
  can?: boolean;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
}

/* =====================
   Mock data
===================== */

const isDark = false; // mock theme flag

const currentUser = {
  name: "Hung Vu",
  email: "vubahungwork@gmail.com",
  picture: "",
  tenantId: "tenant_001",
  tenantAlias: "xtnd-dev",
  tenantName: "XTND Development",
};

/* =====================
   Sidebar
===================== */

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = React.useState(false);

  const appEnv = import.meta.env.VITE_APP_ENV || "dev";
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";

  const navSections: NavSection[] = [
    {
      title: "Prebill",
      items: [
        {
          path: "/prebill",
          label: "Prebilling Reports",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    console.log("Logout");
  };

  const renderNavSection = (section: NavSection, idx: number) => {
    if (section.can === false) return null;

    return (
      <div key={idx}>
        {!collapsed && section.title && (
          <div className="px-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-xtnd-dark-400 dark:text-xtnd-light rounded-lg">
              {section.title}
            </h3>
          </div>
        )}

        <div className="space-y-1">
          {section.items.map((item) => {
            if (item.can === false) return null;

            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <Link
                key={item.path}
                to={"/"}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-xtnd-blue text-white"
                      : "text-xtnd-dark-600 hover:bg-xtnd-light dark:text-xtnd-light dark:hover:bg-xtnd-dark-700"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
              >
                <HiCollection size={20} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all bg-[#eaf7f5] ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col items-center py-3">
          {!collapsed && (
            <div className="text-[10px] mt-1 text-xtnd-dark-400">
              v{appVersion}
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-6">
          {navSections.map(renderNavSection)}
        </nav>

        {/* User */}
        <div className="p-4">
          <Button
            size="sm"
            fullWidth
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {currentUser.name}
          </Button>

          {profileOpen && (
            <Button
              size="sm"
              variant="outline"
              fullWidth
              className="mt-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

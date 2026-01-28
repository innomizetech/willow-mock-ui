import React from "react";
import { HiMenu, HiBell, HiSun, HiMoon, HiCog } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

/* =====================
   Mock permissions / theme
===================== */

const can = {
  settings: true,
};

const isDark = false;

/* =====================
   Types
===================== */

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/* =====================
   Component
===================== */

export function TopBar({ onToggleSidebar, sidebarCollapsed }: TopBarProps) {
  const navigate = useNavigate();

  const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  return (
    <header
      className={`
        fixed top-0 right-0 z-50 h-16
        bg-xtnd-white/80 dark:bg-xtnd-dark/80 backdrop-blur-lg
        border-b border-xtnd-light dark:border-xtnd-dark-700
        transition-all duration-300
        ${sidebarCollapsed ? "left-20" : "left-72"}
      `}
    >
      <div className="h-full flex items-center justify-between px-6 bg-[#eaf7f5]">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="
              group p-2.5 rounded-xl
              bg-xtnd-light dark:bg-xtnd-dark-700
              hover:bg-xtnd-blue dark:hover:bg-xtnd-blue
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <HiMenu className="w-5 h-5 text-xtnd-dark dark:text-xtnd-white group-hover:text-white" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="
                p-2.5 rounded-xl
                bg-xtnd-light dark:bg-xtnd-dark-700
                hover:bg-xtnd-light-600 dark:hover:bg-xtnd-dark-600
                transition-all duration-200
              "
              aria-label="Notifications"
            >
              <HiBell className="w-5 h-5 text-xtnd-dark dark:text-xtnd-white" />
            </button>

            {notificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotificationOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-xtnd-white dark:bg-xtnd-dark rounded-xl shadow-xl border border-xtnd-light dark:border-xtnd-dark-700 z-20">
                  <div className="p-4">
                    <h3 className="text-sm font-bold mb-3">Notifications</h3>
                    <div className="text-sm text-xtnd-dark-400 dark:text-xtnd-light text-center py-8">
                      No new notifications
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          {can.settings && (
            <button
              onClick={() => null}
              className="
                p-2.5 rounded-xl
                bg-xtnd-light dark:bg-xtnd-dark-700
                hover:bg-xtnd-light-600 dark:hover:bg-xtnd-dark-600
                transition-all duration-200
              "
              aria-label="Settings"
            >
              <HiCog name="HiCog" size={20} />
            </button>
          )}

          {/* Theme */}
          <div className="relative">
            <button
              onClick={() => null}
              className="
                p-2.5 rounded-xl
                bg-xtnd-light dark:bg-xtnd-dark-700
                hover:bg-xtnd-light-600 dark:hover:bg-xtnd-dark-600
                transition-all duration-200
              "
              aria-label="Change theme"
            >
              {isDark ? (
                <HiMoon className="w-5 h-5" />
              ) : (
                <HiSun className="w-5 h-5" />
              )}
            </button>

            {themeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-xtnd-white dark:bg-xtnd-dark rounded-xl shadow-xl border border-xtnd-light dark:border-xtnd-dark-700 z-20">
                  <div className="p-2 text-sm">
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-xtnd-light dark:hover:bg-xtnd-dark-700">
                      Light
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-xtnd-light dark:hover:bg-xtnd-dark-700">
                      Dark
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-xtnd-light dark:hover:bg-xtnd-dark-700">
                      System
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

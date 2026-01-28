import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { Breadcrumbs } from "../Breadcrumbs";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    const stored = sessionStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  const location = useLocation();
  const isDetailPage = location.pathname.startsWith("/prebills/");

  React.useEffect(() => {
    sessionStorage.setItem(
      "sidebar-collapsed",
      JSON.stringify(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen flex bg-xtnd-light dark:bg-xtnd-dark-900">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{
          marginLeft: sidebarCollapsed ? "80px" : "288px", // ml-20 = 80px, ml-72 = 288px
          width: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 288px)",
        }}
      >
        <TopBar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main
          className="flex-1 w-full px-8 py-6 mt-16 overflow-x-hidden box-border"
          role="main"
          aria-label="Main content"
        >
          <div className="mb-6">{<Breadcrumbs />}</div>
          {!isDetailPage && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-xtnd-dark dark:text-xtnd-white">
                Prebill
              </h1>
              <p className="mt-1 text-sm text-xtnd-dark-500 dark:text-xtnd-light">
                Review and manage pre-bill items before final invoicing
              </p>
            </div>
          )}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

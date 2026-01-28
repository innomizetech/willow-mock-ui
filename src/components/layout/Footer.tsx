import React from "react";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";

  const handleLinkClick = (linkType: string) => {
    switch (linkType) {
      case "support":
        // Open user's default mail application with pre-filled support email
        window.location.href = "mailto:support@xtnd.legal";
        break;
      case "terms":
        // Open terms of service in new tab
        window.open("/terms-of-service", "_blank", "noopener,noreferrer");
        break;
      case "privacy":
        // Open privacy policy in new tab
        window.open("/privacy-policy", "_blank", "noopener,noreferrer");
        break;
      default:
      // console.log(`Link clicked: ${linkType}`); // Commented out console statement
    }
  };

  return (
    <footer
      className={`
        bg-background-light dark:bg-background-dark
        border-t border-xtnd-light dark:border-xtnd-dark-700
        shadow-xtnd
        ${className}
      `}
    >
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-6">
          {/* Left Side - Company Info */}
          <div className="flex flex-col gap-2">
            {/* Brand Row */}
            <div className="flex items-center gap-2 text-xtnd-dark dark:text-xtnd-white">
              <span className="font-semibold text-xtnd-blue">XTND</span>
              <span className="text-xtnd-dark-400 dark:text-xtnd-dark-300">
                •
              </span>
              <span className="font-medium">Platform</span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-xtnd-dark-500 dark:text-xtnd-light-100">
              © {currentYear} XTND Technologies, Inc. All rights reserved.
            </p>
          </div>

          {/* Right Side - Theme Controls */}
          <div className="flex items-center gap-4">
            {/* ThemeToggle temporarily removed */}
          </div>
        </div>

        {/* Bottom Section - Status and Links */}
        <div className="mt-6 pt-4 border-t border-xtnd-light dark:border-xtnd-dark-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Status and Version */}
            <div className="flex-col items-center gap-2 text-xs text-xtnd-dark-500 dark:text-xtnd-dark-400 dark:text-xtnd-light-100">
              <div className="flex items-center gap-1 dark:text-xtnd-light-100">
                <span>Platform Status:</span>
                <span className="inline-flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Operational
                  </span>
                </span>
              </div>
              <span>Version {appVersion}</span>
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-4 text-xs text-xtnd-dark-500 dark:text-xtnd-light-100">
              <button
                onClick={() => handleLinkClick("privacy")}
                className="hover:text-xtnd-blue dark:hover:text-xtnd-blue transition-colors"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => handleLinkClick("terms")}
                className="hover:text-xtnd-blue dark:hover:text-xtnd-blue transition-colors"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => handleLinkClick("support")}
                className="hover:text-xtnd-blue dark:hover:text-xtnd-blue transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { HiOutlineX } from "react-icons/hi";

export interface DrawerProps extends React.ComponentProps<"div"> {
  open: boolean;
  onClose: () => void;
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
  height?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "bottom" | "left" | "right" | "top";
  width?: string;
}

export interface DrawerHeaderProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export interface DrawerBodyProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export interface DrawerFooterProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

type DrawerA11yContextType = {
  headerId: string;
};

const DrawerA11yContext = React.createContext<DrawerA11yContextType | null>(
  null,
);

const Drawer = React.forwardRef<React.ElementRef<"div">, DrawerProps>(
  (
    {
      open,
      onClose,
      title,
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      ariaLabel,
      children,
      height = "md",
      className = "",
      position = "bottom",
      width = "",
      ...props
    },
    ref,
  ) => {
    const drawerRef = React.useRef<React.ElementRef<"div">>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
    const generatedHeaderId = React.useId();
    const headerId = generatedHeaderId;
    const [isVisible, setIsVisible] = React.useState(false);
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useImperativeHandle(ref, () => drawerRef.current!);

    // Handle mount/unmount and visibility for smooth animations
    React.useEffect(() => {
      if (open) {
        setShouldRender(true);
        // Small delay to ensure DOM is ready before animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      } else {
        setIsVisible(false);
        // Wait for animation to complete before unmounting
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, 300); // Match transition duration
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Handle escape key
    React.useEffect(() => {
      if (!closeOnEscape) return;

      const handleEscape = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape" && isVisible) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isVisible, onClose, closeOnEscape]);

    // Handle body scroll lock and focus management
    React.useEffect(() => {
      if (isVisible) {
        // Save previously focused element and lock scroll
        previouslyFocusedRef.current =
          document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        // Focus the drawer or first focusable element
        setTimeout(() => {
          if (!drawerRef.current) return;
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length > 0) {
            focusable[0]?.focus();
          } else {
            drawerRef.current.focus();
          }
        }, 100); // Small delay to allow animation to start
      } else {
        document.body.style.overflow = "unset";
        // Restore focus after animation
        const timer = setTimeout(() => {
          if (previouslyFocusedRef.current) {
            previouslyFocusedRef.current.focus();
          }
        }, 300);
        return () => clearTimeout(timer);
      }

      return () => {
        document.body.style.overflow = "unset";
        if (previouslyFocusedRef.current) {
          previouslyFocusedRef.current.focus();
        }
      };
    }, [isVisible]);

    // Handle backdrop click/key to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnBackdrop) return;
      if (e.target === e.currentTarget) onClose();
    };

    const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!closeOnBackdrop) return;
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target === e.currentTarget
      ) {
        e.preventDefault();
        onClose();
      }
    };

    // Focus trap within drawer (imperative to avoid a11y lint on non-interactive elements)
    React.useEffect(() => {
      if (!isVisible || !drawerRef.current) return;
      const element = drawerRef.current;
      const handler = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = element.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !active || !element.contains(active)) {
            e.preventDefault();
            (last as HTMLElement).focus();
          }
        } else if (active === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      };
      element.addEventListener("keydown", handler);
      return () => element.removeEventListener("keydown", handler);
    }, [isVisible]);

    if (!shouldRender) return null;

    const heightClasses = {
      sm: "max-h-[40vh]",
      md: "max-h-[60vh]",
      lg: "max-h-[80vh]",
      xl: "max-h-[90vh]",
      full: "max-h-[95vh]",
    };

    const baseDrawerClass = `bg-white shadow-xl transform transition-all duration-300 will-change-transform
    opacity-100 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-xtnd-dark-800 dark:text-xtnd-white
    dark:border-xtnd-dark-600 flex flex-col cursor-default`;

    const positionConfig = {
      bottom: `relative w-full min-h-[95vh] ${heightClasses[height]} border-t border-gray-200 rounded-t-lg translate-y-0`,
      top: `top-0 left-0 right-0 relative w-full ${heightClasses[height]} border-b border-gray-200 rounded-b-lg translate-y-100`,
      left: `fixed top-0 left-0 h-full ${width} border-r border-gray-200 rounded-r-lg translate-x-0`,
      right: `fixed top-0 right-0 h-full ${width} border-l border-gray-200 rounded-l-lg translate-x-0`,
    };

    const hiddenTransform = {
      top: "-translate-y-full opacity-0",
      bottom: "translate-y-full opacity-0",
      left: "-translate-x-full opacity-0",
      right: "translate-x-full opacity-0",
    };

    const drawerClass =
      `${baseDrawerClass} ${positionConfig[position] || positionConfig["bottom"]} ${isVisible ? "" : hiddenTransform[position]} ${className}`.trim();

    return (
      <div ref={overlayRef} className="fixed inset-0 z-50">
        <div
          className="flex h-full w-full items-end justify-center"
          role="button"
          aria-label="Close drawer by clicking backdrop"
          tabIndex={0}
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ease-in-out will-change-opacity ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Drawer */}
          <DrawerA11yContext.Provider value={{ headerId }}>
            <div
              ref={drawerRef}
              className={drawerClass}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel || title}
              aria-labelledby={ariaLabel || title ? undefined : headerId}
              tabIndex={-1}
              {...props}
            >
              {/* Drag handle indicator */}
              {position === "bottom" && (
                <div
                  className={`flex justify-center pt-2 pb-1 transition-opacity duration-300 ${
                    isVisible ? "opacity-100 delay-75" : "opacity-0"
                  }`}
                >
                  <div className="w-12 h-1 bg-gray-300 dark:bg-xtnd-dark-600 rounded-full" />
                </div>
              )}
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-xtnd-dark-600 flex-shrink-0">
                  {title && (
                    <h2 className="text-xl font-semibold text-xtnd-dark dark:text-xtnd-white">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:ring-offset-2 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-xtnd-dark-700"
                      onClick={onClose}
                      aria-label="Close drawer"
                    >
                      <HiOutlineX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {children}
            </div>
          </DrawerA11yContext.Provider>
        </div>
      </div>
    );
  },
);

const DrawerHeader = React.forwardRef<
  React.ElementRef<"div">,
  DrawerHeaderProps
>(({ className = "", children, ...props }, ref) => {
  const classes =
    `px-6 py-4 border-b border-gray-200 dark:border-xtnd-dark-600 flex-shrink-0 ${className}`.trim();
  const a11y = React.useContext(DrawerA11yContext);

  return (
    <div ref={ref} className={classes} id={a11y?.headerId} {...props}>
      {children}
    </div>
  );
});

const DrawerBody = React.forwardRef<React.ElementRef<"div">, DrawerBodyProps>(
  ({ className = "", children, ...props }, ref) => {
    const classes = `px-6 py-4 flex-1 overflow-y-auto ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const DrawerFooter = React.forwardRef<
  React.ElementRef<"div">,
  DrawerFooterProps
>(({ className = "", children, ...props }, ref) => {
  const classes =
    `px-6 py-4 border-t border-gray-200 dark:border-xtnd-dark-600 flex justify-end space-x-2 flex-shrink-0 ${className}`.trim();

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Drawer.displayName = "Drawer";
DrawerHeader.displayName = "DrawerHeader";
DrawerBody.displayName = "DrawerBody";
DrawerFooter.displayName = "DrawerFooter";

export default Drawer;
export { DrawerHeader, DrawerBody, DrawerFooter };

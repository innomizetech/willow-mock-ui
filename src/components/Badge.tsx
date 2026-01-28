import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "default", size = "md", className = "", ...props },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center font-medium rounded-full whitespace-nowrap";

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-2.5 py-1.5 text-sm",
      lg: "px-3 py-2 text-base",
    };

    const variantClasses = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      primary: "bg-xtnd-blue text-xtnd-white",
      secondary: "bg-xtnd-dark text-xtnd-white",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        ref={ref}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
export default Badge;

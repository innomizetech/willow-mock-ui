import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";

export interface ButtonProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "social";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<"button">, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...restProps
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-xtnd-dark disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-xtnd-blue text-xtnd-white hover:bg-xtnd-blue-700 focus:ring-xtnd-blue-500",
      secondary:
        "bg-xtnd-dark text-xtnd-white hover:bg-xtnd-dark-700 focus:ring-xtnd-dark-500",
      outline:
        "border border-xtnd-dark-300 bg-xtnd-white text-xtnd-dark hover:bg-xtnd-light focus:ring-xtnd-blue-500 dark:bg-xtnd-dark-800 dark:text-xtnd-white dark:border-xtnd-dark-600 dark:hover:bg-xtnd-dark-700",
      ghost:
        "text-xtnd-dark hover:bg-xtnd-light focus:ring-xtnd-dark-500 dark:text-xtnd-white dark:hover:bg-xtnd-dark-700",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      social:
        "border-2 border-gray-200 bg-white text-xtnd-dark hover:border-xtnd-blue hover:bg-xtnd-light/20 focus:ring-xtnd-blue-500 dark:bg-xtnd-dark-800 dark:border-gray-600 dark:text-xtnd-white dark:hover:border-xtnd-blue dark:hover:bg-xtnd-dark-700 dark:hover:text-xtnd-white transition-all duration-200",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes =
      `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...restProps}
      >
        {loading && <HiOutlineSparkles className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export default Button;

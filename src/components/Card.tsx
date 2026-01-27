import React from "react";

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "outlined" | "elevated" | "filled";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

const Card = React.forwardRef<React.ElementRef<"div">, CardProps>(
  (
    { variant = "default", padding = "md", className = "", children, ...props },
    ref,
  ) => {
    const baseClasses = "rounded-lg transition-shadow";

    const variantClasses = {
      default:
        "bg-xtnd-white dark:bg-xtnd-dark-800 border border-xtnd-light dark:border-xtnd-dark-700 shadow-xtnd-md",
      outlined:
        "bg-xtnd-white dark:bg-xtnd-dark-800 border border-xtnd-dark-300 dark:border-xtnd-dark-600 shadow-xtnd-md",
      elevated:
        "bg-xtnd-white dark:bg-xtnd-dark-800 shadow-xtnd-lg border border-xtnd-light dark:border-xtnd-dark-700",
      filled:
        "bg-xtnd-light dark:bg-xtnd-dark-700 border border-xtnd-light dark:border-xtnd-dark-600 shadow-xtnd-md",
    };

    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    const classes =
      `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const CardHeader = React.forwardRef<React.ElementRef<"div">, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    const classes =
      `border-b border-xtnd-light dark:border-xtnd-dark-700 pb-4 mb-4 ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const CardBody = React.forwardRef<React.ElementRef<"div">, CardBodyProps>(
  ({ className = "", children, ...props }, ref) => {
    const classes = `flex-1 ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const CardFooter = React.forwardRef<React.ElementRef<"div">, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    const classes = `border-t border-xtnd-light pt-4 mt-4 ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
export default Card;

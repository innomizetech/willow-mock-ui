import React from "react";

export interface CheckboxProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "size"
> {
  /**
   * Label text for the checkbox
   */
  label?: string;
  /**
   * Additional description text below the label
   */
  description?: string;
  /**
   * Size variant
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Whether the checkbox is required
   */
  required?: boolean;
  /**
   * Custom class name for the container
   */
  containerClassName?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const labelSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const descriptionSizeClasses = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * Checkbox component with label, description, and error states
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox label="Accept terms" />
 *
 * // With description
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   description="Get weekly updates about new features"
 * />
 *
 * // With error state
 * <Checkbox
 *   label="I agree"
 *   error
 *   errorMessage="You must agree to continue"
 * />
 *
 * // Required field
 * <Checkbox label="Required field" required />
 *
 * // Different sizes
 * <Checkbox label="Small" size="sm" />
 * <Checkbox label="Medium" size="md" />
 * <Checkbox label="Large" size="lg" />
 *
 * // Controlled
 * <Checkbox
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 *   label="Controlled checkbox"
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = "md",
      error = false,
      errorMessage,
      required = false,
      disabled = false,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    const checkboxClasses = `
      ${sizeClasses[size]}
      text-xtnd-blue
      border-gray-300 dark:border-gray-600
      rounded
      focus:ring-2 focus:ring-xtnd-blue focus:ring-offset-0
      cursor-pointer
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? "border-red-500 dark:border-red-500 focus:ring-red-500" : ""}
      ${className}
    `;

    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={checkboxClasses}
        {...props}
      />
    );

    // If no label, return just the checkbox
    if (!label && !description) {
      return checkbox;
    }

    // Return checkbox with label and description
    return (
      <div className={containerClassName}>
        <label
          className={`flex items-start space-x-3 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center pt-0.5">{checkbox}</div>
          <div className="flex-1">
            {label && (
              <div
                className={`font-medium text-gray-700 dark:text-gray-300 ${labelSizeClasses[size]}`}
              >
                {label}
                {required && (
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                )}
              </div>
            )}
            {description && (
              <p
                className={`text-gray-500 dark:text-gray-400 mt-0.5 ${descriptionSizeClasses[size]}`}
              >
                {description}
              </p>
            )}
          </div>
        </label>
        {error && errorMessage && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-6">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

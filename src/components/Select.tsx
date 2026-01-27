import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import ReactSelect, {
  MultiValue,
  SingleValue,
  StylesConfig,
  OptionsOrGroups,
  GroupBase,
  ClassNamesConfig,
  InputActionMeta,
} from "react-select";

// Type assertion to fix TypeScript JSX component type issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactSelectComponent = ReactSelect as unknown as React.ComponentType<any>;

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  bgColor?: string;
}

// Base props without onChange to allow overloads
export interface SelectPropsBase<Option extends SelectOption = SelectOption> {
  // Core props
  options: OptionsOrGroups<Option, GroupBase<Option>>;
  value?: Option | Option[] | string | null;

  // Display props
  placeholder?: string;
  isLoading?: boolean;
  darkStyle?: StylesConfig<Option, boolean> | undefined;
  lightStyle?: StylesConfig<Option, boolean> | undefined;
  noOptionsMessage?: () => string;
  showOptionBullets?: boolean;

  // Layout props
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  menuPosition?: "absolute" | "fixed";
  menuPortalTarget?: HTMLElement | null;
  menuShouldScrollIntoView?: boolean;

  // Styling props
  className?: string;
  classNamePrefix?: string;
  size?: "sm" | "md" | "lg";

  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  isDarkMode?: boolean;
  onInputChange?: (inputValue: string, actionMeta: InputActionMeta) => void;
}

// Single select props (multiple is false or undefined)
export interface SelectPropsSingle<
  Option extends SelectOption = SelectOption,
> extends SelectPropsBase<Option> {
  multiple?: false;
  onChange: (newValue: SingleValue<Option> | null) => void;
}

// Multi select props (multiple is true)
export interface SelectPropsMulti<
  Option extends SelectOption = SelectOption,
> extends SelectPropsBase<Option> {
  multiple: true;
  onChange: (newValue: MultiValue<Option> | null) => void;
}

// Union type for SelectProps
export type SelectProps<Option extends SelectOption = SelectOption> =
  | SelectPropsSingle<Option>
  | SelectPropsMulti<Option>;

const getTheme = (
  hasError: boolean,
): ClassNamesConfig<SelectOption, boolean, GroupBase<SelectOption>> => ({
  control: (state) => `
    bg-xtnd-white text-xtnd-dark-900 rounded-xtnd border
    dark:bg-xtnd-dark-700 dark:text-xtnd-white
    ${
      hasError
        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-xtnd-light dark:border-xtnd-dark-600 hover:border-xtnd-blue dark:hover:border-xtnd-blue"
    }
    ${state.isFocused && !hasError ? "border-xtnd-blue" : ""}
    ${
      state.isDisabled
        ? `bg-xtnd-light-100 cursor-not-allowed opacity-50
                          dark:bg-xtnd-dark-800`
        : ""
    }
  `,

  valueContainer: () => "flex flex-wrap gap-1 px-2 py-1 flex-1 min-w-0",

  menu: () => `
    mt-1 rounded-xtnd border border-xtnd-light bg-white shadow-lg z-[99999]
    dark:border-xtnd-dark-600 dark:text-xtnd-white dark:bg-xtnd-dark-700
    [&[data-placement="top"]]:mb-1 [&[data-placement="top"]]:mt-0
  `,

  menuList: () => "py-1 max-h-[200px] overflow-y-auto",

  option: (state) => {
    const option = state.data as SelectOption;
    const hasColor = !!option?.color;

    // If option has a custom color, handle it via inline styles
    if (hasColor) {
      return "px-3 py-2 cursor-pointer text-sm transition-colors";
    }

    // Default theme colors
    return `px-3 py-2 cursor-pointer text-sm transition-colors
      ${
        state.isSelected
          ? `bg-xtnd-blue text-xtnd-dark-900 font-medium`
          : state.isFocused
            ? `bg-xtnd-light text-xtnd-dark-900
               dark:bg-xtnd-dark-600 dark:text-xtnd-white`
            : `text-xtnd-dark-900
               dark:text-xtnd-white`
      }
    `;
  },

  placeholder: () => `text-sm text-xtnd-dark-400
                      dark:text-xtnd-dark-300`,

  singleValue: (state) => {
    const option = state.data as SelectOption;
    if (option?.color) {
      return `break-words overflow-hidden text-[${option.color}]`;
    }
    return "break-words overflow-hidden";
  },

  input: () => `text-xtnd-dark-900 flex-1 min-w-0
                dark:text-xtnd-white`,

  multiValue: (state) => {
    const option = state.data as SelectOption;
    const hasColor = !!option?.color;

    if (hasColor) {
      // Logic for custom-colored tags
      return "text-sm flex rounded-sm font-medium max-w-full overflow-hidden";
    }

    // This is the parent container. It gets the main background color.
    return `text-sm flex font-medium max-w-full bg-xtnd-blue rounded-sm overflow-hidden
            dark:bg-xtnd-blue-900`;
  },
  multiValueLabel: () => {
    return "px-2 py-0.5 break-words overflow-hidden";
  },
  multiValueRemove: () =>
    `px-1 flex items-center text-xtnd-dark-50 hover:bg-xtnd-blue-900`,

  // === Right-Side Icons (Dropdown Arrow, Clear Button) ===
  indicatorsContainer: (state) => `
    flex gap-1
    ${
      state.isDisabled
        ? `text-xtnd-dark-300
           dark:text-xtnd-dark-500`
        : `text-xtnd-dark-600
           dark:text-xtnd-dark-300`
    }
  `,
  clearIndicator: () =>
    `p-2 cursor-pointer text-xtnd-dark-600 hover:text-xtnd-blue
     dark:text-xtnd-dark-300 dark:hover:text-xtnd-blue`,
  dropdownIndicator: () =>
    `p-2 cursor-pointer text-xtnd-dark-600 hover:text-xtnd-blue
     dark:text-xtnd-dark-300 dark:hover:text-xtnd-blue`,
  loadingIndicator: () => "text-xtnd-blue",
  indicatorSeparator: () => `self-stretch w-px bg-xtnd-light
                             dark:bg-xtnd-dark-400 my-2`,
});

// Export default theme for backward compatibility
export const theme = getTheme(false);

// Styling for select menu options with color properties.
// This is a function that takes isDarkMode as a parameter to access it in the styles
const getColorOptionStyles = (
  isDarkMode: boolean,
): StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> => ({
  menu: (base, state) => {
    const styles = {
      ...base,
      zIndex: 99999,
    };

    // Ensure menu can flip when using auto placement
    // This helps with positioning when there's not enough space below
    if (state.placement === "top") {
      // When menu is placed above, ensure proper margin
      styles.marginBottom = "4px";
      styles.marginTop = "0";
    }

    return styles;
  },
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
  option: (_base, { data, isFocused, isSelected }) => {
    const hasColor = !!data.color;
    if (!hasColor) return {};

    return {
      backgroundColor: isSelected
        ? isDarkMode
          ? data?.bgColor || data?.color
          : data?.color
        : isFocused
          ? `${data.color}20` // 20% opacity on hover
          : "transparent",
      color: isSelected ? "#ffffff" : data.color, // White text when selected
    };
  },
  singleValue: (base, { data }) => {
    if (data?.color) {
      return {
        ...base,
        color: data.color,
      };
    }
    return base;
  },
  multiValue: (_base, { data }) => {
    const hasColor = !!data.color;
    if (!hasColor) return {};

    return {
      color: "#ffffff",
      backgroundColor: `${isDarkMode ? data?.bgColor || data?.color : data?.color}`,
    };
  },
  multiValueRemove: () => {
    return {
      ":hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    };
  },
});

function SelectComponent<Option extends SelectOption = SelectOption>(
  props: SelectProps<Option> & { ref?: React.Ref<React.ElementRef<"div">> },
  ref: React.Ref<React.ElementRef<"div">>,
) {
  const {
    options,
    value,
    onChange,
    placeholder = "Select an option",
    isLoading = false,
    noOptionsMessage = () => "No options found",
    showOptionBullets = false,
    closeMenuOnSelect = true,
    hideSelectedOptions = false,
    menuPlacement = "auto",
    menuPosition = "fixed",
    menuPortalTarget = typeof document !== "undefined" ? document.body : null,
    menuShouldScrollIntoView = true,
    className = "",
    classNamePrefix = "react-select",
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    multiple = false,
    searchable = false,
    clearable = false,
    fullWidth = false,
    size = "md",
    onInputChange,
    isDarkMode = false,
  } = props;
  const labelId = React.useId();
  const helperId = helperText ? `${labelId}-helper` : undefined;
  const errorId = error ? `${labelId}-error` : undefined;

  // Build CSS classes
  const selectClasses = [
    "xtnd-select",
    `xtnd-select--${size}`,
    fullWidth ? "xtnd-select--full-width" : "",
    error ? "xtnd-select--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Convert string value to Option for react-select
  const getSelectValue = () => {
    if (typeof value === "string") {
      // Find the option that matches the string value
      const findOption = (
        opts: OptionsOrGroups<Option, GroupBase<Option>>,
      ): Option | null => {
        for (const option of opts) {
          if ("options" in option) {
            // It's a group
            const found = findOption(option.options);
            if (found) return found;
          } else if (option.value === value) {
            // It's an Option
            return option;
          }
        }
        return null;
      };
      return findOption(options);
    }
    return value;
  };

  // Handle onChange - TypeScript will infer correct type based on multiple prop
  // Using type assertion because TypeScript can't narrow union type from props
  const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
    if (multiple) {
      // When multiple={true}, newValue is MultiValue<Option> | null
      (onChange as (newValue: MultiValue<Option> | null) => void)(
        newValue as MultiValue<Option> | null,
      );
    } else {
      // When multiple={false}, extract value string if option object is passed
      const singleValue = newValue as SingleValue<Option> | null;
      if (
        singleValue &&
        typeof singleValue === "object" &&
        "value" in singleValue
      ) {
        // If value is expected to be a string but we got an option object, extract the value
        if (typeof value === "string") {
          (onChange as (newValue: string | null) => void)(singleValue.value);
        } else {
          (onChange as (newValue: SingleValue<Option> | null) => void)(
            singleValue,
          );
        }
      } else {
        (onChange as (newValue: SingleValue<Option> | null) => void)(
          singleValue,
        );
      }
    }
  };

  return (
    <div className={fullWidth ? "w-full" : ""} ref={ref}>
      {label && (
        <label
          id={labelId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={selectClasses}>
        <ReactSelectComponent
          options={options}
          value={getSelectValue()}
          onChange={handleChange}
          onInputChange={onInputChange}
          placeholder={placeholder}
          unstyled
          formatOptionLabel={(
            option: Option,
            meta: { context: "menu" | "value" },
          ) => {
            if (meta.context === "menu") {
              if (showOptionBullets) {
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "currentColor" }}
                    />
                    <span>{option?.label}</span>
                  </div>
                );
              }
              return <span>{option?.label}</span>;
            }
            return <span>{option?.label}</span>;
          }}
          isMulti={multiple}
          isClearable={clearable}
          isSearchable={searchable}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          isDisabled={disabled}
          noOptionsMessage={noOptionsMessage}
          closeMenuOnSelect={closeMenuOnSelect}
          hideSelectedOptions={hideSelectedOptions}
          menuPlacement={menuPlacement}
          menuPosition={menuPosition}
          menuPortalTarget={menuPortalTarget}
          menuShouldScrollIntoView={menuShouldScrollIntoView}
          classNames={
            getTheme(!!error) as unknown as ClassNamesConfig<
              Option,
              boolean,
              GroupBase<Option>
            >
          }
          styles={
            getColorOptionStyles(isDarkMode) as unknown as StylesConfig<
              Option,
              boolean,
              GroupBase<Option>
            >
          }
          classNamePrefix={classNamePrefix}
        />
      </div>

      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <div className="flex items-center">
              <HiOutlineExclamationCircle
                className="h-4 w-4 text-red-500 mr-1"
                aria-hidden="true"
              />
              <span
                id={errorId}
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </span>
            </div>
          ) : (
            <span
              id={helperId}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const SelectForwardRef = React.forwardRef(SelectComponent) as <
  Option extends SelectOption = SelectOption,
>(
  props: SelectProps<Option> & { ref?: React.Ref<React.ElementRef<"div">> },
) => React.ReactElement;

// Create a wrapper to add displayName for generic component
const Select = Object.assign(SelectForwardRef, {
  displayName: "Select",
}) as typeof SelectForwardRef & { displayName: string };

export default Select;

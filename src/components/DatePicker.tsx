import { useState, useEffect, useMemo, useRef } from "react";
import {
  DateRange,
  DayPicker,
  PropsRange,
  PropsSingle,
} from "react-day-picker";
import { HiCalendarDays } from "react-icons/hi2";
import defaultClassNames from "react-day-picker/dist/style.module.css";
import { Button } from "./Button";
import {
  formatDate,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
  subtractDays,
  subtractWeeks,
} from "../utils/date";

// ============================================================================
// Type Definitions
// ============================================================================

type SingleValue = Date | null;
type RangeValue = { startDate: Date | null; endDate: Date | null };

interface DatePickerBaseProps {
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  required?: boolean;
  min?: Date;
  max?: Date;
  /**
   * Optional callback fired whenever the popover open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Optional callback fired when the popover closes.
   */
  onClose?: () => void;
  /**
   * Optional callback fired when the clear icon is clicked.
   * Useful when consumers save/delete on clear even if popover isn't open.
   */
  onClear?: () => void;
  /**
   * Date format pattern for display. Uses date-fns format tokens.
   * @default 'yyyy-MM-dd'
   * @example
   * 'yyyy-MM-dd' → "2023-12-25"
   * 'MM/dd/yyyy' → "12/25/2023"
   * 'dd MMM yyyy' → "25 Dec 2023"
   * 'MMMM dd, yyyy' → "December 25, 2023"
   */
  format?: string;
  error?: string;
  /**
   * Whether to show a clear button to reset the selected date
   * @default false
   */
  allowClear?: boolean;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
  mode: "single";
  value?: SingleValue;
  onChange?: (date: SingleValue) => void;
  numberOfMonths?: 1;
  startYear?: number;
  endYear?: number;
}

interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  value?: RangeValue;
  onChange?: (range: RangeValue) => void;
  numberOfMonths?: number;
  startYear?: number;
  endYear?: number;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

interface DateRangePreset {
  label: string;
  id: string;
  getRange: () => { from: Date; to: Date };
}

// ============================================================================
// Presets Configuration
// ============================================================================

const DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: "Last Week",
    id: "lastWeek",
    getRange: () => {
      const today = new Date();
      const lastWeekStartDate = subtractWeeks(today, 1);
      return {
        from: getWeekStart(lastWeekStartDate),
        to: getWeekEnd(lastWeekStartDate),
      };
    },
  },
  {
    label: "Last 2 Weeks",
    id: "last2Weeks",
    getRange: () => {
      const today = new Date();
      const twoWeeksAgo = subtractWeeks(today, 2);
      const oneWeekAgo = subtractWeeks(today, 1);
      return {
        from: getWeekStart(twoWeeksAgo),
        to: getWeekEnd(oneWeekAgo),
      };
    },
  },
  {
    label: "This Week",
    id: "thisWeek",
    getRange: () => {
      const today = new Date();
      return { from: getWeekStart(today), to: getWeekEnd(today) };
    },
  },
  {
    label: "Last 30 Days",
    id: "last30Days",
    getRange: () => {
      const today = new Date();
      return { from: subtractDays(today, 30), to: today };
    },
  },
  {
    label: "This Month",
    id: "thisMonth",
    getRange: () => {
      const today = new Date();
      return { from: getMonthStart(today), to: getMonthEnd(today) };
    },
  },
];

// ============================================================================
// Styles Configuration
// ============================================================================

const dayPickerStyles = {
  ...defaultClassNames,
  // Root container - clean white/dark background with subtle border
  root: `${defaultClassNames.root} border rounded-lg shadow-lg text-sm
    bg-white dark:bg-xtnd-dark-800
    border-gray-200 dark:border-xtnd-dark-600`,

  // Caption (month/year selector)
  caption_label: "hidden",
  chevron:
    "fill-xtnd-dark-600 dark:fill-xtnd-light hover:fill-xtnd-blue dark:hover:fill-xtnd-blue",

  // Dropdown selectors for month/year
  dropdown: `rounded-md text-sm font-medium px-2 py-1
    bg-white dark:bg-xtnd-dark-700
    text-xtnd-dark dark:text-xtnd-light
    border border-gray-300 dark:border-xtnd-dark-600
    hover:border-xtnd-blue dark:hover:border-xtnd-blue
    focus:outline-none focus:ring-2 focus:ring-xtnd-blue`,

  // Calendar grid
  months: `${defaultClassNames.months} rounded-lg w-full
    text-xtnd-dark dark:text-xtnd-light p-2`,

  // Weekday headers (S M T W T F S)
  weekday: `${defaultClassNames.weekday}
    text-xtnd-dark-600 dark:text-xtnd-dark-300
    font-semibold uppercase text-xs`,

  // Day cells
  day: `rounded-md transition-colors
    text-xtnd-dark dark:text-xtnd-light`,

  // Today's date - subtle underline with XTND blue
  today: `underline decoration-2 decoration-xtnd-blue
    font-semibold`,

  // Selected date(s) - XTND blue background with underline if today
  selected: `rounded-md font-bold
    bg-xtnd-blue text-white
    data-[today=true]:underline data-[today=true]:decoration-2 data-[today=true]:decoration-xtnd-blue`,

  // Outside month dates - muted
  outside: `text-gray-400 dark:text-xtnd-dark-500`,

  // Disabled dates
  disabled: "text-gray-300 dark:text-xtnd-dark-600 cursor-not-allowed",

  // Range selection styles
  range_start: "rounded-md",
  range_end: "rounded-md",
  range_middle: `bg-xtnd-blue-100 dark:bg-xtnd-dark-700
    text-xtnd-dark dark:text-xtnd-light
    rounded-none`,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format weekday name to narrow format (e.g., "M", "T", "W")
 */
const formatWeekdayName = (day: Date): string => {
  return day.toLocaleDateString(undefined, { weekday: "narrow" });
};

/**
 * Convert RangeValue to DateRange format
 */
const rangeValueToDateRange = (value?: RangeValue): DateRange | undefined => {
  if (!value?.startDate) return undefined;
  return {
    from: value.startDate,
    to: value.endDate ?? undefined,
  };
};

/**
 * Convert DateRange to RangeValue format
 */
const dateRangeToRangeValue = (range?: DateRange): RangeValue => {
  return {
    startDate: range?.from ?? null,
    endDate: range?.to ?? null,
  };
};

// ============================================================================
// Sub-Components
// ============================================================================

interface DateRangePresetsProps {
  onPresetSelect: (range: { from: Date; to: Date }) => void;
  onClose: () => void;
}

const DateRangePresets = ({ onPresetSelect }: DateRangePresetsProps) => (
  <div className="p-4 bg-gray-50 dark:bg-xtnd-dark-900 rounded-b-lg w-0 min-w-full border-t border-gray-200 dark:border-xtnd-dark-600">
    <div className="flex flex-wrap gap-2">
      {DATE_RANGE_PRESETS.map((preset) => (
        <Button
          key={preset.id}
          variant="outline"
          size="sm"
          onClick={() => onPresetSelect(preset.getRange())}
          className="text-xs hover:border-xtnd-blue transition-colors"
        >
          {preset.label}
        </Button>
      ))}
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

function DatePicker(props: DatePickerProps) {
  const {
    mode,
    label,
    id,
    placeholder,
    className,
    buttonClassName,
    disabled,
    required,
    startYear = 1950,
    endYear = 2100,
    error,
    format = "MM/dd/yyyy",
    allowClear = false,
  } = props;
  const [selected, setSelected] = useState<Date | DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const prevIsOpenRef = useRef<boolean>(false);

  const numberOfMonths = mode === "range" ? (props.numberOfMonths ?? 2) : 1;

  // Sync internal state with external value prop
  useEffect(() => {
    if (mode === "single") {
      setSelected(props.value ?? undefined);
    } else if (mode === "range") {
      setSelected(rangeValueToDateRange(props.value));
    }
  }, [props.value, mode]);

  // Notify open/close changes (and close events)
  useEffect(() => {
    const prevIsOpen = prevIsOpenRef.current;
    if (prevIsOpen !== isOpen) {
      props.onOpenChange?.(isOpen);
      if (prevIsOpen && !isOpen) {
        props.onClose?.();
      }
      prevIsOpenRef.current = isOpen;
    }
  }, [isOpen, props]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleSingleSelect = (newDate: Date | undefined) => {
    setSelected(newDate);
    if (mode === "single") {
      props.onChange?.(newDate ?? null);
    }
    setIsOpen(false);
  };

  const handleRangeSelect = (
    currentRange: DateRange | undefined,
    selectedDay: Date,
    newRange: DateRange | undefined,
  ) => {
    // Starting a new range or resetting existing complete range
    if (!currentRange?.from || (currentRange.from && currentRange.to)) {
      const newStart: DateRange = { from: selectedDay, to: undefined };
      setSelected(newStart);
      if (mode === "range") {
        props.onChange?.({ startDate: selectedDay, endDate: null });
      }
    } else {
      // Completing the range
      setSelected(newRange);
      if (mode === "range") {
        props.onChange?.(dateRangeToRangeValue(newRange));
      }

      // Close picker when range is complete
      if (newRange?.from && newRange?.to) {
        setIsOpen(false);
      }
    }
  };

  const handleSelect: PropsSingle["onSelect"] | PropsRange["onSelect"] = (
    newSelection: Date | DateRange | undefined,
    selectedDay: Date,
  ) => {
    if (mode === "single") {
      handleSingleSelect(newSelection as Date | undefined);
    } else if (mode === "range") {
      handleRangeSelect(
        selected as DateRange | undefined,
        selectedDay,
        newSelection as DateRange | undefined,
      );
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(undefined);

    if (mode === "single") {
      props.onChange?.(null);
    } else {
      props.onChange?.({ startDate: null, endDate: null });
    }
    props.onClear?.();
    setIsOpen(false);
  };

  const handlePresetSelect = (range: { from: Date; to: Date }) => {
    if (mode === "single") {
      setSelected(range.to);
      props.onChange?.(range.to);
    } else if (mode === "range") {
      setSelected(range);
      props.onChange?.({ startDate: range.from, endDate: range.to });
    }
    setIsOpen(false);
  };

  const togglePicker = () => setIsOpen(!isOpen);

  // ============================================================================
  // Display Logic
  // ============================================================================

  const displayText = useMemo(() => {
    const defaultPlaceholder =
      mode === "single" ? "mm-dd-yyyy" : "mm-dd-yyyy / mm-dd-yyyy";
    const placeholderText = placeholder ?? defaultPlaceholder;

    if (mode === "single" && selected) {
      return formatDate(selected as Date, format);
    }

    if (mode === "range" && selected) {
      const range = selected as DateRange;
      if (range.from && range.to) {
        return `${formatDate(range.from, format)} - ${formatDate(range.to, format)}`;
      }
      if (range.from) {
        return `${formatDate(range.from, format)} - ${defaultPlaceholder.split(" - ")[1]}`;
      }
    }

    return placeholderText;
  }, [mode, selected, placeholder, format]);

  // ============================================================================
  // DayPicker Configuration
  // ============================================================================

  const commonDayPickerProps = {
    navLayout: "around" as const,
    captionLayout: "dropdown" as const,
    formatters: { formatWeekdayName },
    classNames: dayPickerStyles,
    numberOfMonths,
    disabled,
    required,
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={`w-full ${className ?? ""}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-xtnd-dark dark:text-xtnd-light mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Button */}
      <Button
        id={id}
        type="button"
        variant="outline"
        onClick={togglePicker}
        disabled={disabled}
        rightIcon={
          <div className="flex items-end-safe space-x-2">
            {/* <Icon
              name="FiX"
              size="md"
              className={`cursor-pointer hover:opacity-70 ${
                allowClear && selected ? "visible" : "invisible"
              }`}
              onClick={selected ? handleClear : undefined}
            /> */}
            <HiCalendarDays
              name="HiCalendarDays"
              size="1.5em"
              className="dark:fill-xtnd-white hover:opacity-70"
            />
          </div>
        }
        className={`w-full bg-xtnd-light-900 border rounded-md shadow-sm cursor-pointer sm:text-sm dark:bg-xtnd-dark-800 hover:bg-xtnd-white ${
          error ? "!border-red-600" : ""
        } ${buttonClassName ?? ""}`}
      >
        <span className="inline-block min-w-[23ch] text-left truncate">
          {displayText}
        </span>
      </Button>

      {/* Error Message */}
      {error && (
        <span className="block text-sm font-medium text-red-600 mt-1">
          {error}
        </span>
      )}

      {/* Calendar Picker */}
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <div
            className="fixed inset-0 z-[90000]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Calendar */}
          <div
            className={`absolute z-[99999] mt-2 w-max ${mode === "range" ? "max-w-2xl" : "max-w-xs"}`}
          >
            {mode === "single" ? (
              <DayPicker
                mode="single"
                selected={selected as Date | undefined}
                onSelect={handleSelect as PropsSingle["onSelect"]}
                defaultMonth={selected as Date}
                startMonth={new Date(startYear, 0)}
                endMonth={new Date(endYear, 0)}
                {...commonDayPickerProps}
              />
            ) : (
              <DayPicker
                mode="range"
                selected={selected as DateRange | undefined}
                onSelect={handleSelect as PropsRange["onSelect"]}
                defaultMonth={(selected as DateRange)?.from ?? new Date()}
                startMonth={new Date(startYear, 0)}
                endMonth={new Date(endYear, 0)}
                footer={
                  <DateRangePresets
                    onPresetSelect={handlePresetSelect}
                    onClose={() => setIsOpen(false)}
                  />
                }
                {...commonDayPickerProps}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export { DatePicker };
export default DatePicker;

import {
  format as dateFnsFormat,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
} from "date-fns";

/**
 * Format a date using date-fns
 * @param date - Date to format
 * @param pattern - Format pattern (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd') // "2023-12-25"
 * formatDate(new Date(), 'MM/dd/yyyy') // "12/25/2023"
 * formatDate(new Date(), 'dd MMM yyyy') // "25 Dec 2023"
 */
export const formatDate = (
  date: Date,
  pattern: string = "yyyy-MM-dd",
): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.warn("formatDate: Invalid date provided");
    return "Invalid Date";
  }

  try {
    return dateFnsFormat(date, pattern);
  } catch (error) {
    console.error("formatDate: Error formatting date", error);
    return "Invalid Date";
  }
};

/**
 * Get the start of the week (Monday) for a given date
 * @param date - The date to calculate from
 * @returns Date representing the start of the week (Monday)
 * @example
 * getWeekStart(new Date('2023-12-25')) // Returns Monday of that week
 */
export const getWeekStart = (date: Date): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("getWeekStart: Invalid date provided");
  }
  // weekStartsOn: 1 means Monday (0 = Sunday, 1 = Monday, etc.)
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get the end of the week (Sunday) for a given date
 * @param date - The date to calculate from
 * @returns Date representing the end of the week (Sunday)
 * @example
 * getWeekEnd(new Date('2023-12-25')) // Returns Sunday of that week
 */
export const getWeekEnd = (date: Date): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("getWeekEnd: Invalid date provided");
  }
  // weekStartsOn: 1 means Monday (0 = Sunday, 1 = Monday, etc.)
  return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get the start of the month for a given date
 * @param date - The date to calculate from
 * @returns Date representing the first day of the month at 00:00:00
 * @example
 * getMonthStart(new Date('2023-12-25')) // Returns December 1, 2023
 */
export const getMonthStart = (date: Date): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("getMonthStart: Invalid date provided");
  }
  return startOfMonth(date);
};

/**
 * Get the end of the month for a given date
 * @param date - The date to calculate from
 * @returns Date representing the last day of the month at 23:59:59.999
 * @example
 * getMonthEnd(new Date('2023-12-25')) // Returns December 31, 2023
 */
export const getMonthEnd = (date: Date): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("getMonthEnd: Invalid date provided");
  }
  return endOfMonth(date);
};

/**
 * Subtract days from a date
 * @param date - The date to subtract from
 * @param amount - Number of days to subtract
 * @returns New Date object with days subtracted
 * @example
 * subDays(new Date('2023-12-25'), 30) // Returns November 25, 2023
 */
export const subtractDays = (date: Date, amount: number): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("subtractDays: Invalid date provided");
  }
  return subDays(date, amount);
};

/**
 * Subtract weeks from a date
 * @param date - The date to subtract from
 * @param amount - Number of weeks to subtract
 * @returns New Date object with weeks subtracted
 * @example
 * subtractWeeks(new Date('2023-12-25'), 2) // Returns date 2 weeks earlier
 */
export const subtractWeeks = (date: Date, amount: number): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("subtractWeeks: Invalid date provided");
  }
  return subWeeks(date, amount);
};

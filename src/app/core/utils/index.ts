import type { InvalidTimeStamps, TimeStamps, HourlyTime } from '@core/models';

/**
 * Generates an array of time intervals for every 15 minutes within a 24-hour period.
 * The times are formatted in a 12-hour clock format with 'am' and 'pm'.
 *
 * @returns {string[]} An array of time strings formatted as "hh:mm am/pm".
 */
export function generateTimeIntervals() {
  const times: string[] = [];
  const intervals = ['00', '15', '30', '45'];

  for (let hour = 0; hour < 24; hour++) {
    for (const interval of intervals) {
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'am' : 'pm';
      times.push(`${hour12}:${interval}${amPm}`);
    }
  }
  return times;
}

/**
 * Generates a 2D array of `Date` objects representing all the dates in the selected month,
 * including the days that appear from the previous and next months (based on the month's layout).
 *
 * @param {Date} date - A JavaScript `Date` object representing the date for which the month is selected.
 * @returns {Date[][]} - A 2D array where each inner array represents a week (7 days), and each element is a `Date` object.
 *
 * The function first calculates the first day of the month and determines how many days from
 * the previous month need to be shown to fill the first week. It then generates a 5-week grid
 * (35 days) representing the selected month, including the tail ends of the previous and next months.
 */
export function getDatesInSelectedMonth(date: Date): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstDayIndex = firstDay.getDay();
  let daysCount = 0 - firstDayIndex;

  return new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      daysCount++;
      return new Date(year, month, daysCount);
    });
  });
}

/**
 * Generates an array of objects representing hourly time labels for a 24-hour clock format.
 *
 * @returns {HourlyTime[]} - An array of objects, each containing `plainTime` (hour in 12-hour format)
 * and `startTime` (hour with ":00" minutes and 'am' or 'pm' suffix).
 *
 * The function iterates through 24 hours (0-23) and formats each hour into a 12-hour format,
 * with 'am' and 'pm' suffixes. It handles converting 0 hours to 12 (for 12am) and handles
 * formatting times correctly based on whether they are in the morning or afternoon.
 */
export function getHourlyTime() {
  const hourLabels: HourlyTime[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const amPm = hour < 12 ? 'am' : 'pm';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    hourLabels.push({
      plainTime: `${hour12} ${amPm}`,
      startTime: `${hour12}:00${amPm}`,
    });
  }
  return hourLabels;
}

/**
 * Formats a Date object to a time string in 12-hour format with 'am' or 'pm'.
 *
 * @param {Date} date - The date to format.
 * @returns string in the format "hh:mmam/pm" or an empty string if the date is null.
 */
export function formatToTimeString(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const minutesString = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesString}${amPm}`;
}

/**
 * Sets the time of a given Date object based on a time string in "hh:mmam/pm" format.
 *
 * @param {Date} date - The date to update.
 * @param {string} time - The time string "hh:mmam" or "hh:mmpm".
 * @returns {Date} A new Date object with the time set.
 */
export function setTimeToDate(date: Date, time: string): Date {
  const { amPm, hours, minutes } = parseTime(time);
  let adjustedHour = hours;

  if (amPm.toLowerCase() === 'pm' && hours !== 12) {
    adjustedHour = hours + 12;
  } else if (amPm.toLowerCase() === 'am' && hours === 12) {
    adjustedHour = 0;
  }

  const updatedDate = new Date(date);
  updatedDate.setHours(adjustedHour);
  updatedDate.setMinutes(minutes);
  return updatedDate;
}

/**
 * Parses a time string (e.g., "hh:mmam" or "hh:mmpm") and returns an object
 * with the hours, minutes, and period (AM/PM).
 *
 * @param time - The time string to parse.
 * @returns An object containing:
 *   - hours: The hour part (1-12).
 *   - minutes: The minute part (0-59).
 *   - amPm: The period ("am" or "pm").
 */
export function parseTime(time: string): {
  hours: number;
  minutes: number;
  amPm: string;
} {
  const [timePart, amPm] = time.split(/(am|pm)/i);
  const [hours, minutes] = timePart.split(':').map(Number);
  return { hours, minutes, amPm };
}

/**
 * Checks if the given time is equal to or after the specified start time.
 *
 * @param startTime - The starting time in the format "hh:mm am/pm".
 * @param checkTime - The time to check in the format "hh:mm am/pm".
 * @returns A boolean indicating whether `checkTime` is equal to or after `startTime`.
 *
 * @example
 * // Returns true
 * isTimeEqualOrAfter("02:30 pm", "02:30 pm");
 *
 * @example
 * // Returns false
 * isTimeEqualOrAfter("02:30 pm", "01:30 pm");
 *
 * @example
 * // Returns true
 * isTimeEqualOrAfter("02:30 pm", "03:00 pm");
 */
export function isTimeEqualOrAfter(
  startTime: string,
  checkTime: string
): boolean {
  const start = parseTime(startTime);
  const check = parseTime(checkTime);
  return start.amPm === check.amPm && start.hours === check.hours
    ? true
    : false;
}

/**
 * Validates the time stamps by checking if the start time is less than the end time.
 * Also checks if the start time and end time are not the same.
 *
 * @param {string[]} timeIntervals - An array of valid time options.
 * @param {TimeStamps} timeStamps - An object containing start and end time stamps.
 * @returns {InvalidTimeStamps | null} An object indicating validation errors or null if valid.
 */
export function timeValidator(
  timeIntervals: string[],
  timeStamps: TimeStamps
): InvalidTimeStamps | null {
  const startTime = timeStamps['start'];
  const endTime = timeStamps['end'];

  if (startTime === endTime) return { timeMismatch: true };

  const startTimeIndex = timeIntervals.indexOf(startTime);
  const endTimeIndex = timeIntervals.indexOf(endTime);

  if (startTimeIndex >= endTimeIndex) return { timeOrder: true };
  return null;
}

/**
 * Revives dates from a JSON string representation.
 * Converts string values that match the ISO date format to Date objects.
 *
 * @param {string} key - The key of the property being processed.
 * @param {string} value - The value of the property being processed.
 * @returns {Date | string} The revived Date object or the original string.
 */
export function dateReviver(key: string, value: string) {
  if (
    typeof value === 'string' &&
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
  ) {
    return new Date(value);
  }
  return value;
}

/**
 * Creates a deep copy of an object, preserving Date objects by reviving them from JSON.
 *
 * @param {T extends Object} dataObject - The object to copy.
 * @returns {T} A deep copy of the original object.
 */
export function deepCopy<T>(dataObject: T): T {
  return JSON.parse(JSON.stringify(dataObject), dateReviver);
}

/**
 * Generates a unique string key for a given Date object based on its local date representation.
 *
 * @param {Date} date - The date for which to generate the key.
 * @returns {string} The string key representing the date.
 */
export function getDateKey(date: Date): string {
  return date.toLocaleDateString();
}

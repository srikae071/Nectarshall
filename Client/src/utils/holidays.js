/**
 * Australian Public Holidays Data & Utility Helper
 */

// List of Australian Public Holidays
export const AUSTRALIAN_HOLIDAYS = [
  { name: "New Year's Day", month: 1, day: 1, icon: "🎉" },
  { name: "Australia Day", month: 1, day: 26, icon: "🇦🇺" },
  { name: "Labour Day", month: 3, day: 9, icon: "🛠️" },
  { name: "Good Friday", year: 2026, month: 4, day: 3, icon: "✝️" },
  { name: "Saturday before Easter Sunday", year: 2026, month: 4, day: 4, icon: "🥚" },
  { name: "Easter Sunday", year: 2026, month: 4, day: 5, icon: "🐣" },
  { name: "Easter Monday", year: 2026, month: 4, day: 6, icon: "🐰" },
  { name: "ANZAC Day", month: 4, day: 25, icon: "🌺" },
  { name: "King's Birthday", month: 6, day: 8, icon: "👑" },
  { name: "Friday before AFL Grand Final", month: 9, day: 25, icon: "🏉" },
  { name: "Melbourne Cup Day", month: 11, day: 3, icon: "🏇" },
  { name: "Christmas Day", month: 12, day: 25, icon: "🎄" },
  { name: "Boxing Day", month: 12, day: 26, icon: "📦" },
  { name: "Additional holiday for Boxing Day", month: 12, day: 28, icon: "🎁" },
];

/**
 * Checks if a given Date object or date parameters match any Australian Public Holiday.
 * Returns the holiday object if found, or null if not a holiday.
 */
export const getHolidayForDate = (year, month, day) => {
  // month is 1-indexed (1 = Jan, 12 = Dec)
  return AUSTRALIAN_HOLIDAYS.find((h) => {
    if (h.year && h.year !== year) return false;
    return h.month === month && h.day === day;
  }) || null;
};

/**
 * Calculates net leave days excluding Australian Public Holidays between startDate and endDate.
 */
export const calculateNetLeaveDays = (startDateStr, endDateStr, halfDay = false) => {
  if (!startDateStr || !endDateStr) return 0;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1; // 1-indexed
    const day = current.getDate();

    const holiday = getHolidayForDate(year, month, day);

    // If it is NOT a public holiday, count this day
    if (!holiday) {
      count += 1;
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  // If half day leave is selected and count > 0
  if (halfDay && count > 0) {
    return count / 2;
  }

  return count;
};


 // Formats a Date as YYYY-MM-DD using local time
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Returns today's date as YYYY-MM-DD
export function todayString(): string {
  return formatDate(new Date());
}

// Adds a number of days to a YYYY-MM-DD string and returns the new date string
export function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return formatDate(new Date(year, month - 1, day + days));
}

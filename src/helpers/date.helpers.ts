export function isIsoDate(date?: string): boolean {
  if (!date?.trim()) return false;
  const dateObject = new Date(date);
  return dateObject.toString() !== "Invalid Date";
}

export function diffInDays(startDate: number, endDate: number): number {
  return Math.trunc((endDate - startDate) / (1000 * 3600 * 24));
}

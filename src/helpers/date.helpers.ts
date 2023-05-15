export function isIsoDate(date?: string): boolean {
  if (!date?.trim()) return false;
  const dateObject = new Date(date);
  return dateObject.toString() !== "Invalid Date";
}

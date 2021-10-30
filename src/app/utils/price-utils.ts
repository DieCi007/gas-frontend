export function truncateDouble(x: number): number {
  return Math.round(x * 1000) / 1000;
}

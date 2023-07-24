export function getNumberWithOrdinal(n: number): string {
  // eslint-disable-next-line
  return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

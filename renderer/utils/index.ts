export function getNumberWithOrdinal(n: number): string {
  // eslint-disable-next-line
  return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

export function isEnvironment(environment: string): boolean {
  return process.env.NODE_ENV === environment;
}

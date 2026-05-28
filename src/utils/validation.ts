export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function minLength(value: string, n: number) {
  return value.trim().length >= n;
}

export function isPositiveNumber(value: string) {
  const v = Number(value);
  return !isNaN(v) && v > 0;
}

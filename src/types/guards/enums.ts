export const isOfEnum = <T>(value: unknown, allEnumValues: T[]): value is T => {
  return allEnumValues.includes(value as T);
};

export const toIsoStringWithLocalOffset = (date: Date): string => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString();
};

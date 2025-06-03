export const classifyRemainingTime = (timestamp) => {
  const now = Date.now();
  const diff = timestamp - now;

  if (diff <= 0) return "save data";

  const hours = diff / (1000 * 60 * 60);

  if (hours <= 24) return "day";
  if (hours <= 241) return "week";
  if (hours <= 24 * 30) return "month";
  if (hours <= 24 * 365) return "year";
  return "";
};

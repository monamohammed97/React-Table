export default function getInputType(column, columnTypes) {
  if (!column) return "text";
  const type = columnTypes[column];
  if (type === "number") return "number";
  if (type === "email") return "email";
  if (type === "date") return "date";
  return "text";
}

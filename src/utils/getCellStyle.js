// Function to get the cell style based on differences
export default function getCellStyle(
  rowIndex,
  key,
  differences,
  isFirstUpload
) {
  // Check if the row is the first upload
  if (isFirstUpload) {
    return { backgroundColor: "#d4edda" }; 
  }

  const diff = differences.find((item) => item.rowIndex === rowIndex);
// check if the diff exists and if the row contains changes
  if (diff && diff.changes[key]) {
    const { old, new: newValue } = diff.changes[key];
    if (old === "" && newValue !== "") return { backgroundColor: "#d4edda" };
    if (old !== "" && newValue === "") return { backgroundColor: "#f8d7da" };
    return { backgroundColor: "#fff3cd" };
  }
  return {};
}

export default function compareTables(oldData, newData) {
  const diffs = [];
  const maxLength = Math.max(oldData.length, newData.length);

  for (let i = 0; i < maxLength; i++) {
    const oldRow = oldData[i] || {};
    const newRow = newData[i] || {};
    const rowDiff = {};

    const allKeys = new Set([...Object.keys(oldRow), ...Object.keys(newRow)]);

    allKeys.forEach((key) => {
      const oldValue = oldRow[key] ?? "";
      const newValue = newRow[key] ?? "";
      if (oldValue !== newValue) {
        rowDiff[key] = { old: oldValue, new: newValue };
      }
    });

    if (Object.keys(rowDiff).length > 0) {
      diffs.push({ rowIndex: i, changes: rowDiff });
    }
  }
  return diffs;
}

function validateValues(data, guessedTypes) {
  const invalidColumns = [];

  const isDate = (val) => {
    return (
      Object.prototype.toString.call(val) === "[object Date]" ||
      (!isNaN(Date.parse(val)) && val.toString().length > 5)
    );
  };
  const isEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };
  Object.entries(guessedTypes).forEach(([col, type]) => {
    const invalidRows = [];
    data.forEach((row, idx) => {
      const val = row[col];

      if (val === "" || val === null || val === undefined) return;

      if (type === "number") {
        if (isNaN(Number(val))) {
          invalidRows.push({ rowIndex: idx + 1, value: val, id: row["id"] });
        }
      } else if (type === "date") {
        if (!isDate(val)) {
          invalidRows.push({ rowIndex: idx + 1, value: val, id: row["id"] });
        }
      } else if (type == "email") {
        if (!isEmail(val)) {
          invalidRows.push({ rowIndex: idx + 1, value: val, id: row["id"] });
        }
      }
    });
    if (invalidRows.length > 0) {
      invalidColumns.push({ column: col, invalidRows });
    }
  });

  return invalidColumns;
}

export default validateValues;

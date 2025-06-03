export default function guessColumnTypes(data) {
  const types = {};

  const isDate = (val) => {
    return (
      Object.prototype.toString.call(val) === "[object Date]" ||
      (!isNaN(Date.parse(val)) && val.toString().length > 5)
    );
  };

  const isEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  data.slice(0, 30).forEach((row) => {
    Object.keys(row).forEach((key) => {
      const val = row[key];
      if (!types[key]) types[key] = { number: 0, string: 0, date: 0, email: 0 };

      if (val === null || val === "") return;

      if (!isNaN(Number(val)) && val.toString().trim() !== "") {
        types[key].number++;
      } else if (isDate(val)) {
        types[key].date++;
      } else if (isEmail(val)) {
        types[key].email++;
      } else {
        types[key].string++;
      }
    });
  });

  const result = {};
  for (let key in types) {
    const counts = types[key];

    if (key.toLowerCase().includes("email")) {
      result[key] = "email";
    } else {
      const maxType = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );
      result[key] = maxType;
    }
  }

  return result;
}

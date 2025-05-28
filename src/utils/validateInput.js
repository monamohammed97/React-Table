  export default function validateInput(value, type) {
    if (!value) return "Value cannot be empty";

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    } else if (type === "number") {
      if (isNaN(value)) return "Must be a number";
    } else if (type === "date") {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "Invalid date format";
    }
    return "";
  }
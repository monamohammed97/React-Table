export default function saveToLocalStorage(data, selectedDuration) {
  const now = new Date();
  const duration = {
    Hour: 120000,
    Week: 7 * 24 * 60 * 60 * 1000,
    Month: 30 * 24 * 60 * 60 * 1000,
    Year: 365 * 24 * 60 * 60 * 1000,
  };

  if (selectedDuration === "Don't Save" || selectedDuration === "Save Data") {
    localStorage.removeItem("dataTable");
    localStorage.removeItem("expiry");

    return;
  }

  const timeS = duration[selectedDuration];
  if (!timeS) {
    localStorage.removeItem(key);
    return;
  }

  const expiry = now.getTime() + timeS;
  localStorage.setItem("dataTable", JSON.stringify(data));
  localStorage.setItem("expiry", expiry);
}

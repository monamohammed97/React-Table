export default function saveToLocalStorage(data, selectedDuration) {
  const selectedDurationLower = selectedDuration.toLowerCase();
  const now = new Date();
  const duration = {
    hour: 120000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  if (
    data.length == 0 ||
    selectedDurationLower === "don't save" ||
    selectedDurationLower === "save data"
  ) {
    localStorage.removeItem("dataTable");
    localStorage.removeItem("expiry");
    return;
  }

  const timeS = duration[selectedDurationLower];
  if (!timeS) {
    localStorage.removeItem("dataTable");
    return;
  }

  const expiry = now.getTime() + timeS;
  localStorage.setItem("dataTable", JSON.stringify(data));
  localStorage.setItem("expiry", expiry);
}

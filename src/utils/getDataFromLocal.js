export default function getDataFromLocal(data, expiry) {
  const dataFromLocal = localStorage.getItem(data);
  const expiryTime = localStorage.getItem(expiry);
  if (!dataFromLocal) return null;

  try {
    const item = JSON.parse(dataFromLocal);
    if (!expiryTime) return item;

    const now = new Date();
    if (now.getTime() > expiryTime) {
      {
        localStorage.removeItem(data);
        localStorage.removeItem(expiry);
        localStorage.removeItem("");
      }
      return null;
    }

    return item;
  } catch (err) {
    console.error("Error parsing localStorage item:", err);
    return null;
  }
}

const API_BASE = (() => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (!env || env === "") {
    return ""; // Use relative paths (goes through Vite proxy)
  }
  return env;
})();

export default API_BASE;

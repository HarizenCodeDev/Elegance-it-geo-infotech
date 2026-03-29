const API_BASE = (() => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (!env || env === "") {
    return "/api"; // Default to /api for relative requests
  }
  return env;
})();

export default API_BASE;

const API_BASE = (() => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (!env || env === "") {
    return "/api";
  }
  // If the env ends with /api, use it as is, otherwise append /api
  return env.endsWith("/api") ? env : `${env}/api`;
})();

export default API_BASE;

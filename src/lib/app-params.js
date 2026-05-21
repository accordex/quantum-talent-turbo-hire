/**
 * App parameters — configure via environment variables in .env
 */
export const appParams = {
  appId: import.meta.env.VITE_APP_ID || "talentturbo",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
};
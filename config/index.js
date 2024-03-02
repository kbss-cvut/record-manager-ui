/**
 * Aggregated object of process.env and window.__config__ to allow dynamic configuration
 */

const viteEnvPrefix = "RECORD_MANAGER_";
const ENV = {
  ...Object.keys(import.meta.env).reduce((acc, key) => {
    if (key.startsWith(viteEnvPrefix)) {
      const strippedKey = key.replace(viteEnvPrefix, "");
      acc[strippedKey] = import.meta.env[key];
    }
    return acc;
  }, {}),
  ...window.__config__,
};
/**
 * Helper to make sure that all envs are defined properly
 * @param name env variable name
 * @param defaultValue Default variable name
 */
export const getEnv = (name, defaultValue) => {
  const value = ENV[name] || defaultValue;
  if (value !== undefined) {
    return value;
  }
  throw new Error(`Missing environment variable: ${name}`);
};

export const API_URL = getEnv("API_URL");
export const APP_TITLE = getEnv("APP_TITLE", "Record Manager");
export const LANGUAGE = getEnv("LANGUAGE", "en");
export const NAVIGATOR_LANGUAGE = JSON.parse(getEnv("NAVIGATOR_LANGUAGE", "true"));
export const BASENAME = getEnv("BASENAME", "");
export const EXTENSIONS = getEnv("EXTENSIONS", "");
export const APP_INFO = getEnv("APP_INFO", "© KBSS at FEE CTU in Prague, 2024");

/**
 * Aggregated object of process.env and window.__config__ to allow dynamic configuration
 */
const ENV = {
        ...Object.keys(process.env).reduce((acc, key) => {
        const strippedKey = key.replace("RECORD_MANAGER_", "");
        acc[strippedKey] = process.env[key];
        return acc;
    }, {}),
    ...(window).__config__,
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
export const APP_TITLE = getEnv("APP_TITLE");
export const LANGUAGE = getEnv("LANGUAGE");
export const NAVIGATOR_LANGUAGE = JSON.parse(getEnv("NAVIGATOR_LANGUAGE"));
export const BASENAME = getEnv("BASENAME");
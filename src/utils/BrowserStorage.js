/**
 * Represent an interface to the browser-based storage
 */
const BrowserStorage = {
    set(key, value) {
        localStorage.setItem(key, value);
    },

    get(key, defaultValue = null) {
        const result = localStorage.getItem(key);
        return result != null ? result : defaultValue;
    },

    remove(key) {
        localStorage.removeItem(key);
    },
};

export default BrowserStorage;

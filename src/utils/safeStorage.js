// Robust browser-first storage wrapper that automatically falls back to in-memory caching
// if localStorage is blocked or throws a SecurityError (e.g. in sandbox contexts, 
// private windows, or deceptive site blockages).

let memoryStore = {};

const checkLocalStorageAvailability = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test_key__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const hasLocalStorage = checkLocalStorageAvailability();

export const safeStorage = {
  isAvailable: () => hasLocalStorage,

  getItem: (key) => {
    if (hasLocalStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn(`safeStorage.getItem failed for key "${key}", falling back to memory:`, e);
      }
    }
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  },

  setItem: (key, value) => {
    if (hasLocalStorage) {
      try {
        window.localStorage.setItem(key, String(value));
        return;
      } catch (e) {
        console.warn(`safeStorage.setItem failed for key "${key}", falling back to memory:`, e);
      }
    }
    memoryStore[key] = String(value);
  },

  removeItem: (key) => {
    if (hasLocalStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn(`safeStorage.removeItem failed for key "${key}", falling back to memory:`, e);
      }
    }
    delete memoryStore[key];
  },

  clear: () => {
    if (hasLocalStorage) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        console.warn('safeStorage.clear failed, falling back to memory:', e);
      }
    }
    memoryStore = {};
  },

  getLength: () => {
    if (hasLocalStorage) {
      try {
        return window.localStorage.length;
      } catch (e) {
        console.warn('safeStorage.getLength failed, falling back to memory:', e);
      }
    }
    return Object.keys(memoryStore).length;
  },

  key: (index) => {
    if (hasLocalStorage) {
      try {
        return window.localStorage.key(index);
      } catch (e) {
        console.warn(`safeStorage.key failed for index ${index}, falling back to memory:`, e);
      }
    }
    const keys = Object.keys(memoryStore);
    return index >= 0 && index < keys.length ? keys[index] : null;
  }
};

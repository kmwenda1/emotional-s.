export const safeStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[SafeStorage] Failed reading key "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[SafeStorage] Failed writing key "${key}" to localStorage:`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[SafeStorage] Failed removing key "${key}" from localStorage:`, error);
      return false;
    }
  },
};

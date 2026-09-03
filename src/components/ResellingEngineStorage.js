/* Browser-local persistence for the deal log. Scoped to this file only —
   swap for a real backend later without touching the rest of the tool,
   since every call site goes through this same {list,get,set,delete}
   shape. */
export const storage = {
  async list(prefix) {
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(prefix));
    return { keys };
  },
  async get(key) {
    const value = window.localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
  },
  async delete(key) {
    window.localStorage.removeItem(key);
  },
};

const STORAGE_KEY = 'startpage_state';

const defaultState = {
  categories: [],
  username: ''
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return defaultState;
};

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

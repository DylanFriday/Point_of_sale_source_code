const STORAGE_KEY = 'pos_transactions_v1';
const CATEGORY_KEY = 'pos_custom_categories_v1';

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load transactions', error);
    return [];
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions', error);
  }
}

export function loadCustomCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load categories', error);
    return [];
  }
}

export function saveCustomCategories(categories) {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories', error);
  }
}

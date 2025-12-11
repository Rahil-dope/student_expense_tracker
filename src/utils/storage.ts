import { Transaction } from '../App';

const STORAGE_KEYS = {
    TRANSACTIONS: 'expense_tracker_transactions',
    BUDGET: 'expense_tracker_budget',
    SETTINGS: 'expense_tracker_settings',
    CATEGORIES: 'expense_tracker_categories',
} as const;

export type AppSettings = {
    darkMode: boolean;
    biometricLock: boolean;
    currency: string;
};

export type Category = {
    id: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
};

// Transaction Storage
export const saveTransactions = (transactions: Transaction[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
        console.error('Failed to save transactions:', error);
    }
};

export const loadTransactions = (): Transaction[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (!data) return [];

        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];

        return parsed;
    } catch (error) {
        console.error('Failed to load transactions:', error);
        return [];
    }
};

// Budget Storage
export const saveBudget = (budget: number): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.BUDGET, budget.toString());
    } catch (error) {
        console.error('Failed to save budget:', error);
    }
};

export const loadBudget = (): number => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
        if (!data) return 10000; // Default budget

        const parsed = parseFloat(data);
        return isNaN(parsed) ? 10000 : parsed;
    } catch (error) {
        console.error('Failed to load budget:', error);
        return 10000;
    }
};

// Settings Storage
export const saveSettings = (settings: AppSettings): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
};

export const loadSettings = (): AppSettings => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!data) {
            return {
                darkMode: false,
                biometricLock: false,
                currency: 'INR',
            };
        }

        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load settings:', error);
        return {
            darkMode: false,
            biometricLock: false,
            currency: 'INR',
        };
    }
};

// Categories Storage
export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'food', name: 'Food', icon: '🍔', color: '#FF6B6B', isDefault: true },
    { id: 'travel', name: 'Travel', icon: '🚌', color: '#4ECDC4', isDefault: true },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#95E1D3', isDefault: true },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F38181', isDefault: true },
    { id: 'education', name: 'Education', icon: '📚', color: '#6C5CE7', isDefault: true },
    { id: 'health', name: 'Health', icon: '⚕️', color: '#74B9FF', isDefault: true },
    { id: 'bills', name: 'Bills', icon: '💡', color: '#FD79A8', isDefault: true },
    { id: 'income', name: 'Income', icon: '💰', color: '#00B894', isDefault: true },
    { id: 'other', name: 'Other', icon: '📌', color: '#FDCB6E', isDefault: true },
];

export const saveCategories = (categories: Category[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
        console.error('Failed to save categories:', error);
    }
};

export const loadCategories = (): Category[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (!data) return DEFAULT_CATEGORIES;

        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return DEFAULT_CATEGORIES;

        return parsed;
    } catch (error) {
        console.error('Failed to load categories:', error);
        return DEFAULT_CATEGORIES;
    }
};

// Export all data
export const exportAllData = () => {
    return {
        transactions: loadTransactions(),
        budget: loadBudget(),
        settings: loadSettings(),
        categories: loadCategories(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
    };
};

// Import all data
export const importAllData = (data: any): boolean => {
    try {
        if (data.transactions && Array.isArray(data.transactions)) {
            saveTransactions(data.transactions);
        }
        if (data.budget && typeof data.budget === 'number') {
            saveBudget(data.budget);
        }
        if (data.settings) {
            saveSettings(data.settings);
        }
        if (data.categories && Array.isArray(data.categories)) {
            saveCategories(data.categories);
        }
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
};

// Clear all data
export const clearAllData = (): void => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('Failed to clear data:', error);
    }
};

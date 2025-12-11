import React, { useState, useEffect } from 'react';
import OnboardingScreen from './components/OnboardingScreen';
import DashboardScreen from './components/DashboardScreen';
import AddExpenseScreen from './components/AddExpenseScreen';
import TransactionsScreen from './components/TransactionsScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import BudgetsScreen from './components/BudgetsScreen';
import SettingsScreen from './components/SettingsScreen';
import {
  loadTransactions,
  saveTransactions,
  loadBudget,
  saveBudget,
  loadSettings,
  saveSettings,
  AppSettings,
} from './utils/storage';

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  type: 'expense' | 'income';
};

export type Screen =
  | 'onboarding'
  | 'dashboard'
  | 'add-expense'
  | 'transactions'
  | 'analytics'
  | 'budgets'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  // Load data from localStorage on mount
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const loaded = loadTransactions();
    // If no saved data, use default sample data
    if (loaded.length === 0) {
      return [
        {
          id: '1',
          amount: 450,
          category: 'Food',
          note: 'Lunch at canteen',
          date: '2025-12-10',
          type: 'expense'
        },
        {
          id: '2',
          amount: 120,
          category: 'Travel',
          note: 'Bus fare',
          date: '2025-12-10',
          type: 'expense'
        },
        {
          id: '3',
          amount: 5000,
          category: 'Income',
          note: 'Monthly allowance',
          date: '2025-12-01',
          type: 'income'
        },
        {
          id: '4',
          amount: 850,
          category: 'Shopping',
          note: 'Books and stationery',
          date: '2025-12-09',
          type: 'expense'
        },
        {
          id: '5',
          amount: 300,
          category: 'Food',
          note: 'Coffee with friends',
          date: '2025-12-08',
          type: 'expense'
        }
      ];
    }
    return loaded;
  });

  const [monthlyBudget, setMonthlyBudget] = useState(() => loadBudget());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // Auto-save transactions to localStorage whenever they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Auto-save budget to localStorage whenever it changes
  useEffect(() => {
    saveBudget(monthlyBudget);
  }, [monthlyBudget]);

  // Auto-save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] min-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative">
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onGetStarted={() => navigateTo('dashboard')} />
        )}
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            onNavigate={navigateTo}
          />
        )}
        {currentScreen === 'add-expense' && (
          <AddExpenseScreen
            onSave={addTransaction}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentScreen === 'transactions' && (
          <TransactionsScreen
            transactions={transactions}
            onDelete={deleteTransaction}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentScreen === 'analytics' && (
          <AnalyticsScreen
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentScreen === 'budgets' && (
          <BudgetsScreen
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            onUpdateBudget={setMonthlyBudget}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            onBack={() => navigateTo('dashboard')}
          />
        )}
      </div>
    </div>
  );
}

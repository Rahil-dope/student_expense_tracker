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
  loadHasOnboarded,
  saveHasOnboarded,
  AppSettings,
} from './utils/storage';

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  type: 'expense' | 'budget';
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
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const hasOnboarded = loadHasOnboarded();
    return hasOnboarded ? 'dashboard' : 'onboarding';
  });

  // Load data from localStorage on mount
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

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

    // Automatically update budget if a budget transaction is added
    if (transaction.type === 'budget') {
      setMonthlyBudget(prev => prev + transaction.amount);
    }

    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete && transactionToDelete.type === 'budget') {
      // Optional: Deduct from budget if budget entry is deleted? 
      // For now let's keep it simple, user manages budget in Budget screen mostly.
      // But to be consistent with "Income -> Budget", maybe we should decrement?
      setMonthlyBudget(prev => Math.max(0, prev - transactionToDelete.amount));
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleOnboardingComplete = () => {
    saveHasOnboarded(true);
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] min-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative">
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onGetStarted={handleOnboardingComplete} />
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

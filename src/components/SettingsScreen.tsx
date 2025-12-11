import React from 'react';
import {
  ArrowLeft,
  Download,
  Upload,
  Database,
  Lock,
  Moon,
  Sun,
  ChevronRight,
  Shield,
  Info,
  Check
} from 'lucide-react';
import Card from './Card';
import { Transaction } from '../App';
import { AppSettings, exportAllData, importAllData } from '../utils/storage';

type SettingsScreenProps = {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  transactions: Transaction[];
  monthlyBudget: number;
  onBack: () => void;
};

export default function SettingsScreen({
  settings,
  onUpdateSettings,
  transactions,
  monthlyBudget,
  onBack
}: SettingsScreenProps) {
  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate data structure
        if (!data.transactions && !data.budget && !data.settings) {
          throw new Error('Invalid backup file format');
        }

        // Confirm before importing
        const confirmed = confirm(
          `Import data from backup?\n\n` +
          `This will replace your current data:\n` +
          `- ${data.transactions?.length || 0} transactions\n` +
          `- Budget: ₹${data.budget || 0}\n\n` +
          `Current data will be lost. Continue?`
        );

        if (!confirmed) return;

        // Import data
        const success = importAllData(data);
        if (success) {
          alert('✅ Data imported successfully! Reloading...');
          // Reload page to refresh all state
          window.location.reload();
        } else {
          throw new Error('Import failed');
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('❌ Failed to import data. Please check the file and try again.');
      }
    };

    input.click();
  };

  const handleBackup = () => {
    // Same as export for now
    handleExport();
  };

  const toggleBiometricLock = () => {
    const newValue = !settings.biometricLock;
    onUpdateSettings({ biometricLock: newValue });
    if (newValue) {
      alert('🔒 Biometric lock enabled (UI only - actual implementation would require native app)');
    }
  };

  const toggleDarkMode = () => {
    const newValue = !settings.darkMode;
    onUpdateSettings({ darkMode: newValue });
    // Apply dark mode class to body
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-[#F6F8FF] dark:from-gray-800 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-[12px] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={24} className="text-[#1A1A1A] dark:text-white" />
          </button>
          <h1 className="text-[#1A1A1A] dark:text-white text-2xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
        {/* Data Stats */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Your Data</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Monthly Budget</p>
                <p className="text-2xl font-bold">₹{monthlyBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Management Section */}
        <div>
          <h2 className="text-[#6B7280] dark:text-gray-400 text-sm font-medium mb-3">Data Management</h2>
          <Card className="divide-y divide-gray-100 dark:divide-gray-700">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F6F8FF] dark:hover:bg-gray-700 transition-colors first:rounded-t-[16px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                  <Download size={20} className="text-[#2F80ED]" />
                </div>
                <div className="text-left">
                  <p className="text-[#1A1A1A] dark:text-white font-medium">Export Data</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Download your data as JSON</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>

            <button
              onClick={handleImport}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F6F8FF] dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                  <Upload size={20} className="text-[#2F80ED]" />
                </div>
                <div className="text-left">
                  <p className="text-[#1A1A1A] dark:text-white font-medium">Import Data</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Restore from a backup file</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>

            <button
              onClick={handleBackup}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F6F8FF] dark:hover:bg-gray-700 transition-colors last:rounded-b-[16px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                  <Database size={20} className="text-[#2F80ED]" />
                </div>
                <div className="text-left">
                  <p className="text-[#1A1A1A] dark:text-white font-medium">Create Backup</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Save a local backup file</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>
          </Card>
        </div>

        {/* Security Section */}
        <div>
          <h2 className="text-[#6B7280] dark:text-gray-400 text-sm font-medium mb-3">Security</h2>
          <Card>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                  <Lock size={20} className="text-[#2F80ED]" />
                </div>
                <div>
                  <p className="text-[#1A1A1A] dark:text-white font-medium">PIN/Biometric Lock</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Secure your app</p>
                </div>
              </div>
              <button
                onClick={toggleBiometricLock}
                className={`relative w-12 h-7 rounded-full transition-colors ${settings.biometricLock ? 'bg-[#2F80ED]' : 'bg-[#E5E7EB] dark:bg-gray-600'
                  }`}
                aria-label={`Biometric lock is ${settings.biometricLock ? 'on' : 'off'}`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${settings.biometricLock ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                  {settings.biometricLock && <Check size={14} className="text-[#2F80ED]" />}
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Appearance Section */}
        <div>
          <h2 className="text-[#6B7280] dark:text-gray-400 text-sm font-medium mb-3">Appearance</h2>
          <Card>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                  {settings.darkMode ? (
                    <Moon size={20} className="text-[#2F80ED]" />
                  ) : (
                    <Sun size={20} className="text-[#2F80ED]" />
                  )}
                </div>
                <div>
                  <p className="text-[#1A1A1A] dark:text-white font-medium">Dark Mode</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Switch to dark theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-7 rounded-full transition-colors ${settings.darkMode ? 'bg-[#2F80ED]' : 'bg-[#E5E7EB] dark:bg-gray-600'
                  }`}
                aria-label={`Dark mode is ${settings.darkMode ? 'on' : 'off'}`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                  {settings.darkMode && <Check size={14} className="text-[#2F80ED]" />}
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-[#F6F8FF] dark:bg-gray-800">
          <div className="flex items-start gap-3 p-4">
            <Shield size={24} className="text-[#2F80ED] flex-shrink-0" />
            <div>
              <p className="text-[#1A1A1A] dark:text-white font-semibold mb-1">Your Privacy Matters</p>
              <p className="text-sm text-[#6B7280] dark:text-gray-400">
                All your financial data is stored locally on your device. We do not collect,
                transmit, or store any of your personal information on external servers.
              </p>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card>
          <button className="w-full flex items-center justify-between p-4 hover:bg-[#F6F8FF] dark:hover:bg-gray-700 transition-colors rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F6F8FF] dark:bg-gray-700 rounded-[12px] flex items-center justify-center">
                <Info size={20} className="text-[#2F80ED]" />
              </div>
              <div className="text-left">
                <p className="text-[#1A1A1A] dark:text-white font-medium">About</p>
                <p className="text-xs text-[#9CA3AF] dark:text-gray-400">Version 1.0.0</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#9CA3AF]" />
          </button>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-[#9CA3AF] dark:text-gray-400">Student Expense Tracker</p>
          <p className="text-xs text-[#9CA3AF] dark:text-gray-500 mt-1">Made with care for students 💙</p>
        </div>
      </div>
    </div>
  );
}

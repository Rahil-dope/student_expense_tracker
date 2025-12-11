import React from 'react';
import { Plus, TrendingDown, Settings, BarChart3, Wallet } from 'lucide-react';
import Card from './Card';
import CategoryChip from './CategoryChip';
import { Transaction, Screen } from '../App';

type DashboardScreenProps = {
  transactions: Transaction[];
  monthlyBudget: number;
  onNavigate: (screen: Screen) => void;
};

export default function DashboardScreen({ transactions, monthlyBudget, onNavigate }: DashboardScreenProps) {
  // Calculate this month's spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudgetAdded = thisMonthTransactions
    .filter(t => t.type === 'budget')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total available budget = Initial Monthly Budget + Added Budget - Expenses
  const remainingCalculated = (monthlyBudget + totalBudgetAdded) - totalExpenses;

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Others'];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#1A1A1A] text-2xl font-bold">My Expenses</h1>
            <p className="text-gray-400 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={20} className="text-[#1A1A1A]" />
          </button>
        </div>

        {/* Smart Budget Card */}
        <div className="w-full bg-[#1A1A1A] rounded-[24px] p-6 text-white shadow-xl shadow-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold tracking-tight">
                ₹ {remainingCalculated.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="bg-[#333] p-2 rounded-full">
              <Wallet size={20} className="text-white" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">Spent</p>
              <p className="text-xl font-semibold text-[#FF6B6B]">₹ {totalExpenses.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-800"></div>
            <div className="text-right">
              <p className="text-gray-400 text-xs font-medium mb-1">Budget Added</p>
              <p className="text-xl font-semibold text-[#10B981]">+₹ {totalBudgetAdded.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Simplified */}
      <div className="px-6 grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate('analytics')}
          className="flex items-center justify-center gap-2 p-4 bg-[#F6F8FF] rounded-[16px] hover:bg-[#EEF2FF] transition-all font-semibold text-[#2F80ED]"
        >
          <BarChart3 size={20} />
          Analytics
        </button>

        <button
          onClick={() => onNavigate('transactions')}
          className="flex items-center justify-center gap-2 p-4 bg-[#F6F8FF] rounded-[16px] hover:bg-[#EEF2FF] transition-all font-semibold text-[#2F80ED]"
        >
          <TrendingDown size={20} />
          History
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <h2 className="text-[#1A1A1A] font-bold text-lg mb-4">Recent Activity</h2>

        {recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="text-[#1A1A1A] font-medium">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Tap the + button to add one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-1 bg-transparent">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${transaction.type === 'expense' ? 'bg-[#FFF0F0] text-[#FF6B6B]' : 'bg-[#E7FBF3] text-[#10B981]'
                    }`}>
                    {transaction.type === 'expense' ?
                      <TrendingDown size={20} /> :
                      <Wallet size={20} />
                    }
                  </div>
                  <div>
                    <p className="text-[#1A1A1A] font-bold text-base truncate max-w-[140px]">{transaction.note}</p>
                    <p className="text-xs text-gray-400 font-medium">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-base ${transaction.type === 'expense' ? 'text-[#1A1A1A]' : 'text-[#10B981]'}`}>
                    {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => onNavigate('add-expense')}
          className="w-16 h-16 bg-[#1A1A1A] rounded-full shadow-lg shadow-gray-400/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white"
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
}

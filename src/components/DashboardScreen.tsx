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

  const totalIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Others'];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-gradient-to-b from-[#F6F8FF] to-transparent">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#1A1A1A]">Student Expenses</h1>
          <button 
            onClick={() => onNavigate('settings')}
            className="p-2 hover:bg-white rounded-[12px] transition-colors"
          >
            <Settings size={24} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Monthly Summary Card */}
        <Card gradient className="text-white">
          <div className="space-y-2">
            <p className="text-white/80 text-sm">This Month's Spending</p>
            <div className="text-4xl">₹ {totalExpenses.toLocaleString('en-IN')}</div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-white/80">
                Income: ₹ {totalIncome.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-white/80">
                Balance: ₹ {(totalIncome - totalExpenses).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Categories */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryChip key={category} category={category} small />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('analytics')}
            className="flex flex-col items-center gap-2 p-4 bg-[#F6F8FF] rounded-[12px] hover:bg-[#EEF2FF] transition-colors"
          >
            <BarChart3 size={24} className="text-[#2F80ED]" />
            <span className="text-xs text-[#6B7280]">Analytics</span>
          </button>
          
          <button
            onClick={() => onNavigate('budgets')}
            className="flex flex-col items-center gap-2 p-4 bg-[#F6F8FF] rounded-[12px] hover:bg-[#EEF2FF] transition-colors"
          >
            <Wallet size={24} className="text-[#2F80ED]" />
            <span className="text-xs text-[#6B7280]">Budgets</span>
          </button>
          
          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-2 p-4 bg-[#F6F8FF] rounded-[12px] hover:bg-[#EEF2FF] transition-colors"
          >
            <TrendingDown size={24} className="text-[#2F80ED]" />
            <span className="text-xs text-[#6B7280]">All</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A]">Recent Transactions</h2>
          <button 
            onClick={() => onNavigate('transactions')}
            className="text-sm text-[#2F80ED] hover:underline"
          >
            View all
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-[#9CA3AF]">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Tap + to add your first transaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <CategoryChip category={transaction.category} small />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1A1A1A] truncate">{transaction.note}</p>
                      <p className="text-sm text-[#9CA3AF]">
                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`${transaction.type === 'expense' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                    {transaction.type === 'expense' ? '-' : '+'}₹ {transaction.amount}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate('add-expense')}
        className="absolute bottom-8 right-8 w-14 h-14 bg-[#2F80ED] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#2567C7] active:scale-95 transition-all"
      >
        <Plus size={28} className="text-white" />
      </button>
    </div>
  );
}

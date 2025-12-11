import React, { useState } from 'react';
import { ArrowLeft, Edit2, Check, TrendingDown } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { Transaction } from '../App';

type BudgetsScreenProps = {
  transactions: Transaction[];
  monthlyBudget: number;
  onUpdateBudget: (budget: number) => void;
  onBack: () => void;
};

export default function BudgetsScreen({
  transactions,
  monthlyBudget,
  onUpdateBudget,
  onBack
}: BudgetsScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

  // Calculate spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Category budgets (suggested allocations)
  const categoryBudgets = [
    { category: 'Food', suggested: monthlyBudget * 0.3, icon: '🍔' },
    { category: 'Travel', suggested: monthlyBudget * 0.15, icon: '🚌' },
    { category: 'Rent', suggested: monthlyBudget * 0.35, icon: '🏠' },
    { category: 'Shopping', suggested: monthlyBudget * 0.15, icon: '🛍️' },
    { category: 'Others', suggested: monthlyBudget * 0.05, icon: '📦' }
  ];

  // Calculate spent per category
  const categorySpending = thisMonthExpenses > 0 ? transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.type === 'expense';
    })
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>) : {};

  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (newBudget > 0) {
      onUpdateBudget(newBudget);
      setIsEditing(false);
    }
  };

  const percentageSpent = (thisMonthExpenses / monthlyBudget) * 100;
  const remaining = monthlyBudget - thisMonthExpenses;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-[#F6F8FF] to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-white rounded-[12px] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={24} className="text-[#1A1A1A]" />
          </button>
          <h1 className="text-[#1A1A1A] text-2xl font-semibold">Budgets</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
        {/* Budget Overview Card */}
        <Card className="bg-gradient-to-br from-[#2F80ED] to-[#5B9FED] text-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Monthly Budget</p>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="w-32 px-3 py-1 text-xl bg-white/20 rounded-[8px] border-2 border-white/40 focus:border-white focus:outline-none"
                    />
                    <button
                      onClick={handleSaveBudget}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-[8px] transition-colors"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <p className="text-3xl">₹ {monthlyBudget.toLocaleString('en-IN')}</p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-[12px] transition-colors"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span>Spent: ₹ {thisMonthExpenses.toLocaleString('en-IN')}</span>
                <span>{Math.min(100, percentageSpent).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${percentageSpent > 90 ? 'bg-[#EF4444]' : 'bg-white'
                    }`}
                  style={{ width: `${Math.min(100, percentageSpent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-white/80">
                  Remaining: ₹ {Math.max(0, remaining).toLocaleString('en-IN')}
                </span>
                {percentageSpent > 100 && (
                  <span className="text-[#FEE2E2]">
                    Over budget by ₹ {Math.abs(remaining).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Alert */}
        {percentageSpent > 80 && (
          <Card className="bg-[#FEF3C7] border-2 border-[#F59E0B]">
            <div className="flex items-start gap-3">
              <TrendingDown size={24} className="text-[#F59E0B] flex-shrink-0" />
              <div>
                <p className="text-[#92400E]">
                  {percentageSpent > 100
                    ? 'Budget exceeded!'
                    : 'You\'re approaching your budget limit'}
                </p>
                <p className="text-sm text-[#92400E]/70 mt-1">
                  {percentageSpent > 100
                    ? 'Consider reviewing your spending patterns.'
                    : 'Consider reducing expenses in the coming days.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Category-wise Budget */}
        <div>
          <h2 className="text-[#1A1A1A] mb-4">Suggested Category Allocation</h2>
          <div className="space-y-3">
            {categoryBudgets.map((item) => {
              const spent = categorySpending[item.category] || 0;
              const percentage = (spent / item.suggested) * 100;

              return (
                <Card key={item.category}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-[#1A1A1A]">{item.category}</p>
                          <p className="text-xs text-[#9CA3AF]">
                            ₹{spent.toLocaleString('en-IN')} / ₹{item.suggested.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm ${percentage > 100 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                        {Math.min(100, percentage).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F6F8FF] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${percentage > 100 ? 'bg-[#EF4444]' : 'bg-[#2F80ED]'
                          }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-[#F6F8FF]">
          <h3 className="text-[#1A1A1A] mb-2">💡 Budget Tips</h3>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li>• Track every expense to stay within budget</li>
            <li>• Review your spending weekly</li>
            <li>• Adjust category allocations based on your needs</li>
            <li>• Set aside emergency funds</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

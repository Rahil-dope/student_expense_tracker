import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from './Card';
import { Transaction } from '../App';

type AnalyticsScreenProps = {
  transactions: Transaction[];
  monthlyBudget: number;
  onBack: () => void;
};

export default function AnalyticsScreen({ transactions, monthlyBudget, onBack }: AnalyticsScreenProps) {
  // Calculate current month data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category distribution
  const categoryData = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#6B7280'];

  // Last 6 months spending
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() &&
        tDate.getFullYear() === date.getFullYear() &&
        t.type === 'expense';
    });
    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    monthlyData.push({
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      amount: total
    });
  }

  // Find highest spending category
  const highestCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0];
  const remainingBudget = monthlyBudget - totalExpenses;

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
          <h1 className="text-[#1A1A1A] text-2xl font-semibold">Analytics</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Spending</p>
                <p className="text-2xl">₹{totalExpenses.toLocaleString('en-IN')}</p>
              </div>
              <TrendingDown size={24} className="text-white/80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Budget Left</p>
                <p className="text-2xl">₹{Math.max(0, remainingBudget).toLocaleString('en-IN')}</p>
              </div>
              <DollarSign size={24} className="text-white/80" />
            </div>
          </Card>
        </div>

        {highestCategory && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7280] text-sm mb-1">Highest Category Spend</p>
                <p className="text-xl text-[#1A1A1A]">{highestCategory[0]}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl text-[#2F80ED]">₹{highestCategory[1].toLocaleString('en-IN')}</p>
                <p className="text-sm text-[#9CA3AF]">
                  {((highestCategory[1] / totalExpenses) * 100).toFixed(0)}% of total
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Monthly Spending Chart */}
        <Card>
          <h2 className="text-[#1A1A1A] mb-4">Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`₹${value}`, 'Amount']}
              />
              <Bar dataKey="amount" fill="#2F80ED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        {pieData.length > 0 && (
          <Card>
            <h2 className="text-[#1A1A1A] mb-4">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`₹${value}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-[#6B7280]">
                    {item.name}: ₹{item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

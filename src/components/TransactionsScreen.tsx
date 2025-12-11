import { useState } from 'react';
import { ArrowLeft, Search, Filter, Trash2 } from 'lucide-react';
import Card from './Card';
import CategoryChip from './CategoryChip';
import { Transaction } from '../App';

type TransactionsScreenProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onBack: () => void;
};

export default function TransactionsScreen({ transactions, onDelete, onBack }: TransactionsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Others', 'Income'];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || filterCategory === 'All' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

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
          <h1 className="text-[#1A1A1A] text-2xl font-semibold">Transactions</h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-6 pb-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-[12px] border-2 border-[#E5E7EB] focus:border-[#2F80ED] focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-[12px] border-2 border-[#E5E7EB] hover:border-[#2F80ED] transition-colors"
        >
          <Filter size={16} className="text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">
            {filterCategory && filterCategory !== 'All' ? filterCategory : 'Filter by category'}
          </span>
        </button>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat === 'All' ? null : cat)}
                className={`px-4 py-2 rounded-[12px] text-sm transition-all ${(cat === 'All' && !filterCategory) || filterCategory === cat
                    ? 'bg-[#2F80ED] text-white'
                    : 'bg-[#F6F8FF] text-[#6B7280] hover:bg-[#EEF2FF]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF]">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date}>
                <h3 className="text-sm text-[#6B7280] font-medium mb-3">{date}</h3>
                <div className="space-y-3">
                  {dayTransactions.map((transaction) => (
                    <Card key={transaction.id} className="relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <CategoryChip category={transaction.category} small />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#1A1A1A] font-medium truncate">{transaction.note}</p>
                            <p className="text-xs text-[#9CA3AF]">
                              {new Date(transaction.date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`font-semibold ${transaction.type === 'expense' ? 'text-[#EF4444]' : 'text-[#10B981]'
                            }`}>
                            {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this transaction?')) {
                                onDelete(transaction.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-[8px] transition-all"
                            aria-label="Delete transaction"
                          >
                            <Trash2 size={16} className="text-[#EF4444]" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

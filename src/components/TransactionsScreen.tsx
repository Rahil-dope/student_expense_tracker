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

  const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Others', 'Budget'];

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
      <div className="px-6 pb-4 space-y-3 sticky top-20 bg-white z-10 pt-2">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by note or category..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-[16px] border border-transparent focus:bg-white focus:border-[#1A1A1A] focus:outline-none transition-all font-medium"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] border transition-all ${filterCategory
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
        >
          <Filter size={16} />
          <span className="text-sm font-medium">
            {filterCategory && filterCategory !== 'All' ? filterCategory : 'Filter'}
          </span>
        </button>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat === 'All' ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(cat === 'All' && !filterCategory) || filterCategory === cat
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Search size={48} className="text-gray-300 mb-4" />
            <p className="text-[#1A1A1A] font-medium">No results found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date}>
                <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 sticky top-0 bg-white py-2">{date}</h3>
                <div className="space-y-4">
                  {dayTransactions.map((transaction) => (
                    <div key={transaction.id} className="relative group flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                          }`}>
                          <span className="text-lg font-bold">
                            {transaction.category.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#1A1A1A] font-medium truncate">{transaction.note}</p>
                          <p className="text-xs text-gray-400 font-medium">{transaction.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${transaction.type === 'expense' ? 'text-[#1A1A1A]' : 'text-[#10B981]'}`}>
                          {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) {
                              onDelete(transaction.id);
                            }
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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

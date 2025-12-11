import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, IndianRupee, Calendar, FileText, AlertCircle, Plus, Wallet } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import CategoryChip from './CategoryChip';
import Card from './Card';
import { Transaction } from '../App';

type AddExpenseScreenProps = {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onBack: () => void;
};

export default function AddExpenseScreen({ onSave, onBack }: AddExpenseScreenProps) {
  const [amount, setAmount] = useState('');
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'expense' | 'budget'>('expense');
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Others', 'Entertainment', 'Health', 'Education'];

  // Smart Feature: Auto-focus amount input on mount
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: { amount?: string; date?: string } = {};

    // Validate amount
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(amount) > 10000000) {
      newErrors.amount = 'Amount seems too large';
    }

    // Validate date
    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        newErrors.date = 'Cannot select future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    onSave({
      amount: parseFloat(amount),
      category: type === 'budget' ? 'Budget' : category,
      note: note || `${type === 'budget' ? 'Budget Added' : category}`,
      date,
      type
    });

    // Reset form
    setAmount('');
    setCategory('Food');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setErrors({});

    onBack();
  };

  return (
    <div className="h-full flex flex-col bg-[#F6F8FF]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-[#1A1A1A]" />
          </button>
          <h1 className="text-[#1A1A1A] text-xl font-bold">Add New</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-24">

        {/* Type Toggle - Smart Redesign */}
        <div className="bg-white p-1 rounded-2xl flex shadow-sm border border-gray-100">
          <button
            onClick={() => setType('expense')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${type === 'expense'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <div className="w-2 h-2 rounded-full bg-white opacity-50" />
            Expense
          </button>
          <button
            onClick={() => {
              setType('budget');
              // Smart interaction: Reset category when switching to budget
              setCategory('Budget');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${type === 'budget'
              ? 'bg-[#10B981] text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Wallet size={16} />
            Add Budget
          </button>
        </div>

        {/* Amount Input - Redesigned for focus */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 text-center">
          <label className="block mb-2 text-gray-500 text-sm font-medium uppercase tracking-wide">
            Enter Amount
          </label>
          <div className="relative flex items-center justify-center">
            <span className={`text-4xl font-bold mr-1 ${type === 'expense' ? 'text-[#FF6B6B]' : 'text-[#10B981]'}`}>₹</span>
            <input
              ref={amountInputRef}
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              placeholder="0"
              className={`w-full max-w-[200px] text-5xl font-bold bg-transparent text-center focus:outline-none placeholder-gray-300 ${type === 'expense' ? 'text-[#1A1A1A]' : 'text-[#10B981]'
                }`}
              min="0"
              inputMode="decimal"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-2 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category Selection - Only for Expenses */}
        {type === 'expense' && (
          <div className="space-y-3">
            <label className="text-[#1A1A1A] font-semibold ml-1">Category</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${category === cat
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 space-y-4">
          {/* Date */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent font-medium text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 mx-2" />

          {/* Note */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium block">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a remark..."
                className="w-full bg-transparent font-medium text-[#1A1A1A] placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Floating Style for Mobile */}
      <div className="absolute bottom-6 left-0 right-0 px-6 max-w-[420px] mx-auto z-20">
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleSave}
          disabled={!amount}
          className="shadow-xl shadow-blue-500/20"
        >
          {type === 'expense' ? 'Add Expense' : 'Add to Budget'}
        </Button>
      </div>
    </div>
  );
}

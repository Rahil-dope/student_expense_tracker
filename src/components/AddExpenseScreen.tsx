import { useState } from 'react';
import { ArrowLeft, IndianRupee, Calendar, FileText, AlertCircle } from 'lucide-react';
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
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Others'];

  const validate = (): boolean => {
    const newErrors: { amount?: string; date?: string } = {};

    // Validate amount
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(amount) > 1000000) {
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
      category: type === 'income' ? 'Income' : category,
      note: note || `${type === 'income' ? 'Income' : category} transaction`,
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
          <h1 className="text-[#1A1A1A] text-2xl font-semibold">Add Transaction</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-8">
        {/* Type Selector */}
        <Card>
          <div className="flex gap-3">
            <button
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-[12px] font-medium transition-all ${type === 'expense'
                  ? 'bg-[#2F80ED] text-white shadow-lg'
                  : 'bg-[#F6F8FF] text-[#6B7280] hover:bg-[#EEF2FF]'
                }`}
            >
              Expense
            </button>
            <button
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-[12px] font-medium transition-all ${type === 'income'
                  ? 'bg-[#10B981] text-white shadow-lg'
                  : 'bg-[#F6F8FF] text-[#6B7280] hover:bg-[#EEF2FF]'
                }`}
            >
              Income
            </button>
          </div>
        </Card>

        {/* Amount Input */}
        <Card>
          <label className="block mb-3 text-[#6B7280] font-medium">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F80ED]">
              <IndianRupee size={28} />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              placeholder="0.00"
              className={`w-full pl-16 pr-4 py-4 text-3xl font-semibold bg-[#F6F8FF] rounded-[12px] border-2 transition-colors ${errors.amount
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-transparent focus:border-[#2F80ED]'
                } focus:outline-none`}
              min="0"
              step="0.01"
            />
          </div>
          {errors.amount && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{errors.amount}</span>
            </div>
          )}
        </Card>

        {/* Category Selection */}
        {type === 'expense' && (
          <Card>
            <label className="block mb-3 text-[#6B7280] font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <CategoryChip
                  key={cat}
                  category={cat}
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Date Input */}
        <Card>
          <label className="block mb-3 text-[#6B7280] font-medium">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <Calendar size={20} />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: undefined });
              }}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 py-3 bg-[#F6F8FF] rounded-[12px] border-2 transition-colors ${errors.date
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-transparent focus:border-[#2F80ED]'
                } focus:outline-none`}
            />
          </div>
          {errors.date && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{errors.date}</span>
            </div>
          )}
        </Card>

        {/* Note Input */}
        <Card>
          <Input
            label="Note (Optional)"
            value={note}
            onChange={setNote}
            placeholder="Add a note..."
            icon={<FileText size={20} />}
            multiline
          />
        </Card>
      </div>

      {/* Save Button */}
      <div className="px-6 pb-8 pt-4 bg-gradient-to-t from-white to-transparent">
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleSave}
        >
          Save Transaction
        </Button>
      </div>
    </div>
  );
}

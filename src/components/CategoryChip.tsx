import React from 'react';
import { ShoppingBag, Utensils, Bus, Home, MoreHorizontal, DollarSign } from 'lucide-react';

type CategoryChipProps = {
  category: string;
  active?: boolean;
  onClick?: () => void;
  small?: boolean;
};

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Food: { 
    icon: <Utensils size={16} />, 
    color: '#F59E0B', 
    bg: '#FEF3C7' 
  },
  Travel: { 
    icon: <Bus size={16} />, 
    color: '#8B5CF6', 
    bg: '#EDE9FE' 
  },
  Rent: { 
    icon: <Home size={16} />, 
    color: '#EC4899', 
    bg: '#FCE7F3' 
  },
  Shopping: { 
    icon: <ShoppingBag size={16} />, 
    color: '#10B981', 
    bg: '#D1FAE5' 
  },
  Others: { 
    icon: <MoreHorizontal size={16} />, 
    color: '#6B7280', 
    bg: '#F3F4F6' 
  },
  Income: { 
    icon: <DollarSign size={16} />, 
    color: '#10B981', 
    bg: '#D1FAE5' 
  }
};

export default function CategoryChip({ category, active = false, onClick, small = false }: CategoryChipProps) {
  const config = categoryConfig[category] || categoryConfig.Others;
  
  const sizeClass = small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2';
  const activeClass = active ? 'ring-2 ring-[#2F80ED] ring-offset-2' : '';

  return (
    <button
      onClick={onClick}
      style={{ 
        backgroundColor: config.bg,
        color: config.color
      }}
      className={`rounded-[12px] flex items-center gap-2 transition-all whitespace-nowrap ${sizeClass} ${activeClass} ${onClick ? 'hover:scale-105 active:scale-95' : ''}`}
    >
      {config.icon}
      <span>{category}</span>
    </button>
  );
}

export { categoryConfig };

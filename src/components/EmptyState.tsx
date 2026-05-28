import { Leaf, ShoppingCart, MessageSquare, Gavel, ClipboardCheck, Users, Search, Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'leaf' | 'cart' | 'message' | 'gavel' | 'clipboard' | 'users' | 'search' | 'package';
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

const icons = {
  leaf: Leaf,
  cart: ShoppingCart,
  message: MessageSquare,
  gavel: Gavel,
  clipboard: ClipboardCheck,
  users: Users,
  search: Search,
  package: Package,
};

export default function EmptyState({ icon = 'leaf', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 active:scale-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

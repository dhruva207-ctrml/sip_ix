import { User, Tractor, Store, ShieldCheck } from 'lucide-react';
import { useApp } from '../store';
import type { UserRole } from '../types';

const roles: { key: UserRole; label: string; icon: typeof User }[] = [
  { key: 'consumer', label: 'Consumer', icon: User },
  { key: 'farmer', label: 'Farmer', icon: Tractor },
  { key: 'retailer', label: 'Retailer', icon: Store },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
];

export default function RoleSwitcher() {
  const { state, dispatch } = useApp();

  return (
    <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5">
      {roles.map(({ key, label, icon: Icon }) => {
        const isActive = state.currentRole === key;
        return (
          <button
            key={key}
            onClick={() => dispatch({ type: 'SET_ROLE', payload: key })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { LayoutDashboard, ShoppingBag, ClipboardList, Gavel, MessageSquare, ClipboardCheck, Users, UserCircle } from 'lucide-react';
import { useApp } from '../store';
import type { UserRole } from '../types';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'products', label: 'Products', icon: ShoppingBag, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'orders', label: 'Orders', icon: ClipboardList, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'auctions', label: 'Auctions', icon: Gavel, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'messages', label: 'Messages', icon: MessageSquare, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'quality', label: 'Quality Reports', icon: ClipboardCheck, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'community', label: 'Community', icon: Users, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
  { key: 'profile', label: 'Profile', icon: UserCircle, roles: ['consumer', 'farmer', 'retailer', 'admin'] },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const filteredItems = navItems.filter(item => item.roles.includes(state.currentRole));

  const unreadCount = state.conversations.reduce((sum, c) => {
    if (c.participantIds.includes(state.currentUser.id) && c.unreadCount > 0) return sum + c.unreadCount;
    return sum;
  }, 0);

  return (
    <aside className={`
      fixed left-0 top-16 bottom-0 w-72 lg:w-60 bg-white border-r border-slate-100 z-[90]
      transition-transform duration-300 lg:translate-x-0
      ${state.ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <nav className="p-4 space-y-1">
        {filteredItems.map(item => {
          const isActive = state.currentSection === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => {
                dispatch({ type: 'SET_SECTION', payload: item.key });
                dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative group ${
                isActive
                  ? 'bg-gradient-to-tr from-emerald-50 to-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-emerald-500 rounded-r-full shadow-sm" />
              )}
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left pl-1">{item.label}</span>
              {item.key === 'messages' && unreadCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile sidebar overlay */}
      {state.ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[80] lg:hidden"
          onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
          aria-hidden="true"
        />
      )}
    </aside>
  );
}

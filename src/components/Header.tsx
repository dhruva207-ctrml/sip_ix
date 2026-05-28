import { Bell, ShoppingCart, Menu, Leaf } from 'lucide-react';
import { useApp } from '../store';
import { useEffect, useState } from 'react';
import RoleSwitcher from './RoleSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const { state, dispatch } = useApp();
  const unreadNotifs = state.notifications.filter(n => !n.read && n.userId === state.currentUser.id).length;
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const roleColors: Record<string, string> = {
    consumer: 'bg-emerald-50 text-emerald-700',
    farmer: 'bg-amber-50 text-amber-700',
    retailer: 'bg-sky-50 text-sky-700',
    admin: 'bg-violet-50 text-violet-700',
  };

  return (
    <header className={`site-header fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-[100] flex items-center px-4 lg:px-6 ${elevated ? 'elevated' : ''}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-slate-600" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-emerald-700 to-emerald-500 shadow-md">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-slate-800 leading-none">AgroLink</h1>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">From local farms to your table</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <RoleSwitcher />
      </div>

      <div className="hidden lg:flex items-center gap-3 mr-4">
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2">
        {state.currentRole !== 'admin' && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ShoppingCart className="w-5 h-5 text-slate-600" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
        )}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label={`Notifications, ${unreadNotifs} unread`}>
          <Bell className="w-5 h-5 text-slate-600" aria-hidden="true" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" aria-hidden="true" />
          )}
        </button>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${roleColors[state.currentRole]}`}>
          <div className="avatar-sm bg-white/60 flex items-center justify-center text-[10px] font-bold">
            {state.currentUser.avatar}
          </div>
          <span className="hidden md:inline">{state.currentUser.name}</span>
        </div>
      </div>
    </header>
  );
}

import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../store';
import { AnimatePresence, motion } from 'framer-motion';

export default function ToastContainer() {
  const { state } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false}>
        {state.toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: { id: string; message: string; type: string } }) {
  const { dispatch } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', payload: toast.id });
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  const config: Record<string, { icon: typeof CheckCircle; bar: string }> = {
    success: { icon: CheckCircle, bar: 'bg-green-500' },
    warning: { icon: AlertTriangle, bar: 'bg-harvest-500' },
    error: { icon: XCircle, bar: 'bg-error-500' },
    info: { icon: Info, bar: 'bg-blue-500' },
  };

  const { icon: Icon, bar } = config[toast.type] || config.success;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="toast"
    >
      <div className={`w-1 self-stretch rounded-full ${bar}`} />
      <div className="flex-1 flex items-center gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-error-500' : toast.type === 'warning' ? 'text-amber-600' : 'text-blue-500'}`} />
        <p className="text-sm text-slate-700">{toast.message}</p>
      </div>
      <button
        onClick={() => dispatch({ type: 'DISMISS_TOAST', payload: toast.id })}
        className="p-1 hover:bg-slate-100 rounded-full"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </motion.div>
  );
}

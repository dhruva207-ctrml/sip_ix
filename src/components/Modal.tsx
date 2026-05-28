import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '../store';
import { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ children, maxWidth = 'max-w-lg' }: ModalProps) {
  const { dispatch } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE_MODAL' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
        role="presentation"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.2, 0.9, 0.27, 1] }}
          className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto card`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface BadgeProps {
  variant: 'verified' | 'preorder' | 'fresh' | 'quality' | 'organic' | 'auction-live' | 'auction-closing' | 'auction-ended' | string;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<string, string> = {
  verified: 'bg-green-100 text-green-700 border border-green-200',
  quality: 'bg-green-50 text-green-600 border border-green-200',
  preorder: 'bg-warm-100 text-harvest-500 border border-warm-200',
  fresh: 'bg-green-50 text-green-600 border border-green-200',
  organic: 'bg-green-50 text-green-700 border border-green-200',
  'auction-live': 'bg-green-100 text-green-700 border border-green-200',
  'auction-closing': 'bg-warm-100 text-harvest-500 border border-warm-200',
  'auction-ended': 'bg-slate-100 text-slate-500 border border-slate-200',
  placed: 'bg-slate-100 text-slate-600 border border-slate-200',
  accepted: 'bg-blue-50 text-blue-700 border border-blue-100',
  packed: 'bg-warm-50 text-harvest-500 border border-warm-200',
  dispatched: 'bg-purple-50 text-purple-700 border border-purple-100',
  'out_for_delivery': 'bg-blue-50 text-blue-700 border border-blue-100',
  delivered: 'bg-green-100 text-green-700 border border-green-200',
  cancelled: 'bg-error-50 text-error-500 border border-error-100',
  pending: 'bg-warm-100 text-harvest-500 border border-warm-200',
  scheduled: 'bg-blue-50 text-blue-700 border border-blue-100',
  rejected: 'bg-error-50 text-error-500 border border-error-100',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  const style = variants[variant] || 'bg-slate-100 text-slate-600 border border-slate-200';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ${style} ${className}`}>
      {children}
    </span>
  );
}

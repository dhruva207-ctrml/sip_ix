import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, icon: Icon, iconColor = 'text-green-600', iconBg = 'bg-green-50', trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all duration-200 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-slate-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-[28px] font-bold text-slate-800 leading-tight">{value}</div>
      <div className="text-xs font-medium text-slate-400 mt-1 tracking-wide uppercase">{label}</div>
    </div>
  );
}

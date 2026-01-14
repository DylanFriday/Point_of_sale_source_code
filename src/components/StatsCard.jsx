import React from 'react';

export default function StatsCard({ title, value, hint, icon: Icon }) {
  return (
    <div className="glass-card flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{title}</p>
        {Icon ? (
          <span className="rounded-full bg-white/10 p-2 text-slate-100">
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-white">{value}</p>
        {hint ? <p className="mt-2 text-xs text-slate-300">{hint}</p> : null}
      </div>
    </div>
  );
}

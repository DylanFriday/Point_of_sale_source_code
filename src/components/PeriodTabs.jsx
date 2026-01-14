import React from 'react';

const options = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' }
];

export default function PeriodTabs({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            value === option.id
              ? 'bg-white/20 text-white'
              : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

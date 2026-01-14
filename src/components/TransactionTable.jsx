import React from 'react';
import { formatCurrency } from '../utils/format.js';

export default function TransactionTable({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-slate-300">
        No transactions yet. Add your first sale to start tracking.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/10 text-xs uppercase tracking-[0.2em] text-slate-300">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Unit</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-white/5">
              <td className="px-4 py-4 text-slate-200">{tx.date}</td>
              <td className="px-4 py-4 text-white">{tx.productName}</td>
              <td className="px-4 py-4 text-slate-300">{tx.category}</td>
              <td className="px-4 py-4 text-right text-slate-300">
                {formatCurrency(tx.unitPrice)}
              </td>
              <td className="px-4 py-4 text-right text-slate-200">{tx.quantity}</td>
              <td className="px-4 py-4 text-right font-semibold text-white">
                {formatCurrency(tx.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

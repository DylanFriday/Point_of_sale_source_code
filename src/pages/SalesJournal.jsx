import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ClipboardList, PlusCircle, RotateCcw, Trash2 } from 'lucide-react';
import SectionCard from '../components/SectionCard.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import { formatCurrency } from '../utils/format.js';

const getToday = () => new Date().toISOString().slice(0, 10);

export default function SalesJournal() {
  const { transactions, products, addTransaction, removeTransaction } = useOutletContext();
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(getToday());
  const [pendingDelete, setPendingDelete] = useState(null);
  const hasProducts = products.length > 0;

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  const total = (selectedProduct?.price || 0) * Number(quantity || 0);
  const unitPrice = selectedProduct?.price || 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const transaction = {
      id: `tx-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      unitPrice: selectedProduct.price,
      quantity: Number(quantity),
      date,
      total,
    };

    addTransaction(transaction);
    setQuantity(1);
    setDate(getToday());
  };

  const handleReset = () => {
    setProductId(products[0]?.id || '');
    setQuantity(1);
    setDate(getToday());
  };

  return (
    <div className="grid gap-8">
      <SectionCard title="Record New Sale">
        {!hasProducts ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-slate-300">
            No products found. Add items to `src/data/pos_item.json` to start
            recording sales.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Select an item, set the quantity, and confirm the sale date.
              </p>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-300">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  className="input-field"
                  required
                >
                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      className="text-slate-900"
                    >
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-400">
                  Category: {selectedProduct?.category || 'Uncategorized'}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-300">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    Sale summary
                  </p>
                  <p className="mt-2 font-display text-lg text-white">
                    {selectedProduct?.name || 'Select a product'}
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">Unit price</span>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(unitPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">Quantity</span>
                    <span className="text-sm font-semibold text-white">{quantity || 0}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <span className="text-sm text-slate-200">Total</span>
                    <span className="text-base font-semibold text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="button-muted flex-1"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button type="submit" className="button-secondary flex-1">
                  <PlusCircle size={18} />
                  Record Sale
                </button>
              </div>
            </div>
          </form>
        )}
      </SectionCard>

      <SectionCard
        title="Transactions"
        action={
          <span className="text-sm text-slate-300">
            {transactions.length} record(s)
          </span>
        }
      >
        <TransactionTable transactions={transactions} onDelete={setPendingDelete} />
      </SectionCard>

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-10">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-coral-400">
                <Trash2 size={18} />
              </span>
              <div>
                <p className="font-display text-lg text-white">Delete transaction?</p>
                <p className="text-sm text-slate-300">
                  This will remove {pendingDelete.productName} from the journal.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="button-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  removeTransaction?.(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="button-secondary"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

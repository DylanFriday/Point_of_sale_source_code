import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './components/RootLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SalesJournal from './pages/SalesJournal.jsx';
import productsData from './data/pos_item.json';
import { loadTransactions, saveTransactions } from './utils/storage.js';

const normalizeProducts = (products) =>
  products
    .filter((item) => item && (item.itemName || item.name || item.title))
    .map((item, index) => ({
      id: item.id ?? `item-${index}`,
      name: item.itemName ?? item.name ?? item.title ?? `Item ${index + 1}`,
      category: item.category ?? 'Uncategorized',
      price: Number(item.unitPrice ?? item.price ?? 0),
      description: item.description ?? ''
    }));

export default function App() {
  const [transactions, setTransactions] = useState([]);

  const products = useMemo(() => normalizeProducts(productsData || []), []);

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const removeTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RootLayout
            transactions={transactions}
            products={products}
            addTransaction={addTransaction}
            removeTransaction={removeTransaction}
          />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="journal" element={<SalesJournal />} />
      </Route>
    </Routes>
  );
}

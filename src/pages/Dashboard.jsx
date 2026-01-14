import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Layers, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import StatsCard from '../components/StatsCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import PeriodTabs from '../components/PeriodTabs.jsx';
import { formatCurrency, formatDateLabel, formatMonthLabel } from '../utils/format.js';

const PIE_COLORS = ['#60a5fa', '#fb923c', '#34d399', '#f472b6', '#facc15'];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const formatShortDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const startOfWeek = (date) => {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
};

const isWithinDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00`);
  const today = startOfDay(new Date());
  const diff = today - startOfDay(date);
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
};

const getPeriodTransactions = (transactions, period) => {
  if (period === 'daily') {
    const today = new Date().toISOString().slice(0, 10);
    return transactions.filter((tx) => tx.date === today);
  }
  if (period === 'weekly') {
    return transactions.filter((tx) => isWithinDays(tx.date, 7));
  }
  return transactions.filter((tx) => isWithinDays(tx.date, 30));
};

const buildTrendSeries = (transactions, period) => {
  const today = startOfDay(new Date());

  if (period === 'daily') {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const total = transactions
        .filter((tx) => tx.date === key)
        .reduce((sum, tx) => sum + Number(tx.total || 0), 0);
      return { label: formatDateLabel(key), total };
    });
  }

  if (period === 'weekly') {
    return Array.from({ length: 6 }).map((_, index) => {
      const weekStart = startOfWeek(new Date(today));
      weekStart.setDate(weekStart.getDate() - (5 - index) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const total = transactions
        .filter((tx) => {
          const txDate = new Date(`${tx.date}T00:00:00`);
          return txDate >= weekStart && txDate <= weekEnd;
        })
        .reduce((sum, tx) => sum + Number(tx.total || 0), 0);
      return {
        label: `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`,
        total
      };
    });
  }

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const total = transactions
      .filter((tx) => {
        const txDate = new Date(`${tx.date}T00:00:00`);
        return txDate.getMonth() === month && txDate.getFullYear() === year;
      })
      .reduce((sum, tx) => sum + Number(tx.total || 0), 0);
    return { label: formatMonthLabel(date), total };
  });
};

export default function Dashboard() {
  const { transactions } = useOutletContext();
  const [period, setPeriod] = useState('weekly');

  const totalSales = useMemo(
    () => transactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0),
    [transactions]
  );

  const periodTransactions = useMemo(
    () => getPeriodTransactions(transactions, period),
    [transactions, period]
  );

  const periodSales = useMemo(
    () => periodTransactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0),
    [periodTransactions]
  );

  const salesByProduct = useMemo(() => {
    const map = new Map();
    periodTransactions.forEach((tx) => {
      const current = map.get(tx.productName) || { name: tx.productName, total: 0 };
      current.total += Number(tx.total || 0);
      map.set(tx.productName, current);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [periodTransactions]);

  const topItems = useMemo(() => salesByProduct.slice(0, 5), [salesByProduct]);
  const topProductBars = useMemo(() => salesByProduct.slice(0, 6), [salesByProduct]);

  const categoryData = useMemo(() => {
    const map = new Map();
    periodTransactions.forEach((tx) => {
      const key = tx.category || 'Uncategorized';
      map.set(key, (map.get(key) || 0) + Number(tx.total || 0));
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [periodTransactions]);

  const lineData = useMemo(() => {
    return buildTrendSeries(transactions, period);
  }, [transactions, period]);

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          hint="All-time gross revenue"
          icon={DollarSign}
        />
        <StatsCard
          title={`${period.charAt(0).toUpperCase() + period.slice(1)} Summary`}
          value={formatCurrency(periodSales)}
          hint={`${periodTransactions.length} transactions tracked`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Products"
          value={`${salesByProduct.length}`}
          hint="Items with recorded sales"
          icon={Layers}
        />
      </div>

      <SectionCard
        title="Sales Summary"
        action={<PeriodTabs value={period} onChange={setPeriod} />}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">Sales trend</p>
              <span className="chip">
                {period.charAt(0).toUpperCase() + period.slice(1)} view
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <XAxis dataKey="label" stroke="#cbd5f5" />
                  <YAxis stroke="#cbd5f5" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-300">Sales by category</p>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryData.map((item, index) => (
                <span key={item.name} className="chip">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Product Performance">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Sales by product</p>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={topProductBars}>
                  <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke="#cbd5f5" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="total" fill="#60a5fa" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-300">Top 5 selling items</p>
            <div className="space-y-3">
              {topItems.length ? (
                topItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="text-xs text-slate-300">Gross sales</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-300">No top items yet.</p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

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
  Sector,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import StatsCard from '../components/StatsCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import PeriodTabs from '../components/PeriodTabs.jsx';
import { formatCurrency, formatDateLabel, formatMonthLabel } from '../utils/format.js';

const PIE_COLORS = ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#34d399'];
const BAR_COLORS = ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#34d399'];
const TOOLTIP_STYLE = {
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  color: '#f8fafc'
};
const TOOLTIP_LABEL_STYLE = { color: '#f8fafc' };
const TOOLTIP_ITEM_STYLE = { color: '#f8fafc' };

const renderActiveSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={16}
    />
  );
};

const renderGlowDot = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={6} fill="rgba(56, 189, 248, 0.2)" />
    <circle cx={cx} cy={cy} r={3} fill="#e2f5ff" />
  </g>
);

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
  const [activeCategory, setActiveCategory] = useState(null);

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
  const categoryTotal = useMemo(
    () => categoryData.reduce((sum, item) => sum + item.value, 0),
    [categoryData]
  );
  const activeCategoryData =
    activeCategory !== null ? categoryData[activeCategory] : null;
  const activeCategoryPercent = activeCategoryData && categoryTotal
    ? Math.round((activeCategoryData.value / categoryTotal) * 100)
    : null;

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
                  <defs>
                    <linearGradient id="lineNeon" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" />
                    </filter>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="3 6" />
                  <XAxis dataKey="label" stroke="#cbd5f5" />
                  <YAxis stroke="#cbd5f5" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="url(#lineNeon)"
                    strokeWidth={3}
                    dot={renderGlowDot}
                    activeDot={{ r: 6 }}
                    filter="url(#lineGlow)"
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
                  <defs>
                    <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#38bdf8" />
                    </filter>
                  </defs>
                  <Pie
                    data={[{ name: 'track', value: categoryTotal || 1 }]}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={96}
                    fill="rgba(255, 255, 255, 0.06)"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={10}
                    cornerRadius={16}
                    activeIndex={activeCategory ?? undefined}
                    activeShape={renderActiveSlice}
                    onMouseLeave={() => setActiveCategory(null)}
                    onMouseEnter={(_, index) => setActiveCategory(index)}
                    stroke="transparent"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        filter="url(#pieGlow)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <text
                    x="50%"
                    y="48%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-100 text-base font-semibold"
                  >
                    {activeCategoryData
                      ? `${activeCategoryPercent ?? 0}%`
                      : formatCurrency(categoryTotal)}
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-400 text-xs"
                  >
                    {activeCategoryData ? activeCategoryData.name : 'Total'}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((item, index) => {
                const percent = categoryTotal
                  ? Math.round((item.value / categoryTotal) * 100)
                  : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <span className="text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-slate-300">{percent}%</span>
                  </div>
                );
              })}
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
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="3 6" />
                  <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke="#cbd5f5" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Bar
                    dataKey="total"
                    radius={[14, 14, 0, 0]}
                  >
                    {topProductBars.map((entry, index) => (
                      <Cell
                        key={`bar-${entry.name}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
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

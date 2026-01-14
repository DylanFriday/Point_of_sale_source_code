import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, NotebookPen, Sparkles } from 'lucide-react';

export default function RootLayout({ transactions, products, addTransaction }) {
  return (
    <div className="min-h-screen px-6 py-10 md:px-12">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-400/20 text-ocean-300">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">MyanSell</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}`
            }
          >
            <BarChart3 size={18} />
            Dashboard
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}`
            }
          >
            <NotebookPen size={18} />
            Sales Journal
          </NavLink>
        </nav>
      </header>

      <Outlet context={{ transactions, products, addTransaction }} />
    </div>
  );
}

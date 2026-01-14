import React from 'react';

export default function SectionCard({ title, action, children }) {
  return (
    <section className="glass-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

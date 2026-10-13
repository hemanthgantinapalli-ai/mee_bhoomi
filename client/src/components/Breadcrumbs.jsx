import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items, onHomeClick }) {
  return (
    <div className="breadcrumb-bar no-print">
      <button
        onClick={onHomeClick}
        style={{
          background: 'none',
          border: 'none',
          color: '#145808',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 600,
          fontSize: '12px',
          padding: 0
        }}
      >
        <Home size={12} />
        <span>హోమ్ (Home)</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} />
          <span style={{
            color: index === items.length - 1 ? '#0f172a' : '#64748b',
            fontWeight: index === items.length - 1 ? 700 : 500
          }}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

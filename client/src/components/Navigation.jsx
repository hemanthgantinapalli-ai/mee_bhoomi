import React from 'react';
import { Home, FileText, Layers, Map, ShieldCheck, BookOpen, Clock, Droplets, ChevronDown } from 'lucide-react';

export default function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'హోమ్ (Home)', icon: Home },
    { id: 'adangal', label: 'మీ అడంగల్ (Your Adangal)', icon: FileText },
    { id: 'village-adangal', label: 'గ్రామ అడంగల్ (Village Adangal)', icon: Layers },
    { id: '1b', label: 'మీ 1-బి (Your 1-B)', icon: FileText },
    { id: 'village-1b', label: 'గ్రామ 1-బి (Village 1-B)', icon: Layers },
    { id: 'lp-map', label: 'ఎల్.పీ. మ్యాప్ / FMB', icon: Map },
    { id: 'aadhaar-status', label: 'ఆధార్ లింకింగ్ (Aadhaar Link)', icon: ShieldCheck },
    { id: 'passbook', label: 'పాస్‌బుక్ (E-Passbook)', icon: BookOpen },
    { id: 'mutation-status', label: 'దరఖాస్తు స్థితి (Mutation Status)', icon: Clock },
    { id: 'water-tax', label: 'నీటి పన్ను (Water Tax)', icon: Droplets }
  ];

  return (
    <nav className="service-menu no-print" aria-label="Land record services">
      <details>
        <summary className="service-menu-toggle" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700 }}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>☰</span>
          <span>Menu</span>
        </summary>
        <div className="service-menu-panel">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                className={`service-menu-item ${isActive ? 'active' : ''}`}
                onClick={(event) => {
                  onTabChange(tab.id);
                  event.currentTarget.closest('details').open = false;
                }}
              >
                <IconComponent size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </details>
    </nav>
  );
}

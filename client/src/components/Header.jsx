import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Navigation from './Navigation';

export default function Header({ onTabChange, activeTab, currentUser, onLogout }) {
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  const changeFontSize = (delta) => {
    let next = delta === 0 ? 1 : Math.min(Math.max(fontSizeMultiplier + delta, 0.85), 1.25);
    setFontSizeMultiplier(next);
    document.documentElement.style.setProperty('--font-size-multiplier', next);
  };

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme ? 'dark' : 'light');
  };

  const maskedPhone = currentUser?.masked ||
    (currentUser?.mobile
      ? `${currentUser.mobile.slice(0, 2)}******${currentUser.mobile.slice(-2)}`
      : '86******04');

  return (
    <header className="no-print">
      {/* ── Top Accessibility Toolbar ──────────────────────── */}
      <div className="toolbar-top">
        {/* Left: Government link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="https://www.ap.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="toolbar-left-link"
          >
            <img
              src="/images/andhra-pradesh-emblem-22.svg"
              width="21"
              height="22"
              alt="AP Emblem"
              style={{ display: 'inline-block', flexShrink: 0 }}
            />
            <span>Government of Andhra Pradesh</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Right: Accessibility controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Skip to content */}
          <button
            className="toolbar-btn"
            title="Skip to main content"
            onClick={() => document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Skip to main content"
          >
            {/* ⤓ arrow icon matching official */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 3v13M7 11l5 5 5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="toolbar-sep">|</span>

          <button
            className={`toolbar-btn ${fontSizeMultiplier < 1 ? 'active' : ''}`}
            onClick={() => changeFontSize(-0.1)}
            title="Decrease font size"
            aria-label="Decrease font size"
            style={{ fontSize: '11px', minWidth: '22px' }}
          >
            -A
          </button>
          <button
            className={`toolbar-btn ${fontSizeMultiplier === 1 ? 'active' : ''}`}
            onClick={() => changeFontSize(0)}
            title="Normal font size"
            aria-label="Normal font size"
            style={{ fontSize: '13px', minWidth: '22px' }}
          >
            A
          </button>
          <button
            className={`toolbar-btn ${fontSizeMultiplier > 1 ? 'active' : ''}`}
            onClick={() => changeFontSize(0.1)}
            title="Increase font size"
            aria-label="Increase font size"
            style={{ fontSize: '14px', minWidth: '22px' }}
          >
            A+
          </button>

          <span className="toolbar-sep">|</span>

          {/* Accessibility wheelchair icon matching official */}
          <button
            className="toolbar-btn"
            onClick={toggleTheme}
            title={darkMode ? 'Switch to light mode' : 'Accessibility & Contrast'}
            aria-label="Toggle accessibility contrast"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="4" r="2" />
              <path d="M10 8h4l2 5h3v2h-4l-1-3-2 8H9l-1-7H5V11h4z" />
              <path d="M9 21a5 5 0 0 1-4-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main Branding Header ────────────────────────────── */}
      <div className="branding-header">
        {/* Left: Chief Minister portrait */}
        <div className="leader-portrait">
          <img
            src="/images/CM.png"
            alt="Sri Nara Chandrababu Naidu"
            style={{ maxHeight: '115px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Center: AP Emblem + Mee Bhoomi title */}
        <div className="header-center-block">
          <img
            src="/images/andhra-pradesh-emblem-light.svg"
            alt="Andhra Pradesh State Emblem"
            className="header-emblem"
          />
          <div className="header-title-block">
            <img
              src="/images/mee-bhoomi-img.svg"
              alt="మీ భూమి – Mee Bhoomi"
              className="header-meebhoomi-logo"
            />
            <p className="header-subtitle">భూమి రికార్డుల ప్రజా పోర్టల్</p>
            <p className="header-dept">ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రభుత్వం - రెవెన్యూ శాఖ.</p>
          </div>
        </div>

        {/* Right: Revenue Minister portrait */}
        <div className="leader-portrait">
          <img
            src="/images/Minister11.png"
            alt="Sri Anagani Satya Prasad"
            style={{ maxHeight: '115px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* ── Green Action Bar ─────────────────────────────────── */}
      {activeTab === 'home' && !currentUser ? (
        <div className="green-action-bar portal-home-bar" style={{
          backgroundColor: '#0a4a06',
          padding: '0 24px',
          minHeight: '34px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left: Direct quick links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <a
              href="https://vswsonline.ap.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}
              className="portal-quick-link"
            >
              --&gt; Click Here to Pay Water Tax
            </a>
            <a
              href="https://aporcms.ap.gov.in/Login/CauseList"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}
              className="portal-quick-link"
            >
              --&gt; ORCMS Cause List
            </a>
            <a
              href="https://meebhoomi.ap.gov.in/VAdangal/VigilanceLogin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}
              className="portal-quick-link"
            >
              --&gt; Vigilance Login
            </a>
          </div>

          {/* Right: Blockchain Link */}
          <div>
            <a
              href="https://meebhoomiblockchain.ap.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#a3e635',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                letterSpacing: '0.3px'
              }}
              className="blockchain-link"
            >
              MeeBhoomi Blockchain
            </a>
          </div>
        </div>
      ) : (
        <div className="green-action-bar" style={{
          backgroundColor: '#145808',
          minHeight: '36px',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left: Home icon + Menu */}
          <div className="action-bar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onTabChange('home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px',
                fontSize: '15px',
                fontWeight: 600
              }}
              title="Home"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="#145808" strokeWidth="2" />
              </svg>
            </button>

            <Navigation activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {/* Right: User Phone icon + masked number + Logout */}
          <div className="action-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#ffffff'
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{maskedPhone}</span>
            </div>

            {currentUser && (
              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  transition: 'opacity 0.2s'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

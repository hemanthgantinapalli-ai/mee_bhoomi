import React from 'react';
import { PhoneCall } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print" style={{ marginTop: 'auto' }}>

      {/* ── ACB Toll Free Helpline Bar ── */}
      {/* Official: dark red #8b0000, Telugu text with orange badge for 14400 */}
      <div className="toll-free-bar">
        <span>ఎవరైన లంచం అడిగిన అవినీతికి పాల్పడిన టోల్ ఫ్రీ నంబర్</span>
        <span className="toll-free-badge">
          <PhoneCall size={13} />
          14400
        </span>
        <span>కు ఫిర్యాదు చేయండి</span>
      </div>

      {/* ── CCLA Office Address ── */}
      {/* Official: light gray-blue background #e9ecef */}
      <div className="address-bar">
        <p style={{ margin: 0 }}>
          O/o The Chief Commissioner of Land Administration, APIIC Towers,
        </p>
        <p style={{ margin: 0 }}>
          1st &amp; 3rd Floors, IT Park, Auto Nagar, Mangalagiri - 522503.
        </p>
        <p style={{ margin: 0 }}>
          e-mail:{' '}
          <a
            href="mailto:ccla-as-cmro@ap.gov.in"
            style={{ color: '#095c8c', textDecoration: 'none', fontWeight: 600 }}
          >
            ccla-as-cmro@ap.gov.in
          </a>
        </p>
      </div>

      {/* ── Copyright & NIC Credits ── */}
      {/* Official: dark #1c2430, white text, NIC link */}
      <div className="copyright-bar">
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div>
            All Copyrights Reserved to{' '}
            <strong>Department of Revenue, Government of Andhra Pradesh</strong>
          </div>
          <div>
            Designed, Developed and Hosted by{' '}
            <a
              href="https://www.nic.in/"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#ffffff', fontWeight: 700 }}
            >
              National Informatics Centre (NIC)
            </a>
          </div>
        </div>

        {/* Scroll-to-top button */}
        <button
          onClick={scrollToTop}
          title="Scroll to top"
          aria-label="Scroll to top"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#145808',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
            transition: 'background-color 0.2s',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          ↑
        </button>
      </div>
    </footer>
  );
}

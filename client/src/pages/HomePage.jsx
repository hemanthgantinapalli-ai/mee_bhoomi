import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi Main Page
// State 1: Pre-login Landing Page (Paddy fields, 6 service cards, Login with mobile/OTP/captcha)
// State 2: Post-login Dashboard (/VAdangal/Index) matching official MeeBhoomi exactly!
// ─────────────────────────────────────────────────────────────────
export default function HomePage({ onSelectService, currentUser, onLoginSuccess, onLogout }) {
  const VALID_OTP = '975310';

  // Login form state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7834');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-set or refresh captcha
  const refreshCaptcha = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(randomCode);
    setCaptchaInput('');
  };

  const handleGetOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleaned = mobileNumber.trim();
    if (!cleaned || cleaned.length < 10) {
      setErrorMsg('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి (Please enter a valid 10-digit mobile number)');
      return;
    }
    setOtpSent(true);
    refreshCaptcha();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpValue || otpValue.trim() !== VALID_OTP) {
      setErrorMsg('చెల్లని OTP. దయచేసి సరైన OTP ను నమోదు చేయండి (Invalid OTP. Please enter the correct OTP.)');
      return;
    }

    if (!captchaInput || captchaInput.trim() !== captchaCode) {
      setErrorMsg('చెల్లని క్యాప్చా కోడ్ (Invalid Captcha Code)');
      return;
    }

    const citizen = {
      mobile: mobileNumber.trim(),
      masked: `${mobileNumber.trim().slice(0, 2)}******${mobileNumber.trim().slice(-2)}`,
      name: 'Pattadar Citizen',
      loginTime: new Date().toLocaleTimeString('en-IN')
    };

    onLoginSuccess(citizen);
  };

  const preLoginCards = [
    {
      id: 'mutation-transactions',
      title: 'Mutation for Transactions',
      icon: '/images/mutation-transaction.png',
      onClick: () => onSelectService('mutation-status')
    },
    {
      id: 'mutation-correction',
      title: 'Mutation for Correction',
      icon: '/images/mutation-correction.png',
      onClick: () => onSelectService('mutation-status')
    },
    {
      id: 'aadhar-seeding',
      title: 'Aadhar seeding',
      icon: '/images/aadhar-seeding.png',
      onClick: () => onSelectService('aadhaar-status')
    },
    {
      id: 'land-conversion',
      title: 'Land Conversion For Non Agriculture Purpose',
      icon: '/images/Land-conversion-purpose.png',
      onClick: () => onSelectService('adangal')
    },
    {
      id: 'water-tax-orcms',
      title: 'Click Here to Pay Water Tax\nORCMS Cause List',
      icon: null,
      onClick: () => onSelectService('water-tax')
    },
    {
      id: 'auto-mutation',
      title: 'Auto Mutation',
      icon: '/images/mutation-transaction.png',
      onClick: () => onSelectService('mutation-status')
    }
  ];

  // ═════════════════════════════════════════════════════════════════
  // IF USER IS LOGGED IN: Render /VAdangal/Index Dashboard
  // Matches user screenshot: Drone hero, 2 content cards, 3 action buttons
  // ═════════════════════════════════════════════════════════════════
  if (currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - 180px)' }}>

        {/* ── Drone Hero Section ── */}
        <section
          id="main-content"
          style={{
            position: 'relative',
            backgroundImage: "url('/images/drone-hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '480px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 0 24px'
          }}
        >
          {/* Main Dashboard Cards Overlay */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1340px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}>

            {/* ═════════════════════════════════════════════════════
                LEFT CARD: మీ దరఖాస్తు వివరముల కోసం క్లిక్ చేయండి
                Dark teal/slate background (#18413b)
                ═════════════════════════════════════════════════════ */}
            <div style={{
              flex: '1 1 380px',
              backgroundColor: '#1b3f39',
              borderRadius: '8px',
              padding: '16px 20px',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              minHeight: '220px'
            }}>
              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                marginBottom: '14px',
                fontFamily: "'Noto Sans Telugu', sans-serif",
                letterSpacing: '0.2px'
              }}>
                మీ దరఖాస్తు వివరముల కోసం క్లిక్ చేయండి
              </h3>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Farmer Photo */}
                <div style={{ flex: '0 0 115px' }}>
                  <img
                    src="/images/farmer.png"
                    alt="Farmer with land record"
                    style={{
                      width: '115px',
                      height: '135px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                    }}
                  />
                </div>

                {/* Application Links */}
                <div style={{
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '9px'
                }}>
                  <a
                    href="#mutation-status"
                    onClick={(e) => { e.preventDefault(); onSelectService('mutation-status'); }}
                    style={vadangalLinkStyle}
                  >
                    మ్యుటేషన్/L P రికార్డు సవరణలు
                  </a>
                  <a
                    href="#lp-map"
                    onClick={(e) => { e.preventDefault(); onSelectService('lp-map'); }}
                    style={vadangalLinkStyle}
                  >
                    L P రికార్డు వివరణలు
                  </a>
                  <a
                    href="#mutation-status"
                    onClick={(e) => { e.preventDefault(); onSelectService('mutation-status'); }}
                    style={vadangalLinkStyle}
                  >
                    భూ వినియోగ మార్ఫు
                  </a>
                  <a
                    href="#1b"
                    onClick={(e) => { e.preventDefault(); onSelectService('1b'); }}
                    style={vadangalLinkStyle}
                  >
                    సర్వే సంఖ్య రికార్డు సవరణలు
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); }}
                    style={vadangalLinkStyle}
                  >
                    Download RDOs-OTC Proceedings
                  </a>
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════
                CENTER CARD: మీ భూమి వివరాలకోసం క్లిక్ చేయండి
                Warm mustard/gold background (#c0841d)
                ═════════════════════════════════════════════════════ */}
            <div style={{
              flex: '1 1 420px',
              backgroundColor: '#be8016',
              borderRadius: '8px',
              padding: '16px 20px',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              minHeight: '220px'
            }}>
              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                marginBottom: '14px',
                fontFamily: "'Noto Sans Telugu', sans-serif",
                letterSpacing: '0.2px'
              }}>
                మీ భూమి వివరాలకోసం క్లిక్ చేయండి
              </h3>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Land Record Links */}
                <div style={{
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '9px'
                }}>
                  <a
                    href="#adangal"
                    onClick={(e) => { e.preventDefault(); onSelectService('adangal'); }}
                    style={vadangalLinkStyle}
                    title="ఆంధ్రప్రదేశ్ అన్ని 28 జిల్లాలు మరియు 286 మండలాలు (All 28 Districts & 286 Mandals of AP)"
                  >
                    మీ అడంగల్/గ్రామ అడంగల్
                  </a>
                  <a
                    href="#1b"
                    onClick={(e) => { e.preventDefault(); onSelectService('1b'); }}
                    style={vadangalLinkStyle}
                    title="ఆంధ్రప్రదేశ్ అన్ని 28 జిల్లాలు మరియు 286 మండలాలు (All 28 Districts & 286 Mandals of AP)"
                  >
                    మీ 1-బి/గ్రామ 1-బి
                  </a>
                  <a
                    href="#lp-map"
                    onClick={(e) => { e.preventDefault(); onSelectService('lp-map'); }}
                    style={vadangalLinkStyle}
                  >
                    మీ L.P Map/FMB/గ్రామ పటం
                  </a>
                  <a
                    href="#adangal"
                    onClick={(e) => { e.preventDefault(); onSelectService('adangal'); }}
                    style={vadangalLinkStyle}
                  >
                    ROFR అడంగల్/గ్రామ 1-బి
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); }}
                    style={vadangalLinkStyle}
                  >
                    Dispute Cases Abstract Report
                  </a>
                </div>

                {/* 3D Land Block Image */}
                <div style={{ flex: '0 0 130px', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="/images/land-3d.png"
                    alt="3D Land Parcel"
                    style={{
                      width: '130px',
                      height: '110px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════
                RIGHT SIDEBAR: 3 Action Buttons with icons
                Brown background (#b87431)
                ═════════════════════════════════════════════════════ */}
            <div style={{
              flex: '0 0 240px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {/* Button 1: ఆధార్ లింకింగ్ స్టేటస్ */}
              <button
                onClick={() => onSelectService('aadhaar-status')}
                style={vadangalActionBtnStyle}
              >
                <div style={vadangalActionIconWrapStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b87431" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="10" r="2.5" />
                    <line x1="6" y1="16" x2="11" y2="16" />
                    <line x1="14" y1="9" x2="18" y2="9" />
                    <line x1="14" y1="13" x2="18" y2="13" />
                  </svg>
                </div>
                <span>ఆధార్ లింకింగ్ స్టేటస్</span>
              </button>

              {/* Button 2: ఎలక్ట్రానిక్ పాస్ పుస్తకం డౌన్లోడ్ */}
              <button
                onClick={() => onSelectService('passbook')}
                style={vadangalActionBtnStyle}
              >
                <div style={vadangalActionIconWrapStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b87431" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                </div>
                <span>ఎలక్ట్రానిక్ పాస్ పుస్తకం డౌన్లోడ్</span>
              </button>

              {/* Button 3: గ్రామ భూవివాదముల పట్టిక */}
              <button
                onClick={() => onSelectService('village-adangal')}
                style={vadangalActionBtnStyle}
              >
                <div style={vadangalActionIconWrapStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b87431" strokeWidth="2">
                    <path d="M14 13l-4 4-6-6 4-4 6 6z" />
                    <path d="M17 10l3-3-3-3-3 3 3 3z" />
                    <line x1="14.5" y1="12.5" x2="21.5" y2="19.5" />
                  </svg>
                </div>
                <span>గ్రామ భూవివాదముల పట్టిక</span>
              </button>
            </div>

          </div>
        </section>

        {/* ── Official Red Disclaimer Line ── */}
        <section style={{
          backgroundColor: '#ffffff',
          padding: '12px 24px',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <p style={{
            margin: 0,
            fontSize: '12.5px',
            lineHeight: '1.5',
            color: '#c2410c',
            fontFamily: "'Segoe UI', Arial, sans-serif"
          }}>
            <strong style={{ color: '#dc2626' }}>Disclaimer: </strong>
            All content, data, images, and materials available on this website are protected by copyright laws and intellectual property rights. Unauthorized copying, reproduction, or display of any materials from this website on other websites or platforms is strictly prohibited. Any attempt to replicate, redistribute, or use the content without permission may result in legal action.
          </p>
        </section>

      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // STATE 1: PRE-LOGIN PORTAL LANDING PAGE
  // Scenic Paddy field background, 6 service cards, Login with OTP & Captcha
  // ═════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - 180px)' }}>

      {/* ── Hero Section ── */}
      <section
        id="main-content"
        style={{
          position: 'relative',
          backgroundImage: "url('/Land.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '520px',
          padding: '24px 32px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1360px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '36px',
          flexWrap: 'wrap'
        }}>

          {/* ── LEFT: Telugu Heading + 6 Service Cards ── */}
          <div style={{ flex: '1 1 760px', minWidth: '320px', maxWidth: '820px' }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: "'Noto Sans Telugu', sans-serif",
              marginBottom: '20px',
              textShadow: '0 2px 5px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)',
              letterSpacing: '0.2px',
              lineHeight: 1.4
            }}>
              గ్రామ సచివాలయం మరియు వార్డు సచివాలయం ద్వారా అందుబాటులో గల రెవెన్యూ శాఖ సేవలు
            </h2>

            {/* 6 Cards Grid (2 rows x 3 columns) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {preLoginCards.map((card) => (
                <div
                  key={card.id}
                  onClick={card.onClick}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
                    padding: '20px 14px',
                    minHeight: '142px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,0,0,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.14)';
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {card.icon ? (
                      <img
                        src={card.icon}
                        alt={card.title}
                        style={{ maxWidth: '44px', maxHeight: '44px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#1b7484',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="11" x2="12" y2="15" />
                          <circle cx="12" cy="18" r="1" fill="#ffffff" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <span style={{
                    fontSize: '13px',
                    color: '#222222',
                    fontWeight: 500,
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    lineHeight: '1.3',
                    whiteSpace: 'pre-line'
                  }}>
                    {card.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Login Card with Mobile, OTP & Captcha ── */}
          <div style={{
            flex: '0 0 350px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            padding: '28px 24px',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: "'Times New Roman', Georgia, serif",
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Login
            </h3>

            {!otpSent ? (
              /* Step 1: Mobile Number Entry */
              <form onSubmit={handleGetOtp}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Mobile No.
                </label>

                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile number"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px', lineHeight: 1.3 }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#145808',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#196f0b')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#145808')}
                >
                  Get OTP
                </button>
              </form>
            ) : (
              /* Step 2: OTP & Captcha Verification */
              <form onSubmit={handleLoginSubmit}>
                {/* OTP Input */}
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter OTP"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    fontSize: '15px',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '12px'
                  }}
                />

                {/* Captcha Image & Input */}
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Enter Captcha
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                  {/* Captcha Box */}
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px dashed #94a3b8',
                    borderRadius: '4px',
                    padding: '6px 14px',
                    fontSize: '18px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '4px',
                    color: '#0f172a',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{captchaCode}</span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      title="Refresh Captcha"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: '#64748b'
                      }}
                    >
                      ↻
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={4}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Code"
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '5px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px' }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#145808',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '11px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: '8px'
                  }}
                >
                  Login
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpValue('');
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Change Mobile Number
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* ── Official Disclaimer Strip & Zero Poverty P4 Logo ── */}
      <section style={{
        backgroundColor: '#e2e9a9',
        borderTop: '1px solid #ced688',
        borderBottom: '1px solid #ced688',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        gap: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ flex: '1 1 auto' }}>
          <p style={{
            margin: 0,
            fontSize: '11.5px',
            lineHeight: '1.45',
            color: '#800000',
            textAlign: 'justify',
            fontFamily: "'Segoe UI', Arial, sans-serif"
          }}>
            <span style={{ color: '#cc0000', fontWeight: 'bold' }}>Disclaimer: </span>
            All content, data, images, and materials available on this website are protected by copyright laws and intellectual property rights. Unauthorized copying, reproduction, or display of any materials from this website on other websites or platforms is strictly prohibited. Any attempt to replicate, redistribute, or use the content without permission may result in legal action.
          </p>
        </div>

        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/zero-poverty.png"
            alt="ZERO POVERTY P4"
            style={{
              maxHeight: '44px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
      </section>

      {/* ── Stats Counters ── */}
      <section style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {[
          { label: 'Site Visitors', value: '448779189', bg: '#1a2456' },
          { label: 'No.of Revenue Records Viewed', value: '167047077', bg: '#145808' },
          { label: 'Electronic Passbook Downloads', value: '638094', bg: '#7a6a08' },
        ].map(({ label, value, bg }) => (
          <div key={label} style={{
            flex: '1 1 200px',
            backgroundColor: bg,
            color: '#ffffff',
            padding: '16px 20px',
            textAlign: 'center',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {label}
            </p>
            <p style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </section>

    </div>
  );
}

// ── Shared Dashboard Styles for Post-Login /VAdangal/Index ──
const vadangalLinkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '13.5px',
  fontWeight: 600,
  fontFamily: "'Noto Sans Telugu', sans-serif",
  cursor: 'pointer',
  display: 'block',
  transition: 'color 0.15s'
};

const vadangalActionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#b87431',
  border: 'none',
  borderRadius: '6px',
  padding: '12px 14px',
  color: '#ffffff',
  fontSize: '13.5px',
  fontWeight: 700,
  fontFamily: "'Noto Sans Telugu', sans-serif",
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  transition: 'transform 0.15s, background-color 0.15s',
  textAlign: 'left'
};

const vadangalActionIconWrapStyle = {
  width: '32px',
  height: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

import React, { useState, useRef } from 'react';
import { apiService } from '../services/apiService';
import { useLandLocations } from '../hooks/useLandLocations';
import CaptchaPanel from '../components/CaptchaPanel';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — Application & Mutation Status Checking
// Covers:
// - మ్యుటేషన్/L P రికార్డు సవరణలు (ApplicationStatus)
// - L P రికార్డు వివరణలు (LPMStatusChecking)
// - భూ వినియోగ మార్ఫు (NALA Land Use Conversion)
// - సర్వే సంఖ్య రికార్డు సవరణలు (SynoApplicationStatus)
// - Download RDOs-OTC Proceedings (OTC_COCID)
// Uses exact Cyan Card (.lpm-report-box) design + azure consent box
// ─────────────────────────────────────────────────────────────────
export default function MutationStatusPage({ initialMode = 'mutation' }) {
  const [serviceType, setServiceType] = useState(initialMode); // 'mutation' | 'lpm' | 'nala' | 'survey_corr' | 'otc'
  const {
    districts,
    mandalsList,
    villagesList,
    district,
    mandal,
    village,
    districtPlaceholder,
    mandalPlaceholder,
    villagePlaceholder,
    setVillage,
    handleDistrictChange,
    handleMandalChange,
    locationError,
    loadingDistricts,
    loadingMandals,
    loadingVillages
  } = useLandLocations();

  const [searchMethod, setSearchMethod] = useState('appNo'); // 'appNo' | 'surveyNo'
  const [appNumber, setAppNumber] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusData, setStatusData] = useState(null);

  const resultsRef = useRef(null);

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'lpm':
        return 'ఎల్.పి. రికార్డు వివరణలు / స్థితి (LPM Status Checking)';
      case 'nala':
        return 'భూ వినియోగ మార్పు దరఖాస్తు స్థితి (NALA Conversion Status)';
      case 'survey_corr':
        return 'సర్వే సంఖ్య రికార్డు సవరణల స్థితి (Survey No. Correction)';
      case 'otc':
        return 'డౌన్‌లోడ్ RDOs-OTC Proceedings (OTC Proceedings)';
      default:
        return 'మీ మ్యుటేషన్ / దరఖాస్తు స్థితి తెలుసుకోండి';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (district === '0') {
      setErrorMessage('దయచేసి జిల్లాను ఎంచుకోండి (Please select District)');
      return;
    }
    if (mandal === '0') {
      setErrorMessage('దయచేసి మండలాన్ని ఎంచుకోండి (Please select Mandal)');
      return;
    }
    if (village === '0') {
      setErrorMessage('దయచేసి గ్రామాన్ని ఎంచుకోండి (Please select Village)');
      return;
    }
    if (!appNumber.trim()) {
      setErrorMessage('దయచేసి దరఖాస్తు సంఖ్యను నమోదు చేయండి (Please enter Application No)');
      return;
    }

    if (!captchaToken || !captchaAnswer.trim()) {
      setCaptchaError(true);
      setErrorMessage('Please enter the security captcha.');
      return;
    }
    setCaptchaError(false);

    if (!consentChecked) {
      setErrorMessage('దయచేసి వినియోగదారు సమ్మతి చెక్‌బాక్స్‌ను టిక్ చేయండి (Please accept user consent)');
      return;
    }

    setLoading(true);
    setShowResult(false);

    try {
      const res = searchMethod === 'surveyNo'
        ? await apiService.getApplicationStatusBySurveyNo(appNumber.trim(), captchaToken, captchaAnswer)
        : await apiService.getApplicationStatus(appNumber.trim(), captchaToken, captchaAnswer);
      if (res && res.success && res.data) {
        setStatusData({
          ...res.data,
          appNo: res.data.applicationNo,
          serviceName: res.data.serviceType,
          appliedDate: res.data.submissionDate
            ? new Date(res.data.submissionDate).toLocaleDateString()
            : '—',
          district: res.data.districtName,
          mandal: res.data.mandalName,
          village: res.data.villageName,
          status: res.data.currentStatus
        });
      } else {
        setStatusData(null);
        setErrorMessage('No application record found for that application number.');
      }

      setShowResult(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setStatusData(null);
      setShowResult(false);
      setErrorMessage(err.message || 'Failed to load application status.');
    } finally {
      setLoading(false);
      setCaptchaAnswer('');
      setCaptchaKey((key) => key + 1);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setStatusData(null);
  };

  return (
    <div className="main-wrapper" id="MutationID" style={{ minHeight: 'calc(100vh - 200px)', paddingBottom: '30px' }}>
      <div className="lpm-reports-sec">
        <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
          <div className="lpm-reports-main">

            {/* ── Main Cyan Card (.lpm-report-box) ── */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div
                className="lpm-report-box"
                style={{
                  width: '100%',
                  maxWidth: '460px',
                  backgroundColor: '#0094b6',
                  borderRadius: '12px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.15)',
                  padding: '24px 28px 28px',
                  color: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                {/* Heading */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: '16px',
                  lineHeight: '1.45',
                  fontFamily: "'Noto Sans Telugu', sans-serif"
                }}>
                  {getServiceTitle()}
                </h3>

                {/* Sub-selector for application types */}
                <div style={{ marginBottom: '14px' }}>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    style={{
                      ...officialSelectStyle,
                      backgroundColor: '#e6fffa',
                      fontWeight: 700,
                      borderColor: '#007a96',
                      color: '#034d40'
                    }}
                  >
                    <option value="mutation">మ్యుటేషన్ / L P రికార్డు సవరణలు (Mutation Status)</option>
                    <option value="lpm">L P రికార్డు వివరణలు (LPM Status Checking)</option>
                    <option value="nala">భూ వినియోగ మార్ఫు (NALA Land Use Conversion)</option>
                    <option value="survey_corr">సర్వే సంఖ్య రికార్డు సవరణలు (Survey No Amendments)</option>
                    <option value="otc">Download RDOs-OTC Proceedings</option>
                  </select>
                </div>

                <form onSubmit={handleSubmit} className="lpm-report-form">

                  {/* ── District ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label
                      htmlFor="dl_district"
                      className="form-label"
                      style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}
                    >
                      జిల్లా పేరు
                    </label>
                    <select
                      id="dl_district"
                      className="form-select"
                      value={district}
                      disabled={loadingDistricts}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      style={officialSelectStyle}
                    >
                      <option value="0">{districtPlaceholder}</option>
                      {districts.map((d, idx) => (
                        <option key={`dst-${d.value}-${idx}`} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Mandal ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label
                      htmlFor="dl_mandal"
                      className="form-label"
                      style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}
                    >
                      మండలం పేరు
                    </label>
                    <select
                      id="dl_mandal"
                      className="form-select"
                      value={mandal}
                      disabled={district === '0' || loadingMandals}
                      onChange={(e) => handleMandalChange(e.target.value)}
                      style={officialSelectStyle}
                    >
                      <option value="0">{mandalPlaceholder}</option>
                      {mandalsList.map((m, idx) => (
                        <option key={`mdl-${m.value}-${idx}`} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Village ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label
                      htmlFor="dl_village"
                      className="form-label"
                      style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}
                    >
                      గ్రామము పేరు
                    </label>
                    <select
                      id="dl_village"
                      className="form-select"
                      value={village}
                      disabled={mandal === '0' || loadingVillages}
                      onChange={(e) => setVillage(e.target.value)}
                      style={officialSelectStyle}
                    >
                      <option value="0">{villagePlaceholder}</option>
                      {villagesList.map((v, idx) => (
                        <option key={`vlg-${v.value}-${idx}`} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Radio Options ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                        <input
                          type="radio"
                          name="mutationSearchMethod"
                          value="appNo"
                          checked={searchMethod === 'appNo'}
                          onChange={() => setSearchMethod('appNo')}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>దరఖాస్తు సంఖ్య</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                        <input
                          type="radio"
                          name="mutationSearchMethod"
                          value="surveyNo"
                          checked={searchMethod === 'surveyNo'}
                          onChange={() => setSearchMethod('surveyNo')}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>సర్వే సంఖ్య</span>
                      </label>
                    </div>
                  </div>

                  {/* ── Input Box ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={searchMethod === 'appNo' ? 'దరఖాస్తు సంఖ్య నమోదు చేయండి (ఉదా: MUT2026AP009412)' : 'సర్వే సంఖ్య నమోదు చేయండి (ఉదా: 142-3B)'}
                      value={appNumber}
                      onChange={(e) => setAppNumber(e.target.value.toUpperCase())}
                      style={officialInputStyle}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <CaptchaPanel
                      key={captchaKey}
                      captchaValue={captchaAnswer}
                      onChange={(value) => {
                        setCaptchaAnswer(value);
                        setCaptchaError(false);
                      }}
                      onTokenReceived={setCaptchaToken}
                      hasError={captchaError}
                    />
                  </div>

                  {/* Error Message */}
                  {(errorMessage || locationError) && (
                    <div style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #f87171',
                      color: '#991b1b',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      marginBottom: '14px',
                      lineHeight: 1.3
                    }}>
                      {errorMessage || locationError}
                    </div>
                  )}

                  {/* ── Submit Button: క్లిక్ చేయండి ── */}
                  <div className="btnsec" style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#198754',
                        borderColor: '#198754',
                        color: '#ffffff',
                        padding: '8px 24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: 'none',
                        cursor: loading ? 'wait' : 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      {loading ? 'పరిశీలిస్తోంది...' : 'క్లిక్ చేయండి'}
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* ── Consent Box Underneath ── */}
            <div style={{ maxWidth: '820px', margin: '20px auto 0' }}>
              <div className="form-group">
                <p style={{
                  borderRadius: '5px',
                  padding: '12px 14px',
                  boxShadow: '1px 1px 2px 2px #0094ff',
                  backgroundColor: 'azure',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  color: '#212529',
                  margin: 0
                }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: '2px', cursor: 'pointer' }}
                    />
                    <span>
                      User consent: I, the applicant / citizen, hereby consent to verify the status of the mutation,
                      LPM record amendments, and revenue proceedings from the MeeBhoomi / Grama Ward Sachivalayam portal.
                      <br />
                      (వినియోగదారు సమ్మతి: నేను, గ్రామ వార్డు సచివాలయం / మీభూమి పోర్టల్ ద్వారా మ్యుటేషన్ మరియు రెవెన్యూ దరఖాస్తు ప్రొసీడింగ్స్ వివరాలు పరిశీలించడానికి సమ్మతి తెలుపుతున్నాను.)
                    </span>
                  </label>
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                OFFICIAL PROCEEDINGS & TRACKING RESULTS DISPLAY
                ══════════════════════════════════════════════════════ */}
            {showResult && statusData && (
              <div ref={resultsRef} style={{ marginTop: '30px' }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #0094b6',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  maxWidth: '920px',
                  margin: '0 auto'
                }}>
                  {/* Top Header */}
                  <div style={{
                    backgroundColor: '#145808',
                    color: '#ffffff',
                    padding: '12px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src="/images/andhra-pradesh-emblem-light.svg" alt="AP Emblem" style={{ height: '34px' }} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>రెవెన్యూ శాఖ - దరఖాస్తు స్థితి పత్రము</div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>Government of Andhra Pradesh - Revenue Proceedings Status</div>
                      </div>
                    </div>
                    <div>
                      <span style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                        {statusData.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px',
                      fontSize: '13.5px',
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '20px'
                    }}>
                      <div><strong>దరఖాస్తు సంఖ్య:</strong> <span style={{ color: '#0094b6', fontWeight: 700 }}>{statusData.appNo}</span></div>
                      <div><strong>దరఖాస్తుదారుని పేరు:</strong> {statusData.applicantName}</div>
                      <div><strong>సేవ పేరు:</strong> {statusData.serviceName}</div>
                      <div><strong>సర్వే సంఖ్య:</strong> {statusData.surveyNo}</div>
                      <div><strong>దరఖాస్తు తేది:</strong> {statusData.appliedDate}</div>
                      <div><strong>జిల్లా:</strong> {statusData.district}</div>
                      <div><strong>మండలం:</strong> {statusData.mandal}</div>
                      <div><strong>గ్రామము:</strong> {statusData.village}</div>
                      <div><strong>కేటాయించిన అధికారి:</strong> {statusData.assignedOfficer || '—'}</div>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                      గమనికలు (Remarks):
                    </h4>

                    <div style={{ padding: '12px 14px', marginBottom: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      {statusData.remarks || '—'}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        style={{
                          backgroundColor: '#145808',
                          color: '#ffffff',
                          padding: '8px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🖨️ ప్రొసీడింగ్స్ డౌన్లోడ్ / ప్రింట్ (Download Proceedings)
                      </button>
                      <button
                        type="button"
                        onClick={handleBack}
                        style={{
                          backgroundColor: '#64748b',
                          color: '#ffffff',
                          padding: '8px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        తిరిగి వెళ్ళండి (Back)
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

const officialSelectStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  fontSize: '13.5px',
  color: '#495057',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box'
};

const officialInputStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  fontSize: '13.5px',
  color: '#495057',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box'
};

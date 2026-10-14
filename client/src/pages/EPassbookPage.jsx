import React, { useState, useRef } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import { useLandLocations } from '../hooks/useLandLocations';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — Electronic Passbook Download (PPRequest)
// Exact Cyan Card (.lpm-report-box) design + azure consent box
// ─────────────────────────────────────────────────────────────────
export default function EPassbookPage() {
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

  const [searchType, setSearchType] = useState('khataNo'); // 'khataNo' | 'aadhaar'
  const [searchValue, setSearchValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passbookData, setPassbookData] = useState(null);

  const resultsRef = useRef(null);

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
    if (!searchValue.trim()) {
      setErrorMessage(
        searchType === 'khataNo'
          ? 'దయచేసి ఖాతా నెంబరు నమోదు చేయండి (Please enter Khata Number)'
          : 'దయచేసి ఆధార్ నెంబరు నమోదు చేయండి (Please enter Aadhaar Number)'
      );
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
      // Query backend database
      const res = await apiService.searchRecords({
        districtCode: district,
        mandalCode: mandal,
        villageCode: village,
        searchType: searchType,
        searchValue: searchValue.trim(),
        captchaToken,
        captchaAnswer
      });

      if (res.success && res.data && res.data.length > 0) {
        setPassbookData(res.data[0]);
        setShowResult(true);
      } else {
        setPassbookData(null);
        setShowResult(false);
        setErrorMessage('No passbook record found for the selected location and search value.');
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setPassbookData(null);
      setShowResult(false);
      setErrorMessage(err.message || 'Failed to load the passbook record.');
    } finally {
      setLoading(false);
      setCaptchaAnswer('');
      setCaptchaKey((key) => key + 1);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setPassbookData(null);
  };

  return (
    <div className="main-wrapper" id="EPassbookID" style={{ minHeight: 'calc(100vh - 200px)', paddingBottom: '30px' }}>
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
                  marginBottom: '20px',
                  lineHeight: '1.45',
                  fontFamily: "'Noto Sans Telugu', sans-serif"
                }}>
                  ఎలక్ట్రానిక్ పట్టాదారు పాస్ పుస్తకం డౌన్లోడ్ <br />
                  (Download E-Pattadar Passbook)
                </h3>

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
                          name="epassbookSearch"
                          value="khataNo"
                          checked={searchType === 'khataNo'}
                          onChange={() => { setSearchType('khataNo'); setSearchValue(''); }}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>ఖాతా నెంబర్</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                        <input
                          type="radio"
                          name="epassbookSearch"
                          value="aadhaar"
                          checked={searchType === 'aadhaar'}
                          onChange={() => { setSearchType('aadhaar'); setSearchValue(''); }}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>ఆధార్ నెంబర్</span>
                      </label>
                    </div>
                  </div>

                  {/* ── Dynamic Input Box ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    {searchType === 'khataNo' ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ఖాతా సంఖ్య నమోదు చేయండి (Enter Khata No)"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={officialInputStyle}
                      />
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          maxLength="12"
                          placeholder="12 అంకెల ఆధార్ సంఖ్య (Enter 12-digit Aadhaar)"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value.replace(/\D/g, '').slice(0, 12))}
                          style={{ ...officialInputStyle, paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#0094b6',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: 0
                          }}
                          title={showPassword ? 'Hide' : 'Show'}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    )}
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
                      {loading ? 'శోధిస్తోంది...' : 'క్లిక్ చేయండి'}
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
                      User consent: I, the holder of Aadhaar / Land Title Record, hereby give my consent to Revenue Dept.,
                      Govt. of Andhra Pradesh to retrieve my land ownership and E-Pattadar Passbook records.
                      <br />
                      (వినియోగదారు సమ్మతి: నేను, ఆంధ్ర ప్రదేశ్ ప్రభుత్వ రెవెన్యూ శాఖకు నా భూ యాజమాన్య మరియు ఎలక్ట్రానిక్ పాస్‌బుక్ వివరాలను పరిశీలించడానికి నా సమ్మతిని ఇస్తున్నాను.)
                    </span>
                  </label>
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                OFFICIAL E-PASSBOOK DOCUMENT DISPLAY
                ══════════════════════════════════════════════════════ */}
            {showResult && passbookData && (
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
                  {/* Top Security Banner */}
                  <div style={{
                    backgroundColor: '#0a4a06',
                    color: '#ffffff',
                    padding: '12px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src="/images/andhra-pradesh-emblem-light.svg" alt="AP Emblem" style={{ height: '36px' }} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>ఆంధ్ర ప్రదేశ్ ప్రభుత్వం - రెవెన్యూ శాఖ</div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>Government of Andhra Pradesh - Electronic Pattadar Passbook</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px' }}>
                      <span style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        ✓ DIGITAL VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Passbook Body */}
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      border: '1px dashed #0094b6',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13.5px' }}>
                        <div><strong>పాస్ పుస్తకం సంఖ్య:</strong> <span style={{ color: '#0094b6', fontWeight: 700 }}>{passbookData.passbookNumber || '—'}</span></div>
                        <div><strong>ఖాతా సంఖ్య:</strong> {passbookData.khataNo}</div>
                        <div><strong>పట్టాదారు పేరు:</strong> {passbookData.pattadarNameTe || passbookData.pattadarNameEn}</div>
                        <div><strong>తండ్రి / భర్త పేరు:</strong> {passbookData.fatherOrHusbandNameTe || passbookData.fatherOrHusbandNameEn}</div>
                        <div><strong>జిల్లా:</strong> {passbookData.districtNameTe || passbookData.districtNameEn}</div>
                        <div><strong>మండలం:</strong> {passbookData.mandalNameTe || passbookData.mandalNameEn}</div>
                        <div><strong>గ్రామము:</strong> {passbookData.villageNameTe || passbookData.villageNameEn}</div>
                        <div><strong>మొత్తం విస్తీర్ణం:</strong> {passbookData.totalExtentAcres} ఎకరాలు</div>
                        <div><strong>ఆధార్ సంఖ్య:</strong> {passbookData.aadhaarSeeded ? 'Linked in demo (number not displayed)' : 'Not linked'}</div>
                        <div><strong>జారీ తేది:</strong> {passbookData.passbookIssuedDate ? new Date(passbookData.passbookIssuedDate).toLocaleDateString() : '—'}</div>
                      </div>
                    </div>

                    {/* Parcel Table */}
                    <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#0094b6', color: '#ffffff' }}>
                            <th style={{ padding: '8px 10px', border: '1px solid #007a96' }}>క్రమ సంఖ్య</th>
                            <th style={{ padding: '8px 10px', border: '1px solid #007a96' }}>సర్వే సంఖ్య</th>
                            <th style={{ padding: '8px 10px', border: '1px solid #007a96' }}>విస్తీర్ణం (ఎకరాలు)</th>
                            <th style={{ padding: '8px 10px', border: '1px solid #007a96' }}>భూమి రకం</th>
                            <th style={{ padding: '8px 10px', border: '1px solid #007a96' }}>తీరువ (శిస్తు రూ.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ backgroundColor: '#ffffff' }}>
                            <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>1</td>
                            <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                              {passbookData.surveyNo}/{passbookData.subDivisionNo}
                            </td>
                            <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>{passbookData.totalExtentAcres}</td>
                            <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>{passbookData.landClassification}</td>
                            <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        style={{
                          backgroundColor: '#0a4a06',
                          color: '#ffffff',
                          padding: '8px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🖨️ ప్రింట్ తీసుకోండి (Print)
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

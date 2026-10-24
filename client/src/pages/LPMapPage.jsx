import React, { useState, useRef } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import { useLandLocations } from '../hooks/useLandLocations';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — L.P Map / FMB / Village Map Page
// Exact Cyan Card (.lpm-report-box) design + azure consent box
// ─────────────────────────────────────────────────────────────────
export default function LPMapPage() {
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
  const [surveyNo, setSurveyNo] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapRecord, setMapRecord] = useState(null);

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
    if (!surveyNo.trim()) {
      setErrorMessage('దయచేసి సర్వే సంఖ్య నమోదు చేయండి (Please enter Survey Number)');
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
      const res = await apiService.searchRecords({
        districtCode: district,
        mandalCode: mandal,
        villageCode: village,
        searchType: 'surveyNo',
        searchValue: surveyNo.trim(),
        captchaToken,
        captchaAnswer
      });

      setShowResult(true);
      if (res.data && res.data.length > 0) {
        setMapRecord(res.data[0]);
      } else {
        setMapRecord(null);
        setErrorMessage('No map record found for the selected location and survey number.');
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setMapRecord(null);
      setErrorMessage(err.message || 'Failed to load the map record.');
    } finally {
      setLoading(false);
      setCaptchaAnswer('');
      setCaptchaKey((key) => key + 1);
    }
  };

  return (
    <div className="main-wrapper" id="AdRorID" style={{ minHeight: 'calc(100vh - 200px)', paddingBottom: '30px' }}>
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
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: '20px',
                  lineHeight: '1.45',
                  fontFamily: "'Noto Sans Telugu', sans-serif"
                }}>
                  మీ L.P Map / FMB / గ్రామ పటం వివరాలు తెలుసుకోండి
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

                  {/* ── Survey Number ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label
                      className="form-label"
                      style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}
                    >
                      సర్వే సంఖ్య (Survey Number)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={surveyNo}
                      onChange={(e) => setSurveyNo(e.target.value)}
                      placeholder="ఉదా: 125/1 లేదా 125"
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

                  {/* Submit button */}
                  <div className="btnsec" style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="btn_submit"
                      style={{
                        backgroundColor: '#198754',
                        borderColor: '#198754',
                        color: '#ffffff',
                        padding: '8px 24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      క్లిక్ చేయండి
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
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <span>
                      User consent: I, the holder of land parcel information, give my consent to Revenue Dept., AP to inspect FMB / Land Parcel Map details.<br />
                      (వినియోగదారు సమ్మతి: ల్యాండ్ పార్సెల్ మ్యాప్ / ఎఫ్.ఎం.బి నకలు పరిశీలించడానికి నా సమ్మతిని తెలుపుతున్నాను.)
                    </span>
                  </label>
                </p>
              </div>
            </div>

            {/* ── Loading Spinner ── */}
            {loading && (
              <div id="loading" style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{
                  display: 'inline-block',
                  width: '36px',
                  height: '36px',
                  border: '4px solid #cbd5e1',
                  borderTopColor: '#0094b6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <br />
                <b style={{ color: '#000000', fontSize: '14px', marginTop: '8px', display: 'inline-block' }}>
                  Loading...Please Wait
                </b>
              </div>
            )}

            {/* ── Result View: FMB / LP Map Preview ── */}
            {showResult && mapRecord && (
              <div
                ref={resultsRef}
                id="div3"
                style={{
                  maxWidth: '920px',
                  margin: '30px auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px', gap: '12px' }}>
                  <button
                    onClick={() => setShowResult(false)}
                    id="backpage"
                    style={iconBtnStyle}
                  >
                    ← వెనుకకు (Back)
                  </button>
                  <button
                    onClick={() => window.print()}
                    id="btnPrints"
                    style={iconBtnStyle}
                  >
                    🖨 ప్రింట్ (Print)
                  </button>
                </div>

                <div style={{
                  backgroundColor: '#145808',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '4px 4px 0 0',
                  fontSize: '15px',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  ఆంధ్రప్రదేశ్ ప్రభుత్వం — ఫీల్డ్ మెజర్మెంట్ బుక్ / ల్యాండ్ పార్సెల్ మ్యాప్ (FMB Map)
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div><strong>సర్వే సంఖ్య:</strong> {mapRecord.surveyNo}</div>
                    <div><strong>LP నెంబరు:</strong> <code>{mapRecord.lpNo}</code></div>
                    <div><strong>ఖాతా నెంబరు:</strong> {mapRecord.khataNo}</div>
                    <div><strong>పట్టాదారు:</strong> {mapRecord.pattadarNameTe}</div>
                    <div><strong>విస్తీర్ణం:</strong> {mapRecord.totalExtentAcres} ఎకరాలు</div>
                    <div><strong>సరిహద్దులు (Boundaries):</strong> ఉ: {mapRecord.neighboringSurveys?.north}, ద: {mapRecord.neighboringSurveys?.south}, తూ: {mapRecord.neighboringSurveys?.east}, ప: {mapRecord.neighboringSurveys?.west}</div>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px dashed #94a3b8',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    color: '#475569'
                  }}>
                    {mapRecord.lpMapSvg
                      ? 'Map geometry is available in the revenue records repository.'
                      : 'Map geometry is not available in the connected record.'}
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
  color: '#212529',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer'
};

const officialInputStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  fontSize: '13.5px',
  color: '#212529',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box'
};

const iconBtnStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #145808',
  color: '#145808',
  borderRadius: '4px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer'
};

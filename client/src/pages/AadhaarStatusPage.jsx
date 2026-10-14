import React, { useState, useRef } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import { useLandLocations } from '../hooks/useLandLocations';
import { openLandRecordPage } from '../services/recordNavigation';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — VAdangal/Aadharselfseed
// Matches official HTML and layout exactly:
// Cyan card (.lpm-report-box) + Azure consent box (.form-group)
// ─────────────────────────────────────────────────────────────────

export default function AadhaarStatusPage() {
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

  const [searchType, setSearchType] = useState('Khata'); // 'Khata' | 'Aadhar'
  const [khataNumber, setKhataNumber] = useState('');
  const [aadharLast4, setAadharLast4] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  // Result and Loading
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultData, setResultData] = useState(null);

  const resultsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loadingDistricts || loadingMandals || loadingVillages) {
      setErrorMessage('Please wait for the selected locations to finish loading.');
      return;
    }
    if (locationError) {
      setErrorMessage(locationError);
      return;
    }

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

    if (searchType === 'Khata' && !khataNumber.trim()) {
      setErrorMessage('దయచేసి ఖాతా నెంబరు నమోదు చేయండి (Please enter Khata Number)');
      return;
    }
    if (searchType === 'Aadhar' && !/^\d{4}$/.test(aadharLast4)) {
      setErrorMessage('దయచేసి ఆధార్ చివరి 4 అంకెలు నమోదు చేయండి (Please enter the last 4 Aadhaar digits)');
      return;
    }

    if (!captchaToken || !captchaInput.trim()) {
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
      const response = await apiService.searchRecords({
        districtCode: district,
        mandalCode: mandal,
        villageCode: village,
        searchType: searchType === 'Khata' ? 'khataNo' : 'aadhaar',
        searchValue: searchType === 'Khata' ? khataNumber.trim() : aadharLast4,
        captchaToken,
        captchaAnswer: captchaInput.trim()
      });

      const matchingRecords = response.data || [];
      if (!response.success || matchingRecords.length === 0) {
        setResultData(null);
        setErrorMessage('No land record was found for the selected details.');
        return;
      }
      if (matchingRecords.length > 1) {
        setResultData(null);
        setErrorMessage('More than one land record matched. Use a more specific search value to identify the correct holding.');
        return;
      }

      setResultData(matchingRecords[0]);
      setShowResult(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setResultData(null);
      setErrorMessage(error.message || 'Failed to search land records.');
    } finally {
      setLoading(false);
      setCaptchaInput('');
      setCaptchaToken('');
      setAadharLast4('');
      setCaptchaKey((key) => key + 1);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setResultData(null);
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
                  మీ ఖాతా నెంబరు తో మీ ఆధార్ నెంబరు <br />
                  జత పరచబడినదో లేదో తెలుసుకోండి
                </h3>
                <p style={{ color: '#ffffff', fontSize: '12px', lineHeight: 1.5, margin: '-8px 0 18px' }}>
                  Demo lookup only. Aadhaar searches use the last four digits; do not enter or upload a full Aadhaar number.
                </p>

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

                  {/* ── Radio buttons (Khata vs Aadhaar) ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <div className="row" id="selectror" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>
                        <input
                          type="radio"
                          name="Pahani"
                          id="Khataid"
                          value="Khata"
                          checked={searchType === 'Khata'}
                          onChange={() => setSearchType('Khata')}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>ఖాతా నెంబర్</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>
                        <input
                          type="radio"
                          name="Pahani"
                          id="Aadharid"
                          value="Aadhar"
                          checked={searchType === 'Aadhar'}
                          onChange={() => setSearchType('Aadhar')}
                          style={{ accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span>ఆధార్ నెంబర్</span>
                      </label>
                    </div>
                  </div>

                  {/* ── Conditional Inputs ── */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    {searchType === 'Khata' ? (
                      <div id="divkhata">
                        <input
                          id="txt_NumberType"
                          type="text"
                          value={khataNumber}
                          onChange={(e) => setKhataNumber(e.target.value)}
                          className="form-control"
                          placeholder="Enter Khata Number"
                          autoComplete="off"
                          style={officialInputStyle}
                        />
                      </div>
                    ) : (
                      <div id="divaadhar">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="form-control"
                          maxLength="4"
                          value={aadharLast4}
                          onChange={(e) => setAadharLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          id="Aadhartxt_NumberType"
                          placeholder="Last 4 Aadhaar digits (demo only)"
                          autoComplete="off"
                          style={officialInputStyle}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px', backgroundColor: '#ffffff', borderRadius: '4px', padding: '10px' }}>
                    <CaptchaPanel
                      key={captchaKey}
                      captchaValue={captchaInput}
                      onChange={(value) => {
                        setCaptchaInput(value);
                        setCaptchaError(false);
                      }}
                      onTokenReceived={setCaptchaToken}
                      hasError={captchaError}
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
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
                      {errorMessage}
                    </div>
                  )}
                  {locationError && (
                    <div role="alert" style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #f87171',
                      color: '#991b1b',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      marginBottom: '14px',
                      lineHeight: 1.3
                    }}>
                      {locationError}
                    </div>
                  )}

                  {/* ── Submit Button: క్లిక్ చేయండి ── */}
                  <div className="btnsec" style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      disabled={loading || loadingDistricts || loadingMandals || loadingVillages}
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
                        cursor: loading || loadingDistricts || loadingMandals || loadingVillages ? 'wait' : 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      {loading ? 'లోడ్ అవుతోంది...' : 'క్లిక్ చేయండి'}
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
                      name="CnfrmPahani"
                      id="Cnfrm"
                      value="Cnfrm"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <span>
                      Demo consent: I agree to check the synthetic land-record data in this application. This demo does not contact UIDAI, request OTP/biometrics, or verify a real Aadhaar number.<br />
                      (డెమో సమ్మతి: ఈ అప్లికేషన్‌లోని నమూనా భూ రికార్డులను పరిశీలించడానికి అంగీకరిస్తున్నాను. ఈ డెమో UIDAIని సంప్రదించదు; OTP/బయోమెట్రిక్స్ అడగదు; నిజమైన ఆధార్‌ను ధృవీకరించదు.)
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

            {/* ── Result View: #div3 & #GetAdangal ── */}
            {showResult && resultData && (
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
                {/* Print & Back buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px', gap: '12px' }}>
                  <button
                    onClick={handleBack}
                    id="backpage"
                    title="Back"
                    style={iconBtnStyle}
                  >
                    ← వెనుకకు (Back)
                  </button>
                  <button
                    onClick={() => window.print()}
                    id="btnPrints"
                    title="Print"
                    style={iconBtnStyle}
                  >
                    🖨 ప్రింట్ (Print)
                  </button>
                </div>

                <div id="GetAdangal">
                  <div style={{
                    backgroundColor: '#145808',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '4px 4px 0 0',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}>
                    నమూనా డేటా — భూ రికార్డుల ఆధార్ సీడింగ్ వివరములు (Demo record)
                  </div>

                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    color: '#1e293b'
                  }}>
                    <tbody>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>జిల్లా (District):</td>
                        <td style={valTdStyle}>{resultData.districtNameTe} ({resultData.districtNameEn})</td>
                        <td style={labelTdStyle}>మండలం (Mandal):</td>
                        <td style={valTdStyle}>{resultData.mandalNameTe} ({resultData.mandalNameEn})</td>
                      </tr>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>గ్రామం (Village):</td>
                        <td style={valTdStyle}>{resultData.villageNameTe} ({resultData.villageNameEn})</td>
                        <td style={labelTdStyle}>ఖాతా నెం (Khata No):</td>
                        <td style={valTdStyle}><strong>{resultData.khataNo}</strong></td>
                      </tr>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>పట్టాదారు పేరు (Pattadar):</td>
                        <td style={valTdStyle}>{resultData.pattadarNameTe} ({resultData.pattadarNameEn})</td>
                        <td style={labelTdStyle}>తండ్రి/భర్త పేరు (Father):</td>
                        <td style={valTdStyle}>{resultData.fatherOrHusbandNameTe} ({resultData.fatherOrHusbandNameEn})</td>
                      </tr>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>సర్వే నెం (Survey No):</td>
                        <td style={valTdStyle}>{resultData.surveyNo}/{resultData.subDivisionNo}</td>
                        <td style={labelTdStyle}>విస్తీర్ణం (Extent):</td>
                        <td style={valTdStyle}>{resultData.totalExtentAcres} ఎకరాలు (Acres)</td>
                      </tr>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>ఆధార్ సంఖ్య (Aadhaar No):</td>
                        <td style={valTdStyle}><code>Not displayed</code></td>
                        <td style={labelTdStyle}>సీడింగ్ స్థితి (Status):</td>
                        <td style={valTdStyle}>
                          <span style={{
                            backgroundColor: resultData.aadhaarSeeded ? '#dcfce7' : '#fee2e2',
                            color: resultData.aadhaarSeeded ? '#15803d' : '#991b1b',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: `1px solid ${resultData.aadhaarSeeded ? '#86efac' : '#fca5a5'}`
                          }}>
                            {resultData.aadhaarSeeded ? '✓ సీడ్ చేయబడింది (Seeded in demo)' : '✗ సీడ్ చేయబడలేదు (Not seeded)'}
                          </span>
                        </td>
                      </tr>
                      <tr style={rowStyle}>
                        <td style={labelTdStyle}>సర్వే వివరాలు:</td>
                        <td style={valTdStyle}>{resultData.landClassification}</td>
                        <td style={labelTdStyle}>ధృవీకరణ:</td>
                        <td style={valTdStyle}>నమూనా డేటా మాత్రమే; UIDAI ధృవీకరణ కాదు (Not verified by UIDAI)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                  <a
                    href="#adangal"
                    onClick={() => openLandRecordPage('adangal', resultData)}
                    style={{ ...iconBtnStyle, display: 'inline-block', textDecoration: 'none' }}
                  >
                    మీ అడంగల్ / గ్రామ అడంగల్
                  </a>
                  <a
                    href="#1b"
                    onClick={() => openLandRecordPage('1b', resultData)}
                    style={{ ...iconBtnStyle, display: 'inline-block', textDecoration: 'none' }}
                  >
                    మీ 1-బి / గ్రామ 1-బి
                  </a>
                </div>
                <p style={{ margin: '14px 0 0', color: '#475569', fontSize: '12px', textAlign: 'center' }}>
                  Synthetic demonstration data only. No official MeeBhoomi or UIDAI database is connected.
                </p>
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

const rowStyle = {
  borderBottom: '1px solid #e2e8f0'
};

const labelTdStyle = {
  padding: '10px 12px',
  fontWeight: 600,
  backgroundColor: '#f8fafc',
  width: '20%'
};

const valTdStyle = {
  padding: '10px 12px',
  width: '30%'
};

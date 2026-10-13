import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import RecordHandoffNotice from '../components/RecordHandoffNotice';
import { useLandLocations } from '../hooks/useLandLocations';
import { clearLandRecordHandoff, readLandRecordHandoff } from '../services/recordNavigation';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — 1-B / Village 1-B (ROR 1-B) Page
// Exact Cyan Card (.lpm-report-box) design + azure consent box
// ─────────────────────────────────────────────────────────────────
export default function ROR1BPage({ isVillage1B = false }) {
  const [recordHandoff] = useState(() =>
    readLandRecordHandoff(isVillage1B ? 'village-1b' : '1b')
  );
  useEffect(() => clearLandRecordHandoff(), []);
  const {
    districts,
    mandalsList,
    villagesList,
    district,
    mandal,
    village,
    isReferenceLocation,
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
  } = useLandLocations(recordHandoff, { includeLegacyOptions: true });

  const [searchType, setSearchType] = useState('khataNo'); // 'khataNo' | 'surveyNo' | 'aadhaar' | 'pattadarName'
  const [searchValue, setSearchValue] = useState(recordHandoff?.khataNo || '');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultsList, setResultsList] = useState([]);

  const resultsRef = useRef(null);

  useEffect(() => {
    setErrorMessage('');
    setShowResult(false);
    setResultsList([]);
  }, [district, mandal, village]);

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
    if (isReferenceLocation) {
      setResultsList([]);
      setShowResult(false);
      setErrorMessage('ఈ ఎంపికకు ప్రస్తుతం గ్రామాల వివరాలు అందుబాటులో లేవు.');
      return;
    }
    if (village === '0') {
      setErrorMessage('దయచేసి గ్రామాన్ని ఎంచుకోండి (Please select Village)');
      return;
    }

    if (!isVillage1B && !searchValue.trim()) {
      setErrorMessage('దయచేసి శోధన వివరాలు నమోదు చేయండి (Please enter search value)');
      return;
    }
    if (!isVillage1B && searchType === 'aadhaar' && !/^\d{4}$/.test(searchValue.trim())) {
      setErrorMessage('Enter only the last 4 Aadhaar digits for this demo search.');
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
      const res = isVillage1B
        ? await apiService.getVillage1B(district, mandal, village, captchaToken, captchaAnswer)
        : await apiService.searchRecords({
            districtCode: district,
            mandalCode: mandal,
            villageCode: village,
            searchType,
            searchValue: searchValue.trim(),
            captchaToken,
            captchaAnswer
          });

      setLoading(false);
      setShowResult(true);
      setResultsList(res.data || []);
      if (!res.data || res.data.length === 0) {
        setErrorMessage('No records found for the selected location and search value.');
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setLoading(false);
      setResultsList([]);
      setErrorMessage(err.message || 'Failed to load land records.');
    } finally {
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
                  {isVillage1B
                    ? 'గ్రామ 1-బి (ROR 1-B) రికార్డు వివరాలు తెలుసుకోండి'
                    : 'మీ 1-బి (ROR 1-B) రికార్డు వివరాలు తెలుసుకోండి'}
                </h3>
                <RecordHandoffNotice record={recordHandoff} />
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
                      {districts.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
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
                      {mandalsList.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
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
                      disabled={mandal === '0' || loadingVillages || isReferenceLocation}
                      onChange={(e) => setVillage(e.target.value)}
                      style={officialSelectStyle}
                    >
                      <option value="0">{villagePlaceholder}</option>
                      {villagesList.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Radio selection criteria (Individual 1-B) ── */}
                  {!isVillage1B && (
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <div className="row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
                          <input
                            type="radio"
                            name="searchType"
                            value="khataNo"
                            checked={searchType === 'khataNo'}
                            onChange={() => { setSearchType('khataNo'); setSearchValue(''); }}
                            style={{ accentColor: '#ffffff' }}
                          />
                          <span>ఖాతా నెంబర్</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
                          <input
                            type="radio"
                            name="searchType"
                            value="surveyNo"
                            checked={searchType === 'surveyNo'}
                            onChange={() => { setSearchType('surveyNo'); setSearchValue(''); }}
                            style={{ accentColor: '#ffffff' }}
                          />
                          <span>సర్వే నెంబర్</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
                          <input
                            type="radio"
                            name="searchType"
                            value="aadhaar"
                            checked={searchType === 'aadhaar'}
                            onChange={() => { setSearchType('aadhaar'); setSearchValue(''); }}
                            style={{ accentColor: '#ffffff' }}
                          />
                          <span>ఆధార్ నెంబర్</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
                          <input
                            type="radio"
                            name="searchType"
                            value="pattadarName"
                            checked={searchType === 'pattadarName'}
                            onChange={() => { setSearchType('pattadarName'); setSearchValue(''); }}
                            style={{ accentColor: '#ffffff' }}
                          />
                          <span>పట్టాదారు పేరు</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Input value */}
                  {!isVillage1B && (
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <input
                        type="text"
                        inputMode={searchType === 'aadhaar' ? 'numeric' : 'text'}
                        maxLength={searchType === 'aadhaar' ? 4 : undefined}
                        className="form-control"
                        value={searchValue}
                        onChange={(e) => setSearchValue(
                          searchType === 'aadhaar'
                            ? e.target.value.replace(/\D/g, '').slice(0, 4)
                            : e.target.value
                        )}
                        placeholder={
                          searchType === 'khataNo'
                            ? 'Enter Khata Number (ఉదా: 102)'
                            : searchType === 'surveyNo'
                            ? 'Enter Survey Number (ఉదా: 125/1)'
                            : searchType === 'aadhaar'
                            ? 'Last 4 Aadhaar digits (demo only)'
                            : 'Enter Pattadar Name (పట్టాదారు పేరు)'
                        }
                        style={officialInputStyle}
                      />
                    </div>
                  )}

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
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <span>
                      Demo consent: I agree to view synthetic 1-B (Record of Rights) data in this application. Aadhaar linking status is sample data only and is not verified by UIDAI.<br />
                      (డెమో సమ్మతి: ఈ అప్లికేషన్‌లోని నమూనా 1-బి సమాచారాన్ని చూడటానికి అంగీకరిస్తున్నాను. ఆధార్ లింకింగ్ స్థితి నమూనా సమాచారం మాత్రమే; UIDAI ద్వారా ధృవీకరించబడలేదు.)
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

            {/* ── Result View: 1-B Records Table ── */}
            {showResult && resultsList.length > 0 && (
              <div
                ref={resultsRef}
                id="div3"
                style={{
                  maxWidth: '1000px',
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

                <div id="GetAdangal">
                  <div style={{
                    backgroundColor: '#145808',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '4px 4px 0 0',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}>
                    నమూనా డేటా — హక్కుల రికార్డు (Demo ROR 1-B)
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      minWidth: '900px',
                      borderCollapse: 'collapse',
                      fontSize: '13px',
                      color: '#1e293b'
                    }}>
                    <thead>
                      <tr style={{ backgroundColor: '#e2e8f0', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={thStyle}>ఖాతా నెంబర్</th>
                        <th style={thStyle}>పట్టాదారు పేరు</th>
                        <th style={thStyle}>తండ్రి/భర్త పేరు</th>
                        <th style={thStyle}>సర్వే సంఖ్యలు</th>
                        <th style={thStyle}>మొత్తం విస్తీర్ణం (ఎకరాలు)</th>
                        <th style={thStyle}>పాస్‌బుక్ నెంబర్</th>
                        <th style={thStyle}>హక్కు స్వభావం</th>
                        <th style={thStyle}>ఆధార్ లింకింగ్ స్థితి</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsList.map((rec, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={tdStyle}><strong>{rec.khataNo}</strong></td>
                          <td style={tdStyle}>{rec.pattadarNameTe}</td>
                          <td style={tdStyle}>{rec.fatherOrHusbandNameTe}</td>
                          <td style={tdStyle}>{rec.surveyNo}</td>
                          <td style={tdStyle}>{rec.totalExtentAcres}</td>
                          <td style={tdStyle}><code>{rec.passbookNumber}</code></td>
                          <td style={tdStyle}>{rec.landClassification}</td>
                          <td style={tdStyle}>
                            {rec.aadhaarSeeded ? (
                              <span style={{ color: '#15803d', fontWeight: 700 }}>
                                లింక్ అయింది (నమూనా; సంఖ్య చూపించబడదు)
                              </span>
                            ) : (
                              <span style={{ color: '#b91c1c', fontWeight: 700 }}>లింక్ కాలేదు (Not linked)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  <p style={{ margin: '10px 0', color: '#64748b', fontSize: '12px' }}>
                    Aadhaar linking status shown here is synthetic demo metadata; it is not an official MeeBhoomi or UIDAI verification.
                  </p>
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

const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 700,
  color: '#334155'
};

const tdStyle = {
  padding: '10px 12px'
};

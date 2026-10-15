import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import RecordHandoffNotice from '../components/RecordHandoffNotice';
import { useLandLocations } from '../hooks/useLandLocations';
import { clearLandRecordHandoff, readLandRecordHandoff } from '../services/recordNavigation';

// ─────────────────────────────────────────────────────────────────
// Official MeeBhoomi — Adangal / Village Adangal Page
// Uses the exact cyan card (.lpm-report-box) design + azure consent
// ─────────────────────────────────────────────────────────────────
export default function AdangalPage({ isVillageAdangal = false }) {
  const [recordHandoff] = useState(() =>
    readLandRecordHandoff(isVillageAdangal ? 'village-adangal' : 'adangal')
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

  const [searchType, setSearchType] = useState(recordHandoff ? 'khataNo' : 'surveyNo'); // 'surveyNo' | 'khataNo' | 'aadhaar' | 'pattadarName'
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

    if (!isVillageAdangal && !searchValue.trim()) {
      setErrorMessage('దయచేసి శోధన వివరాలు నమోదు చేయండి (Please enter search value)');
      return;
    }
    if (!isVillageAdangal && searchType === 'aadhaar' && !/^\d{4}$/.test(searchValue.trim())) {
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
      const res = isVillageAdangal
        ? await apiService.getVillageAdangal(district, mandal, village, captchaToken, captchaAnswer)
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
                  {isVillageAdangal
                    ? 'గ్రామ అడంగల్ / పహణీ వివరాలు తెలుసుకోండి'
                    : 'మీ అడంగల్ / పహణీ వివరాలు తెలుసుకోండి'}
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
                      disabled={mandal === '0' || loadingVillages || isReferenceLocation}
                      onChange={(e) => setVillage(e.target.value)}
                      style={officialSelectStyle}
                    >
                      <option value="0">{villagePlaceholder}</option>
                      {villagesList.map((v, idx) => (
                        <option key={`vlg-${v.value}-${idx}`} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Radio selection criteria (Individual Adangal) ── */}
                  {!isVillageAdangal && (
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <div className="row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                  {!isVillageAdangal && (
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
                          searchType === 'surveyNo'
                            ? 'Enter Survey Number (ఉదా: 125/1)'
                            : searchType === 'khataNo'
                            ? 'Enter Khata Number (ఉదా: 102)'
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
                  padding: '8px 12px',
                  boxShadow: '1px 1px 2px 2px #0094ff',
                  backgroundColor: 'azure',
                  fontSize: '10px',
                  lineHeight: '1.45',
                  color: '#212529',
                  margin: 0
                }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: '2px', cursor: 'pointer', width: '13px', height: '13px' }}
                    />
                    <span style={{ fontSize: '10px', lineHeight: '1.45' }}>
                      Demo consent: I agree to view synthetic Adangal/Pahani data in this application. Aadhaar linking status is sample data only and is not verified by UIDAI.<br />
                      (డెమో సమ్మతి: ఈ అప్లికేషన్‌లోని నమూనా అడంగల్ / పహణీ సమాచారాన్ని చూడటానికి అంగీకరిస్తున్నాను. ఆధార్ లింకింగ్ స్థితి నమూనా సమాచారం మాత్రమే; UIDAI ద్వారా ధృవీకరించబడలేదు.)
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

            {/* ── Result View: Adangal Records Table ── */}

            {showResult && resultsList.length > 0 && (
              <div
                ref={resultsRef}
                id="div3"
                style={{
                  maxWidth: '1100px',
                  margin: '30px auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '24px'
                }}
              >
                {/* ── Action Navigation Icons (Back / Print / Home) ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setShowResult(false)}
                    id="backpage"
                    title="వెనుకకు / Back"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#15803d',
                      fontWeight: 700,
                      padding: '4px 6px'
                    }}
                  >
                    ←
                  </button>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>/</span>
                  <button
                    onClick={() => window.print()}
                    id="btnPrints"
                    title="ప్రింట్ / Print"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#15803d',
                      padding: '4px 6px'
                    }}
                  >
                    🖨
                  </button>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>/</span>
                  <a
                    href="#home"
                    title="హోమ్ / Home"
                    style={{
                      textDecoration: 'none',
                      fontSize: '18px',
                      color: '#15803d',
                      padding: '4px 6px',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    🏠
                  </a>
                </div>

                <div id="GetAdangal">
                  {/* ── Official Report Title ── */}
                  <h2 style={{
                    textAlign: 'center',
                    color: '#0f5132',
                    fontSize: '22px',
                    fontWeight: 700,
                    margin: '8px 0 18px 0',
                    fontFamily: "'Segoe UI', Roboto, 'Nirmala UI', sans-serif"
                  }}>
                    ROR1b Report
                  </h2>

                  {/* ── Official 10-Column Grid Table ── */}
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{
                      width: '100%',
                      minWidth: '950px',
                      borderCollapse: 'collapse',
                      border: '1px solid #717171',
                      fontSize: '12px',
                      color: '#111827',
                      fontFamily: "'Segoe UI', Roboto, 'Nirmala UI', sans-serif"
                    }}>
                      <tbody>
                        {/* ── Location Header Row ── */}
                        <tr style={{ backgroundColor: '#ffffff' }}>
                          <td colSpan={2} style={locCellStyle}>
                            <strong>జిల్లా:</strong> {resultsList[0].districtNameEn} - {resultsList[0].districtNameTe}
                          </td>
                          <td colSpan={2} style={locCellStyle}>
                            <strong>మండలం:</strong> {String(resultsList[0].mandalNameEn || '').toUpperCase()} , {resultsList[0].mandalNameTe}
                          </td>
                          <td colSpan={2} style={locCellStyle}>
                            <strong>గ్రామం:</strong> {String(resultsList[0].villageNameEn || '').toUpperCase()} , {resultsList[0].villageNameTe}
                          </td>
                          <td colSpan={3} style={locCellStyle}>
                            <strong>Khata No::</strong> {resultsList[0].khataNo}
                          </td>
                          <td style={locCellStyle}></td>
                        </tr>

                        {/* ── Table Column Headers (Telugu Official) ── */}
                        <tr style={{ backgroundColor: '#a2d2a2', color: '#000000', fontWeight: 700, textAlign: 'center' }}>
                          <td style={{ ...thCellOfficial, width: '5%' }}>క్రమ సంఖ్య</td>
                          <td style={{ ...thCellOfficial, width: '16%' }}>పట్టాదారుని పేరు</td>
                          <td style={{ ...thCellOfficial, width: '10%' }}>లింగము (స్త్రీ/పురుషుడు/ఇతరులు)</td>
                          <td style={{ ...thCellOfficial, width: '14%' }}>తండ్రి/ భర్త పేరు</td>
                          <td style={{ ...thCellOfficial, width: '7%' }}>ఖాతా నెంబరు</td>
                          <td style={{ ...thCellOfficial, width: '11%' }}>సర్వే నెం./ సబ్ డివిజన్ నంబరు</td>
                          <td style={{ ...thCellOfficial, width: '8%' }}>భూమి వివరణ</td>
                          <td style={{ ...thCellOfficial, width: '8%' }}>విస్తీర్ణం</td>
                          <td style={{ ...thCellOfficial, width: '13%' }}>పట్టాదారుకు ఏ విధంగా సంక్రమించింది/ సాగు చేశారా</td>
                          <td style={{ ...thCellOfficial, width: '8%' }}>మ్యుటేషన్ ఆమోదించిన తేదీ</td>
                        </tr>

                        {/* ── Column Numbering Row (1 to 10) ── */}
                        <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '11px', textAlign: 'center' }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <td key={num} style={numCellOfficial}>{num}</td>
                          ))}
                        </tr>

                        {/* ── Land Records Data Rows ── */}
                        {resultsList.map((rec, idx) => {
                          const genderStr = rec.genderTe || (
                            rec.gender && rec.gender.toLowerCase().includes('female')
                              ? 'స్త్రీ'
                              : rec.gender && rec.gender.toLowerCase().includes('male')
                              ? 'పురుషుడు'
                              : '---'
                          );
                          const fatherNameStr = rec.fatherOrHusbandNameTe || rec.fatherOrHusbandNameEn || '---';
                          const surveyDisplay = rec.surveyNo || '---';
                          const landDesc = rec.landClassification && rec.landClassification.includes('Dry')
                            ? 'మెట్ట'
                            : (rec.landType || (rec.landClassification ? rec.landClassification.replace(/\(.*?\)/g, '').trim() : 'మెట్ట'));
                          const extentFormatted = rec.totalExtentAcres !== undefined
                            ? Number(rec.totalExtentAcres).toFixed(4)
                            : (rec.extentDisplay || '0.0000');
                          const transferStr = rec.landTransferType || rec.acquisitionType || 'జానువంశికము';
                          const mutationStr = rec.mutationDate || '---';

                          return (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{idx + 1}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'left', fontWeight: 500 }}>
                                {rec.pattadarNameTe || rec.pattadarNameEn}
                              </td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{genderStr}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'left' }}>{fatherNameStr}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{rec.khataNo}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{surveyDisplay}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{landDesc}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{extentFormatted}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{transferStr}</td>
                              <td style={{ ...tdCellOfficial, textAlign: 'center' }}>{mutationStr}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Official Print Timestamp Notice in Telugu ── */}
                  <p style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#1e293b',
                    marginTop: '28px',
                    marginBottom: '16px',
                    fontFamily: "'Segoe UI', Roboto, 'Nirmala UI', sans-serif"
                  }}>
                    ఈ రెవిన్యూ రికార్డు ను మీ భూమి వెబ్ సైట్ నుండి , {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} తేదీనా ద్వారా ప్రింట్ చేయబడినది.
                  </p>

                  {/* ── Official Legal Disclaimer in English ── */}
                  <p style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#334155',
                    lineHeight: '1.65',
                    maxWidth: '920px',
                    margin: '0 auto 16px auto',
                    fontFamily: "'Segoe UI', Roboto, sans-serif"
                  }}>
                    The information contained made available through this web site is for information only and cannot be utilised as certified / authenticated copy for producing in any court or for enforcing any legal claims etc. under the existing relevant Acts / Rules framed by the Government of Andhra Pradesh in this context.
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

const locCellStyle = {
  border: '1px solid #717171',
  padding: '6px 8px',
  fontSize: '12.5px',
  fontWeight: 500,
  color: '#111827',
  backgroundColor: '#ffffff'
};

const thCellOfficial = {
  border: '1px solid #717171',
  padding: '7px 4px',
  fontSize: '11.5px',
  fontWeight: 700,
  lineHeight: '1.3',
  verticalAlign: 'middle',
  color: '#000000'
};

const numCellOfficial = {
  border: '1px solid #717171',
  padding: '3px 4px',
  fontSize: '11px',
  color: '#475569',
  fontWeight: 500,
  textAlign: 'center',
  backgroundColor: '#ffffff'
};

const tdCellOfficial = {
  border: '1px solid #717171',
  padding: '6px 6px',
  fontSize: '12px',
  color: '#1e293b',
  verticalAlign: 'middle',
  lineHeight: '1.4'
};

import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import CaptchaPanel from '../components/CaptchaPanel';
import { Droplets, CheckCircle2, Search, CreditCard, Printer } from 'lucide-react';
import { useLandLocations } from '../hooks/useLandLocations';

export default function WaterTaxPage() {
  const {
    districts,
    mandalsList,
    villagesList,
    district: selectedDistrict,
    mandal: selectedMandal,
    village: selectedVillage,
    districtPlaceholder,
    mandalPlaceholder,
    villagePlaceholder,
    handleDistrictChange,
    handleMandalChange,
    setVillage: setSelectedVillage,
    locationError,
    loadingDistricts,
    loadingMandals,
    loadingVillages
  } = useLandLocations();
  const [khataNo, setKhataNo] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);

  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setTaxData(null);
    if (selectedDistrict === '0' || selectedMandal === '0' || selectedVillage === '0') {
      setErrorMessage('Select a district, mandal, and village before searching.');
      return;
    }
    if (locationError) {
      setErrorMessage(locationError);
      return;
    }
    if (!khataNo.trim()) {
      setErrorMessage('Enter a Khata number.');
      return;
    }
    if (!captchaToken || !captchaAnswer.trim()) {
      setCaptchaError(true);
      setErrorMessage('Please enter the security captcha.');
      return;
    }
    setCaptchaError(false);

    try {
      setLoading(true);
      const res = await apiService.searchRecords({
        districtCode: selectedDistrict,
        mandalCode: selectedMandal,
        villageCode: selectedVillage,
        searchType: 'khataNo',
        searchValue: khataNo,
        captchaToken,
        captchaAnswer
      });
      if (res.data?.length === 1) {
        setTaxData(res.data[0]);
        setPaid(false);
      } else if (res.data?.length > 1) {
        setErrorMessage('More than one record matched. Please verify the selected location and Khata number.');
      } else {
        setErrorMessage('No record found for the selected location and khata number.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load the water tax assessment.');
    } finally {
      setLoading(false);
      setCaptchaAnswer('');
      setCaptchaKey((key) => key + 1);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ backgroundColor: '#145808', color: '#ffffff', padding: '12px 20px', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
          నీటి పన్ను చెల్లింపు (Water Tax / CESS Assessment)
        </h2>
        <span style={{ fontSize: '12px', opacity: 0.9 }}>AP Irrigation Revenue Portal</span>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          {(errorMessage || locationError) && (
            <div role="alert" style={{ color: '#991b1b', marginBottom: '16px' }}>
              {errorMessage || locationError}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                జిల్లా (District) *
              </label>
              <select
                value={selectedDistrict}
                disabled={loadingDistricts}
                onChange={(e) => handleDistrictChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              >
                <option value="0">{districtPlaceholder}</option>
                {districts.map((d, idx) => (
                  <option key={`dst-${d.value}-${idx}`} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                మండలం (Mandal) *
              </label>
              <select
                value={selectedMandal}
                disabled={selectedDistrict === '0' || loadingMandals}
                onChange={(e) => handleMandalChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              >
                <option value="0">{mandalPlaceholder}</option>
                {mandalsList.map((m, idx) => (
                  <option key={`mdl-${m.value}-${idx}`} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                గ్రామం (Village) *
              </label>
              <select
                value={selectedVillage}
                disabled={selectedMandal === '0' || loadingVillages}
                onChange={(e) => setSelectedVillage(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              >
                <option value="0">{villagePlaceholder}</option>
                {villagesList.map((v, idx) => (
                  <option key={`vlg-${v.value}-${idx}`} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                ఖాతా సంఖ్య (Khata No) *
              </label>
              <input
                type="text"
                value={khataNo}
                onChange={(e) => setKhataNo(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ maxWidth: '420px', marginBottom: '20px' }}>
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

          <button
            type="submit"
            disabled={loading || loadingDistricts || loadingMandals || loadingVillages}
            style={{
              backgroundColor: '#145808',
              color: '#ffffff',
              border: 'none',
              padding: '9px 24px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Droplets size={16} />
            <span>{loading ? 'శోధిస్తోంది...' : 'డిమాండ్ వివరాలు (Get Tax Demand)'}</span>
          </button>
        </form>
      </div>

      {taxData && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#145808', marginBottom: '16px' }}>
            నీటి పన్ను నమూనా అంచనా / Water Tax Demo Estimate
          </h3>
          <p role="note" style={{ color: '#92400e', backgroundColor: '#fffbeb', padding: '10px 12px', borderRadius: '4px', marginBottom: '16px' }}>
            Illustrative demo only: the estimate uses a sample rate and is not an official tax demand. No real payment is processed.
          </p>

          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', color: '#64748b', width: '35%' }}>పట్టాదారుని పేరు:</td>
                <td style={{ padding: '8px', fontWeight: 700 }}>{taxData.pattadarNameTe} ({taxData.pattadarNameEn})</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', color: '#64748b' }}>సర్వే నంబర్ &amp; విస్తీర్ణం:</td>
                <td style={{ padding: '8px' }}>Sy No: {taxData.surveyNo}/{taxData.subDivisionNo} ({taxData.totalExtentAcres} ఎకరాలు)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', color: '#64748b' }}>నీటి వనరు (Water Source):</td>
                <td style={{ padding: '8px' }}>{taxData.waterSource}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', color: '#64748b' }}>పంట వివరాలు (Crop):</td>
                <td style={{ padding: '8px' }}>{taxData.cropDetails}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', color: '#64748b' }}>నమూనా అంచనా (Demo Estimate):</td>
                <td style={{ padding: '8px', fontWeight: 800, color: '#b91c1c', fontSize: '16px' }}>
                  ₹{(taxData.totalExtentAcres * 200).toFixed(2)} (రూపాయలు)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', color: '#64748b' }}>చెల్లింపు నమూనా స్థితి (Demo Payment Status):</td>
                <td style={{ padding: '8px' }}>
                  {paid ? (
                    <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> చెల్లించబడింది (PAID - Txn ID: WTX{Date.now().toString().slice(-6)})
                    </span>
                  ) : (
                    <span style={{ color: '#b91c1c', fontWeight: 700 }}>చెల్లించాల్సి ఉంది (Pending)</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '12px' }}>
            {!paid ? (
              <button
                onClick={() => setPaid(true)}
                style={{
                  backgroundColor: '#145808',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={16} />
                <span>ఆన్‌లైన్ చెల్లింపు చేయండి (Pay Online)</span>
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={16} />
                <span>రసీదు ప్రింట్ (Print Receipt)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

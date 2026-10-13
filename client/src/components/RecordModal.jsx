import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export default function RecordModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '2px solid #145808',
          position: 'relative'
        }}
      >
        {/* Modal Top Bar */}
        <div
          className="no-print"
          style={{
            backgroundColor: '#145808',
            color: '#ffffff',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#ffcc00" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
              ఆంధ్రప్రదేశ్ ప్రభుత్వం - భూమి యాజమాన్య హక్కుల పత్రం (ROR 1-B / Adangal)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: '#ffffff',
                color: '#145808',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div style={{ padding: '24px' }}>
          {/* Official Emblem Banner */}
          <div style={{ textAlign: 'center', borderBottom: '2px double #145808', paddingBottom: '16px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', color: '#145808', fontWeight: 800 }}>మీ భూమి - రెవెన్యూ శాఖ</h2>
            <h4 style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>ఆంధ్రప్రదేశ్ ప్రభుత్వం (Government of Andhra Pradesh)</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              గ్రామ అడంగల్ &amp; హక్కుల రికార్డు (Record of Rights under AP ROR Act 1971)
            </p>
          </div>

          {/* Location Details Box */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', marginBottom: '16px', fontSize: '13px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              <div><strong>జిల్లా (District):</strong> {record.districtNameTe} ({record.districtNameEn})</div>
              <div><strong>మండలం (Mandal):</strong> {record.mandalNameTe} ({record.mandalNameEn})</div>
              <div><strong>గ్రామం (Village):</strong> {record.villageNameTe} ({record.villageNameEn})</div>
              <div><strong>ఖాతా సంఖ్య (Khata No):</strong> <span style={{ color: '#145808', fontWeight: 700 }}>{record.khataNo}</span></div>
            </div>
          </div>

          {/* Landowner Details */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#145808', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '12px' }}>
              పట్టాదారు &amp; అనుభవదారు వివరాలు (Pattadar Particulars)
            </h4>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px', width: '40%', color: '#64748b' }}>పట్టాదారు పేరు (Pattadar Name):</td>
                  <td style={{ padding: '6px', fontWeight: 700 }}>{record.pattadarNameTe} / {record.pattadarNameEn}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px', color: '#64748b' }}>తండ్రి / భర్త పేరు (Father's Name):</td>
                  <td style={{ padding: '6px' }}>{record.fatherOrHusbandNameTe} / {record.fatherOrHusbandNameEn}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px', color: '#64748b' }}>సాగుదారుని పేరు (Cultivator):</td>
                  <td style={{ padding: '6px' }}>{record.cultivatorNameTe || record.cultivatorNameEn || 'స్వయంగా (Self)'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px', color: '#64748b' }}>ఆధార్ సీడింగ్ స్థితి (Aadhaar Seeding):</td>
                  <td style={{ padding: '6px' }}>
                    {record.aadhaarSeeded ? (
                      <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> సీడెడ్ (నమూనా; సంఖ్య చూపించబడదు)
                      </span>
                    ) : 'సీడ్ కాలేదు'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px', color: '#64748b' }}>పాస్‌బుక్ సంఖ్య (E-Passbook ID):</td>
                  <td style={{ padding: '6px', fontWeight: 700, color: '#1e3a8a' }}>{record.passbookNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Land Parcel Extent & Classification */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#145808', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '12px' }}>
              భూమి విస్తీర్ణం &amp; స్వభావం (Land Classification &amp; Boundaries)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px' }}>
              <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px' }}>సర్వే నంబర్:</span><br />
                <strong style={{ fontSize: '16px', color: '#145808' }}>{record.surveyNo}/{record.subDivisionNo}</strong>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px' }}>మొత్తం విస్తీర్ణం:</span><br />
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>{record.totalExtentAcres} ఎకరాలు</strong>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px' }}>భూమి వర్గీకరణ:</span><br />
                <strong style={{ fontSize: '13px' }}>{record.landClassification}</strong>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px' }}>నీటి వనరు (Water Source):</span><br />
                <strong style={{ fontSize: '13px' }}>{record.waterSource}</strong>
              </div>
            </div>
          </div>

          {/* Boundaries */}
          {record.neighboringSurveys && (
            <div style={{ marginBottom: '20px', padding: '12px', border: '1px dashed #cbd5e1', borderRadius: '4px', fontSize: '12px' }}>
              <strong>సరిహద్దు సర్వే నంబర్లు (Neighboring Surveys):</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>ఉత్తరం (North): <strong>{record.neighboringSurveys.north}</strong></div>
                <div>దక్షిణం (South): <strong>{record.neighboringSurveys.south}</strong></div>
                <div>తూర్పు (East): <strong>{record.neighboringSurveys.east}</strong></div>
                <div>పడమర (West): <strong>{record.neighboringSurveys.west}</strong></div>
              </div>
            </div>
          )}

          {/* Security stamp and QR code */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              జారీ చేసిన తేదీ: {new Date().toLocaleDateString('te-IN')}<br />
              ధృవీకరణ కోడ్: AP-REV-VERIFIED-{record.khataNo}
            </div>
            {/* SVG QR Code Simulation */}
            <div style={{ textAlign: 'center' }}>
              <svg width="60" height="60" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#fff" stroke="#cbd5e1"/>
                <rect x="10" y="10" width="30" height="30" fill="#145808"/>
                <rect x="15" y="15" width="20" height="20" fill="#fff"/>
                <rect x="20" y="20" width="10" height="10" fill="#145808"/>
                <rect x="60" y="10" width="30" height="30" fill="#145808"/>
                <rect x="65" y="15" width="20" height="20" fill="#fff"/>
                <rect x="70" y="20" width="10" height="10" fill="#145808"/>
                <rect x="10" y="60" width="30" height="30" fill="#145808"/>
                <rect x="15" y="65" width="20" height="20" fill="#fff"/>
                <rect x="20" y="70" width="10" height="10" fill="#145808"/>
                <rect x="55" y="55" width="15" height="15" fill="#145808"/>
                <rect x="75" y="75" width="15" height="15" fill="#145808"/>
              </svg>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#145808' }}>VERIFIED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

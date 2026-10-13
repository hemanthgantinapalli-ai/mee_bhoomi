import React from 'react';
import { Printer, Map, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResultsTable({ records, title, onSelectRecord, onOpenMap }) {
  if (!records || records.length === 0) {
    return (
      <div
        style={{
          padding: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          textAlign: 'center',
          color: '#64748b'
        }}
      >
        <AlertCircle size={36} color="#d97706" style={{ margin: '0 auto 12px' }} />
        <h4 style={{ color: '#1e293b', marginBottom: '6px' }}>రికార్డులు కనుగొనబడలేదు / No Records Found</h4>
        <p style={{ fontSize: '13px' }}>
          ఎంపిక చేసిన వివరాలకు సంబంధించిన భూమి రికార్డులు అందుబాటులో లేవు. దయచేసి సర్వే సంఖ్య లేదా ఖాతా సంఖ్య సరిచూసుకోండి.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
      {/* Header with Print action */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#145808' }}>
            {title || 'భూమి వివరాలు / Land Record Particulars'}
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            మొత్తం రికార్డులు / Total Records: {records.length}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#145808',
            color: '#ffffff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <Printer size={14} />
          <span>ప్రింట్ (Print)</span>
        </button>
      </div>

      {/* Responsive Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="govt-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>క్ర.సం</th>
              <th>సర్వే నెం.<br />(Survey No)</th>
              <th>ఖాతా నెం.<br />(Khata No)</th>
              <th>పట్టాదారుని పేరు<br />(Pattadar Name)</th>
              <th>తండ్రి / భర్త పేరు<br />(Father/Husband)</th>
              <th>విస్తీర్ణం (ఎ-గుం)<br />(Extent Acres)</th>
              <th>భూమి స్వభావం<br />(Classification)</th>
              <th>సాగుదారుడు<br />(Cultivator)</th>
              <th>ఆధార్ సీడింగ్<br />(Aadhaar Status)</th>
              <th className="no-print" style={{ textAlign: 'center' }}>చర్యలు (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr key={r._id || index}>
                <td style={{ fontWeight: 600, textAlign: 'center' }}>{index + 1}</td>
                <td style={{ fontWeight: 700, color: '#145808' }}>
                  {r.surveyNo}{r.subDivisionNo ? `/${r.subDivisionNo}` : ''}
                </td>
                <td style={{ fontWeight: 600 }}>{r.khataNo}</td>
                <td>
                  <div style={{ fontWeight: 700 }}>{r.pattadarNameTe || r.pattadarNameEn}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{r.pattadarNameEn}</div>
                </td>
                <td>
                  <div>{r.fatherOrHusbandNameTe || r.fatherOrHusbandNameEn}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{r.fatherOrHusbandNameEn}</div>
                </td>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>
                  {Number(r.totalExtentAcres).toFixed(2)} ఎకరాలు
                </td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: r.landClassification?.includes('Wet') ? '#dcfce7' : '#fef9c3',
                      color: r.landClassification?.includes('Wet') ? '#166534' : '#854d0e'
                    }}
                  >
                    {r.landClassification || 'Dry (మెట్ట)'}
                  </span>
                </td>
                <td>{r.cultivatorNameTe || r.cultivatorNameEn || 'స్వయంగా (Self)'}</td>
                <td>
                  {r.aadhaarSeeded ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
                      <CheckCircle size={14} /> సీడెడ్ (Linked)
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                      లింక్ కాలేదు
                    </span>
                  )}
                </td>
                <td className="no-print" style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onSelectRecord && onSelectRecord(r)}
                      title="వివరాలు / Full Record"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#145808',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <FileText size={12} /> View
                    </button>

                    <button
                      onClick={() => onOpenMap && onOpenMap(r)}
                      title="ఎల్.పీ. మ్యాప్ / FMB Sketch"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <Map size={12} /> Map
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simulated record note */}
      <div style={{ padding: '8px 16px', backgroundColor: '#fffbeb', borderTop: '1px solid #fef3c7', fontSize: '11px', color: '#92400e' }}>
        <strong>గమనిక (Note):</strong> MeeBhoomi రిఫరెన్స్ ప్రాజెక్ట్ కొరకు రూపొందించిన నమూనా భూమి రికార్డులు. ఇవి అధికారిక ధృవీకరణ పత్రాలు కావు.
      </div>
    </div>
  );
}

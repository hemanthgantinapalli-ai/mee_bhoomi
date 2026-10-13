import React from 'react';

export default function RecordHandoffNotice({ record }) {
  if (!record) return null;

  return (
    <div
      role="status"
      style={{
        margin: '0 0 16px',
        padding: '10px 12px',
        border: '1px solid #bae6c4',
        borderRadius: '6px',
        backgroundColor: '#f0fdf4',
        color: '#14532d',
        fontSize: '12px',
        lineHeight: 1.5
      }}
    >
      <strong>Aadhaar Status record loaded</strong>
      <div>
        Location and Khata No. {record.khataNo} have been prefilled. Complete CAPTCHA and consent, then submit to view the land record and its Aadhaar link status.
      </div>
      <div>
        Aadhaar linking: {record.aadhaarSeeded
          ? 'Linked in demo (number not displayed)'
          : 'Not linked in demo'}
        {' — not verified by UIDAI.'}
      </div>
    </div>
  );
}

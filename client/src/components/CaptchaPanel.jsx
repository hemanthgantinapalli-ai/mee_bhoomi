import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function CaptchaPanel({ captchaValue, onChange, onTokenReceived, hasError }) {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const loadCaptcha = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await apiService.getCaptcha();
      if (!res.success || !res.data?.svg || !res.data?.token) {
        throw new Error('Captcha challenge response was incomplete.');
      }
      setSvgContent(res.data.svg);
      onTokenReceived(res.data.token);
    } catch (err) {
      console.error('Error fetching captcha:', err);
      setFetchError(true);
      setSvgContent('');
      onTokenReceived('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
        సెక్యూరిటీ కోడ్ / Security Captcha <span style={{ color: '#dc2626' }}>*</span>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* SVG Display */}
        <div
          style={{
            minWidth: '140px',
            height: '45px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Refresh button */}
        <button
          type="button"
          onClick={loadCaptcha}
          disabled={loading}
          title="Refresh Captcha Code"
          style={{
            background: '#e2e8f0',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#1e293b'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>

        {/* Captcha Input */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <input
            type="text"
            id="txtCaptcha"
            value={captchaValue}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="Enter Captcha"
            maxLength={6}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: hasError ? '2px solid #dc2626' : '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </div>

      {fetchError && (
        <span role="alert" style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
          Security challenge is unavailable. Please refresh to try again.
        </span>
      )}

      {hasError && (
        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
          దయచేసి సరైన సెక్యూరిటీ కోడ్‌ను నమోదు చేయండి / Please enter the correct captcha code.
        </span>
      )}
    </div>
  );
}

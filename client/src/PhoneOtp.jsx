import React, { useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "./firebase";

export default function PhoneOtp({ onVerified }) {
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const verifierRef = useRef(null);

  async function sendOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!verifierRef.current) {
        verifierRef.current = new RecaptchaVerifier(
          auth,
          recaptchaRef.current,
          { size: "normal" }
        );
        await verifierRef.current.render();
      }

      const result = await signInWithPhoneNumber(
        auth,
        phone.trim(),
        verifierRef.current
      );

      setConfirmation(result);
      setMessage("OTP sent. Please check your phone.");
    } catch (error) {
      verifierRef.current?.clear();
      verifierRef.current = null;
      setMessage(error.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!confirmation) return;

    setMessage("");
    setLoading(true);

    try {
      const userCredential = await confirmation.confirm(otp.trim());
      setMessage("Phone verified successfully!");
      if (onVerified) {
        onVerified(userCredential.user);
      }
    } catch {
      setMessage("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: '100%', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: '#1b3f39',
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        Verify your mobile number
      </h2>

      <label
        htmlFor="phone"
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '6px'
        }}
      >
        Mobile number
      </label>
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91 9876543210"
        disabled={!!confirmation}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          boxSizing: 'border-box',
          marginBottom: '12px',
          outline: 'none'
        }}
      />

      <div ref={recaptchaRef} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }} />

      {!confirmation ? (
        <button
          onClick={sendOtp}
          disabled={loading || phone.trim().length < 10}
          style={{
            width: '100%',
            backgroundColor: '#145808',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '11px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s'
          }}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      ) : (
        <>
          <label
            htmlFor="otp"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '6px'
            }}
          >
            Verification code
          </label>
          <input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              letterSpacing: '3px',
              textAlign: 'center',
              boxSizing: 'border-box',
              marginBottom: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={verifyOtp}
            disabled={loading || otp.length < 6}
            style={{
              width: '100%',
              backgroundColor: '#145808',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '11px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {message && (
        <p
          role="status"
          style={{
            marginTop: '12px',
            fontSize: '12.5px',
            color: message.includes('successfully') ? '#15803d' : '#dc2626',
            textAlign: 'center',
            lineHeight: '1.4'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

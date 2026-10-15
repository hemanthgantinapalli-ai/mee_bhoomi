import React, { useRef, useState, useEffect } from "react";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const verifierRef = useRef(null);

  // Initialize reCAPTCHA on container mount
  useEffect(() => {
    let isMounted = true;

    const setupVerifier = async () => {
      if (!recaptchaRef.current) return;
      try {
        if (!verifierRef.current) {
          verifierRef.current = new RecaptchaVerifier(
            auth,
            recaptchaRef.current,
            {
              size: "normal",
              callback: () => {
                setMessage("");
              },
              "expired-callback": () => {
                setMessage("reCAPTCHA expired. Please verify again.");
              }
            }
          );
          await verifierRef.current.render();
        }
      } catch (err) {
        console.warn("reCAPTCHA init error:", err);
      }
    };

    setupVerifier();

    return () => {
      isMounted = false;
      if (verifierRef.current) {
        try {
          verifierRef.current.clear();
        } catch (_) {}
        verifierRef.current = null;
      }
    };
  }, [confirmation]);

  async function sendOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone.startsWith('+') || cleanPhone.length < 11) {
      setMessage("Please enter a valid phone number with country code (e.g. +91 9876543210)");
      return;
    }

    setLoading(true);

    try {
      if (!verifierRef.current && recaptchaRef.current) {
        verifierRef.current = new RecaptchaVerifier(
          auth,
          recaptchaRef.current,
          { size: "normal" }
        );
        await verifierRef.current.render();
      }

      const result = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        verifierRef.current
      );

      setConfirmation(result);
      setIsSuccess(true);
      setMessage("OTP sent successfully! Please check your phone for the 6-digit code.");
    } catch (error) {
      console.error("Firebase OTP error:", error.code, error.message);
      alert(`${error.code}: ${error.message}`);
      setMessage(`${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!confirmation) return;

    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      const userCredential = await confirmation.confirm(otp.trim());
      setIsSuccess(true);
      setMessage("Phone verified successfully! Logging you in...");
      if (onVerified) {
        setTimeout(() => {
          onVerified(userCredential.user);
        }, 600);
      }
    } catch (error) {
      console.error("Firebase verifyOtp error:", error);
      setIsSuccess(false);
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

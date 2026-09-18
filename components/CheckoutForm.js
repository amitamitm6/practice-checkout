"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import FlagDropdown from "./FlagDropdown";
import { countries, defaultDialCountry } from "../lib/countries";
import { capPhoneDigits, getMaxNationalNumberLength } from "../lib/phone";

const PRODUCT = {
  name: "Daily Video Access",
  description: "One-time purchase",
  price: 15.0,
};

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 20 }, (_, i) =>
  String(currentYear + i).slice(-2)
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(digits) {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

const FULL_NAME_PATTERN =
  "\\s*[\\p{L}\\-']+(?:\\s+[\\p{L}\\-']+)+\\s*";
const FULL_NAME_REGEX = new RegExp(`^${FULL_NAME_PATTERN}$`, "u");
const FULL_NAME_MESSAGE =
  "Please enter your full name (first and last name).";

function EyeIcon({ open }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a20.3 20.3 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function CheckoutForm({ onSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDial, setPhoneDial] = useState(defaultDialCountry.iso2);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberCursor, setCardNumberCursor] = useState(null);
  const cardNumberRef = useRef(null);
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    if (cardNumberCursor !== null && cardNumberRef.current) {
      cardNumberRef.current.setSelectionRange(
        cardNumberCursor,
        cardNumberCursor
      );
    }
  }, [cardNumber, cardNumberCursor]);

  function handleCardNumberChange(e) {
    const input = e.target;
    const digitsBeforeCursor = onlyDigits(
      input.value.slice(0, input.selectionStart)
    ).length;
    const digits = onlyDigits(input.value).slice(0, 16);
    const spacesBefore =
      digitsBeforeCursor > 0 ? Math.floor((digitsBeforeCursor - 1) / 4) : 0;
    setCardNumber(digits);
    setCardNumberCursor(digitsBeforeCursor + spacesBefore);
  }

  function handleFullNameChange(e) {
    const value = e.target.value;
    setFullName(value);
    const trimmed = value.trim();
    e.target.setCustomValidity(
      trimmed === "" || FULL_NAME_REGEX.test(trimmed) ? "" : FULL_NAME_MESSAGE
    );
  }

  const maxPhoneDigits = useMemo(
    () => getMaxNationalNumberLength(phoneDial),
    [phoneDial]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const countryName =
      countries.find((c) => c.iso2 === country)?.name || "";
    const dial = countries.find((c) => c.iso2 === phoneDial)?.dial || "";
    const phone = phoneNumber.trim()
      ? `${dial} ${phoneNumber.trim()}`
      : "";

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email,
          phone,
          country: countryName,
          address,
          zip,
          product: PRODUCT.name,
          cardNumber,
          expiryDate: `${expiryMonth}/${expiryYear}`,
          cvv,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="checkoutForm" onSubmit={handleSubmit} noValidate={false}>
      <section className="card">
        <h2 className="card-heading">Contact &amp; Shipping</h2>

        <div className="field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            pattern={FULL_NAME_PATTERN}
            title={FULL_NAME_MESSAGE}
            value={fullName}
            onChange={handleFullNameChange}
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="phoneNumber">Phone (optional)</label>
          <div className="phoneRow">
            <FlagDropdown
              id="phoneDial"
              name="phoneDial"
              mode="dial"
              options={countries}
              value={phoneDial}
              onChange={(iso2) => {
                setPhoneDial(iso2);
                setPhoneNumber((prev) =>
                  capPhoneDigits(prev, getMaxNationalNumberLength(iso2))
                );
              }}
            />
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="phoneRow-input"
              value={phoneNumber}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^\d\s-]/g, "");
                setPhoneNumber(capPhoneDigits(sanitized, maxPhoneDigits));
              }}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="country">Country</label>
          <FlagDropdown
            id="country"
            name="country"
            mode="country"
            options={countries}
            value={country}
            onChange={setCountry}
            placeholder="Select your country"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="address">Address (optional)</label>
          <input
            id="address"
            name="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="zip">Zip Code (optional)</label>
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(onlyDigits(e.target.value))}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card-heading">
          <span aria-hidden="true">🔒</span> Payment
        </h2>

        <div className="field">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            required
            maxLength={19}
            ref={cardNumberRef}
            value={formatCardNumber(cardNumber)}
            onChange={handleCardNumberChange}
          />
        </div>

        <div className="cardRow">
          <div className="field">
            <label htmlFor="expiryMonth">Expiry Date</label>
            <div className="expiryRow">
              <select
                id="expiryMonth"
                name="expiryMonth"
                required
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
              >
                <option value="" disabled>
                  MM
                </option>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="expiryRow-sep">/</span>
              <select
                id="expiryYear"
                name="expiryYear"
                required
                aria-label="Expiry year"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
              >
                <option value="" disabled>
                  YY
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="cvv">CVV/CVC</label>
            <div className="cvvField">
              <input
                id="cvv"
                name="cvv"
                type={showCvv ? "text" : "password"}
                inputMode="numeric"
                required
                maxLength={3}
                className="cvvField-input"
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 3))}
              />
              <button
                type="button"
                className="cvvField-toggle"
                onClick={() => setShowCvv((s) => !s)}
                aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                aria-pressed={showCvv}
              >
                <EyeIcon open={showCvv} />
              </button>
            </div>
          </div>
        </div>

        <div className="badges">
          <span className="badge">🔒 SSL Secured</span>
          <span className="badge">✓ Verified Checkout</span>
        </div>
      </section>

      {error && <p className="formError">{error}</p>}

      <button type="submit" className="submitButton" disabled={submitting}>
        {submitting ? "Processing..." : `Pay $${PRODUCT.price.toFixed(2)}`}
      </button>
    </form>
  );
}

export { PRODUCT };

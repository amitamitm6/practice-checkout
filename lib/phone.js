import { Metadata } from "libphonenumber-js";
import metadataJson from "libphonenumber-js/metadata.max.json";

const cache = new Map();

// Longest national-significant-number digit count allowed for this country,
// read straight from libphonenumber-js's numbering-plan metadata (covers
// every number type in that country's plan, not just mobile numbers).
// Probing with sample digit strings (e.g. "111...1") was tried first, but
// the result changed depending on which digit was repeated - some countries'
// parsing rules treat a leading 1 or 0 specially - so it isn't reliable.
export function getMaxNationalNumberLength(iso2) {
  const country = iso2.toUpperCase();
  if (cache.has(country)) return cache.get(country);

  let max = 15;
  try {
    const metadata = new Metadata(metadataJson);
    metadata.selectNumberingPlan(country);
    const lengths = metadata.numberingPlan.possibleLengths();
    max = Math.max(...lengths);
  } catch {
    // Unknown/unsupported country: fall back to the E.164 overall max.
  }

  cache.set(country, max);
  return max;
}

// Keeps whatever separators the user typed, but stops accepting more digit
// characters once the country's max digit count has been reached.
export function capPhoneDigits(raw, maxDigits) {
  let digitCount = 0;
  let result = "";
  for (const char of raw) {
    if (/\d/.test(char)) {
      if (digitCount >= maxDigits) continue;
      digitCount++;
    }
    result += char;
  }
  return result;
}

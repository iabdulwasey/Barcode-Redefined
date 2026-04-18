/**
 * GTIN Validator — Pure TypeScript, no React, no Next.js dependencies.
 *
 * Supports GTIN-8, GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-14 (ITF-14 / GS1-128).
 * Implements the GS1 check digit algorithm (Luhn-mod-10 variant).
 *
 * GS1 algorithm:
 *   Starting from the rightmost digit (excluding check digit), alternate
 *   multiplying by 3 and 1 (i.e. odd positions from right × 3, even × 1).
 *   Sum all products. Check digit = (10 - (sum % 10)) % 10.
 */

export type GTINLength = 8 | 12 | 13 | 14;

export interface GTINResult {
  isValid: boolean;
  length: GTINLength | null;
  checkDigit: number | null;
  calculatedCheckDigit: number | null;
  countryPrefix: string | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Country prefix map (GS1 prefix → country/region label)
// ---------------------------------------------------------------------------

/**
 * Maps a two-digit GS1 prefix string to a country/region name.
 * Prefixes are the first two digits of a GTIN-13 (or last 12 of GTIN-14).
 */
const GS1_PREFIX_MAP: ReadonlyMap<string, string> = new Map([
  // United States & Canada
  ["00", "United States / Canada"],
  ["01", "United States / Canada"],
  ["02", "United States / Canada"],
  ["03", "United States / Canada"],
  ["04", "United States / Canada"],
  ["05", "United States / Canada"],
  ["06", "United States / Canada"],
  ["07", "United States / Canada"],
  ["08", "United States / Canada"],
  ["09", "United States / Canada"],
  // France
  ["30", "France"],
  ["31", "France"],
  ["32", "France"],
  ["33", "France"],
  ["34", "France"],
  ["35", "France"],
  ["36", "France"],
  ["37", "France"],
  // Germany
  ["40", "Germany"],
  ["41", "Germany"],
  ["42", "Germany"],
  ["43", "Germany"],
  ["44", "Germany"],
  // Japan
  ["45", "Japan"],
  ["49", "Japan"],
  // United Kingdom
  ["50", "United Kingdom"],
  // China
  ["69", "China"],
  // Norway
  ["70", "Norway"],
  // Sweden
  ["73", "Sweden"],
  // Switzerland
  ["76", "Switzerland"],
  // Italy
  ["80", "Italy"],
  ["81", "Italy"],
  ["82", "Italy"],
  ["83", "Italy"],
  // Spain
  ["84", "Spain"],
  // Netherlands
  ["87", "Netherlands"],
  // Australia / New Zealand
  ["90", "Australia / New Zealand"],
  ["91", "Australia / New Zealand"],
]);

/**
 * Resolve a two-digit prefix string to a country/region name, or null if
 * not in the map.
 */
function lookupPrefix(prefix: string): string | null {
  return GS1_PREFIX_MAP.get(prefix) ?? null;
}

// ---------------------------------------------------------------------------
// Core algorithm
// ---------------------------------------------------------------------------

/**
 * Calculate the GS1 check digit for a string of N-1 payload digits.
 * The input must contain only digit characters. Throws if it does not.
 *
 * @param digits — The payload without the check digit (7, 11, 12, or 13 chars).
 * @returns The single check digit (0–9).
 */
export function calculateCheckDigit(digits: string): number {
  if (!/^\d+$/.test(digits)) {
    throw new Error("Input must contain only digit characters.");
  }

  // GS1 multiplier sequence from right to left: 3, 1, 3, 1, …
  // For the full GTIN (including check digit slot = 0), the check digit position
  // gets multiplier 1 from the right. So working left from position -1:
  //   pos 0 (rightmost payload digit) → multiplier 3
  //   pos 1 → 1
  //   pos 2 → 3  … etc.
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const digitChar = digits[digits.length - 1 - i];
    // digitChar is always defined because i < digits.length, but we guard
    // to satisfy strictNullChecks.
    const digit = Number(digitChar ?? "0");
    // Rightmost digit of payload gets multiplier 3 (i === 0)
    const multiplier = i % 2 === 0 ? 3 : 1;
    sum += digit * multiplier;
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Format a raw GTIN string with hyphens for human-readable display.
 *
 * Formatting conventions:
 *   GTIN-8  → 4-4         (xxxx-xxxx)
 *   GTIN-12 → 1-5-5-1     (UPC-A style)
 *   GTIN-13 → 1-6-6       (EAN-13 style)
 *   GTIN-14 → 1-2-5-5-1   (ITF-14 style)
 *
 * Returns the raw string unchanged if the length is not a recognised GTIN length.
 */
export function formatGTIN(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  switch (digits.length) {
    case 8:
      // GTIN-8: 4-4
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;

    case 12:
      // UPC-A: 1-5-5-1
      return `${digits.slice(0, 1)}-${digits.slice(1, 6)}-${digits.slice(6, 11)}-${digits.slice(11)}`;

    case 13:
      // EAN-13: 1-6-6
      return `${digits.slice(0, 1)}-${digits.slice(1, 7)}-${digits.slice(7)}`;

    case 14:
      // ITF-14: 1-1-5-5-2  (leading indicator + GS1 prefix + company + item + check)
      // A common display split: 1-13 check at end
      return `${digits.slice(0, 1)}-${digits.slice(1, 3)}-${digits.slice(3, 8)}-${digits.slice(8, 13)}-${digits.slice(13)}`;

    default:
      return digits;
  }
}

// ---------------------------------------------------------------------------
// GTIN-length type guard
// ---------------------------------------------------------------------------

function isGTINLength(n: number): n is GTINLength {
  return n === 8 || n === 12 || n === 13 || n === 14;
}

// ---------------------------------------------------------------------------
// Country prefix extraction
// ---------------------------------------------------------------------------

/**
 * Extract the two-digit GS1 prefix from a validated digit string and look it
 * up in the prefix map.
 *
 * For GTIN-13/14 the prefix is always the first two digits of the EAN portion.
 * For GTIN-12 (UPC-A) the first digit is the number system digit; prepend "0"
 * to normalize to a two-digit GS1 prefix.
 * For GTIN-8 the prefix system is abbreviated; we attempt best-effort lookup
 * on the first two digits.
 */
function resolveCountryPrefix(digits: string, length: GTINLength): string | null {
  switch (length) {
    case 13:
      return lookupPrefix(digits.slice(0, 2));

    case 14: {
      // Strip the leading indicator digit to get the embedded GTIN-13
      const ean13 = digits.slice(1);
      return lookupPrefix(ean13.slice(0, 2));
    }

    case 12:
      // Normalize UPC-A: prepend "0" to get a GS1-style two-digit prefix
      return lookupPrefix("0" + digits[0]);

    case 8:
      // GTIN-8 uses a compressed prefix; best-effort from first two digits
      return lookupPrefix(digits.slice(0, 2));
  }
}

// ---------------------------------------------------------------------------
// Main validate function
// ---------------------------------------------------------------------------

/**
 * Validate a GTIN string.
 *
 * Accepts raw input with optional spaces, hyphens, or other non-digit
 * separators — they are stripped before validation.
 *
 * @param input — Raw GTIN string from user input.
 * @returns GTINResult describing validity and decoded metadata.
 */
export function validateGTIN(input: string): GTINResult {
  const EMPTY: GTINResult = {
    isValid: false,
    length: null,
    checkDigit: null,
    calculatedCheckDigit: null,
    countryPrefix: null,
    error: null,
  };

  if (!input || input.trim() === "") {
    return { ...EMPTY, error: "Input is empty." };
  }

  const digits = input.replace(/\D/g, "");

  if (digits.length === 0) {
    return { ...EMPTY, error: "No digit characters found in input." };
  }

  if (!isGTINLength(digits.length)) {
    return {
      ...EMPTY,
      error: `Invalid length: ${digits.length} digit${digits.length === 1 ? "" : "s"} found. GTINs must be 8, 12, 13, or 14 digits.`,
    };
  }

  const length: GTINLength = digits.length;
  const payload = digits.slice(0, -1);
  const providedCheckDigit = Number(digits[digits.length - 1]);
  const calc = calculateCheckDigit(payload);
  const countryPrefix = resolveCountryPrefix(digits, length);

  if (calc !== providedCheckDigit) {
    return {
      isValid: false,
      length,
      checkDigit: providedCheckDigit,
      calculatedCheckDigit: calc,
      countryPrefix,
      error: `Check digit mismatch: provided ${providedCheckDigit}, expected ${calc}.`,
    };
  }

  return {
    isValid: true,
    length,
    checkDigit: providedCheckDigit,
    calculatedCheckDigit: calc,
    countryPrefix,
    error: null,
  };
}

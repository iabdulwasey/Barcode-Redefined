import { describe, it, expect } from "vitest";
import {
  validate1DData,
  calculateCheckDigit,
} from "@/engine/barcode-1d";

describe("validate1DData", () => {
  describe("EAN-13", () => {
    it("accepts 13 digits", () => {
      expect(() => validate1DData("5901234123457", "EAN-13")).not.toThrow();
    });

    it("accepts 12 digits (check digit added automatically)", () => {
      expect(() => validate1DData("590123412345", "EAN-13")).not.toThrow();
    });

    it("rejects letters", () => {
      expect(() => validate1DData("590123412345X", "EAN-13")).toThrow();
    });

    it("rejects empty string", () => {
      expect(() => validate1DData("", "EAN-13")).toThrow();
    });

    it("rejects too-short digit strings", () => {
      expect(() => validate1DData("12345", "EAN-13")).toThrow();
    });
  });

  describe("EAN-8", () => {
    it("accepts 8 digits", () => {
      expect(() => validate1DData("12345678", "EAN-8")).not.toThrow();
    });

    it("accepts 7 digits", () => {
      expect(() => validate1DData("1234567", "EAN-8")).not.toThrow();
    });

    it("rejects 9 digits", () => {
      expect(() => validate1DData("123456789", "EAN-8")).toThrow();
    });
  });

  describe("UPC-A", () => {
    it("accepts 12 digits", () => {
      expect(() => validate1DData("012345678905", "UPC-A")).not.toThrow();
    });

    it("rejects 10 digits", () => {
      expect(() => validate1DData("0123456789", "UPC-A")).toThrow();
    });
  });

  describe("CODE-39", () => {
    it("accepts uppercase alphanumeric and special chars", () => {
      expect(() => validate1DData("HELLO-123", "CODE-39")).not.toThrow();
    });

    it("rejects lowercase (unless normalized)", () => {
      // CODE-39 validator checks uppercase — lowercase would fail raw check
      // In production we normalize, but validator itself is strict
      expect(() => validate1DData("hello", "CODE-39")).toThrow();
    });
  });

  describe("PHARMACODE", () => {
    it("accepts numbers in valid range", () => {
      expect(() => validate1DData("3", "PHARMACODE")).not.toThrow();
      expect(() => validate1DData("131070", "PHARMACODE")).not.toThrow();
    });

    it("rejects values out of range", () => {
      expect(() => validate1DData("2", "PHARMACODE")).toThrow();
      expect(() => validate1DData("131071", "PHARMACODE")).toThrow();
    });
  });
});

describe("calculateCheckDigit", () => {
  it("calculates correct EAN-13 check digit", () => {
    // EAN-13 for 590123412345 → check digit is 7
    expect(calculateCheckDigit("590123412345", "EAN-13")).toBe(7);
  });

  it("calculates correct EAN-8 check digit", () => {
    // EAN-8 for 1234567 → check digit is 0
    expect(calculateCheckDigit("1234567", "EAN-8")).toBe(0);
  });
});

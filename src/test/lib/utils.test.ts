import { describe, it, expect } from "vitest";
import { contrastRatio, hexToRgb, hexToCmyk, clamp, toHexColor } from "@/lib/utils";

describe("contrastRatio", () => {
  it("returns ~21 for black on white", () => {
    const ratio = contrastRatio("#000000", "#FFFFFF");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for same color", () => {
    const ratio = contrastRatio("#FF0000", "#FF0000");
    expect(ratio).toBeCloseTo(1, 0);
  });

  it("barcode scan threshold: black on white > 3:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeGreaterThan(3);
  });

  it("low contrast blue on navy < 3:1", () => {
    expect(contrastRatio("#0000FF", "#000033")).toBeLessThan(3);
  });
});

describe("hexToRgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses 3-digit hex", () => {
    expect(hexToRgb("#F00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("returns null for invalid", () => {
    expect(hexToRgb("notahex")).toBeNull();
  });
});

describe("hexToCmyk", () => {
  it("converts black to 0,0,0,100", () => {
    expect(hexToCmyk("#000000")).toEqual({ c: 0, m: 0, y: 0, k: 100 });
  });

  it("converts white to 0,0,0,0", () => {
    expect(hexToCmyk("#FFFFFF")).toEqual({ c: 0, m: 0, y: 0, k: 0 });
  });

  it("converts red approximately", () => {
    const { c, m, y, k } = hexToCmyk("#FF0000");
    expect(c).toBe(0);
    expect(m).toBe(100);
    expect(y).toBe(100);
    expect(k).toBe(0);
  });
});

describe("clamp", () => {
  it("clamps below min", () => expect(clamp(-5, 0, 100)).toBe(0));
  it("clamps above max", () => expect(clamp(200, 0, 100)).toBe(100));
  it("passes through values in range", () => expect(clamp(50, 0, 100)).toBe(50));
});

describe("toHexColor", () => {
  it("converts RGB to hex", () => {
    expect(toHexColor(255, 0, 0)).toBe("#ff0000");
  });

  it("clamps out-of-range values", () => {
    expect(toHexColor(300, -10, 128)).toBe("#ff0080");
  });
});

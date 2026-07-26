import { describe, it, expect } from 'vitest';
import { formatBytes, calculatePrintPixels, parsePageRange } from '../formatters';

describe('formatBytes', () => {
  it('formats 0 bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5242880)).toBe('5 MB');
  });
});

describe('calculatePrintPixels', () => {
  it('calculates pixels for inches at 300 DPI', () => {
    expect(calculatePrintPixels(2, 'in', 300)).toBe(600);
  });

  it('calculates pixels for centimeters at 300 DPI', () => {
    // 2.54 cm = 1 inch = 300 px
    expect(calculatePrintPixels(2.54, 'cm', 300)).toBe(300);
  });

  it('calculates pixels for millimeters at 300 DPI', () => {
    // 25.4 mm = 1 inch = 300 px
    expect(calculatePrintPixels(25.4, 'mm', 300)).toBe(300);
  });
});

describe('parsePageRange', () => {
  it('parses single page numbers', () => {
    expect(parsePageRange('1, 3, 5', 10)).toEqual([1, 3, 5]);
  });

  it('parses page ranges with hyphens', () => {
    expect(parsePageRange('1, 3-6, 9', 10)).toEqual([1, 3, 4, 5, 6, 9]);
  });

  it('ignores out-of-bound page numbers', () => {
    expect(parsePageRange('1, 15, 20', 10)).toEqual([1]);
  });
});

/**
 * Format bytes into human-readable strings (e.g. 1.5 MB, 800 KB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate metric print pixel dimensions from physical size (in/cm/mm) and DPI
 */
export function calculatePrintPixels(
  value: number,
  unit: 'in' | 'cm' | 'mm',
  dpi: number = 300
): number {
  if (!value || value <= 0) return 0;
  let inches = value;
  if (unit === 'cm') {
    inches = value / 2.54;
  } else if (unit === 'mm') {
    inches = value / 25.4;
  }
  return Math.round(inches * dpi);
}

/**
 * Parse page range input string (e.g. "1, 3, 5-10") into array of page numbers
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim()) return [];
  const pages = new Set<number>();
  const parts = rangeStr.split(',');

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.add(page);
      }
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
}

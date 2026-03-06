/**
 * Parse date in format "Feb 3" to "2026-02-03"
 */
export function parsePostDate(raw, year = 2026) {
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const parts = raw.trim().split(/\s+/);
  const m = months[parts[0]] || 1;
  const d = parseInt(parts[1]) || 1;

  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Parse format string to extract type, variant, and slide count
 * Examples:
 *   'Static' -> { format_type: 'static', variant: null, slide_count: null }
 *   'Static (Hero)' -> { format_type: 'static', variant: 'hero', slide_count: null }
 *   'Carousel (5 Slides)' -> { format_type: 'carousel', variant: null, slide_count: 5 }
 */
export function parseFormat(raw) {
  const lower = raw.toLowerCase();
  let format_type = "static";
  let variant = null;
  let slide_count = null;

  if (lower.startsWith("carousel")) {
    format_type = "carousel";
    const slideMatch = raw.match(/(\d+)\s*slides?/i);
    if (slideMatch) {
      slide_count = parseInt(slideMatch[1]);
    }
  }

  const variantMatch = raw.match(/\(([^)]+)\)/);
  if (variantMatch) {
    const varStr = variantMatch[1].trim();
    // Only treat as variant if it doesn't contain numbers
    if (!/\d/.test(varStr)) {
      variant = varStr.toLowerCase();
    }
  }

  return { format_type, variant, slide_count };
}

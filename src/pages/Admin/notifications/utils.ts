export interface ParsedIds {
  ids: number[];
  invalid: string[];
  duplicates: number;
}

/**
 * Parses a free-form list of user IDs (commas, spaces, semicolons or new
 * lines as separators). Keeps first-seen order, drops duplicates, and
 * reports tokens that aren't positive whole numbers.
 */
export function parseUserIds(raw: string): ParsedIds {
  const tokens = raw.split(/[\s,;]+/).filter(Boolean);
  const seen = new Set<number>();
  const invalid: string[] = [];
  let duplicates = 0;

  for (const token of tokens) {
    const n = Number(token);
    if (!/^\d+$/.test(token) || !Number.isSafeInteger(n) || n <= 0) {
      invalid.push(token);
    } else if (seen.has(n)) {
      duplicates++;
    } else {
      seen.add(n);
    }
  }

  return { ids: [...seen], invalid, duplicates };
}

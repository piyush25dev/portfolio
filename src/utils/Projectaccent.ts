export const ACCENT_COLORS = [
  '#D8C5FF', // Light Lavender
  '#BDE7FF', // Ice Blue
  '#C5F5DC', // Soft Mint
  '#FFD1E3', // Pastel Pink
  '#FFE5B4', // Peach Cream
  '#D5DCFF', // Light Periwinkle
];
export const titleToSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .trim();

const hashString = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const getProjectAccent = (title: string, override?: string): string => {
  if (override) return override;
  return ACCENT_COLORS[hashString(titleToSlug(title)) % ACCENT_COLORS.length];
};
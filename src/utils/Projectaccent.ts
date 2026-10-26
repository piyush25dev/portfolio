export const ACCENT_COLORS = ['#FF5252', '#FF9800', '#ffff11', '#FBC02D', '#CE93D8', '#ffffff'];

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
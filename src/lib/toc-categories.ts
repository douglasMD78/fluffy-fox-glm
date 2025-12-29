export const TOC_CATEGORIES = [
  "ACOMPANHAMENTOS, SALADAS & SOPAS",
  "BOLOS, DOCES & SOBREMESAS",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "SALGADOS E REFEIÇÕES",
  "SHAKES E IOGURTES",
];

export const OTHER_CATEGORY = "OUTRAS RECEITAS";

// Normalização simples mas eficaz
export const normalizeCategory = (s: string | undefined | null): string => {
  if (!s) return "";
  
  return String(s)
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[,\.;:]/g, '') // Remove pontuação
    .replace(/\bE\b/g, '&') // E para &
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
};
export const TOC_CATEGORIES = [
  "ACOMPANHAMENTOS, SALADAS & SOPAS",
  "BOLOS, DOCES & SOBREMESAS",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "SALGADOS E REFEIÇÕES",
  "SHAKES E IOGURTES",
];

export const OTHER_CATEGORY = "OUTRAS RECEITAS";

// Normalização robusta para casar variações de grafia (E ↔ &, espaços, maiúsculas, pontuação, diacríticos)
export const normalizeCategory = (s: string | undefined | null) => {
  if (!s) return "";
  
  return String(s)
    .trim()
    .toUpperCase()
    // Normalizar diacríticos (acentos, til, cedilha)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    // Substituir variantes de "E" e "&"
    .replace(/\bE\b/g, '&')
    .replace(/\s+E\s+/g, ' & ')
    // Remover pontuações (vírgulas, pontos, vírgulas)
    .replace(/[,\.;:]/g, '')
    // Remover espaços extras e hífens
    .replace(/[\s\-]+/g, ' ')
    .trim();
};
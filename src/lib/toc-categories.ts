export const TOC_CATEGORIES = [
  "ACOMPANHAMENTOS, SALADAS & SOPAS",
  "BOLOS, DOCES & SOBREMESAS",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "SALGADOS E REFEIÇÕES",
  "SHAKES E IOGURTES",
];

export const OTHER_CATEGORY = "OUTRAS RECEITAS";

// Normalização básica para casar variações de grafia (E ↔ &, espaços, maiúsculas)
export const normalizeCategory = (s: string | undefined | null) => {
  return String(s || "")
    .trim()
    .toUpperCase()
    .replace(/\s+E\s+/g, " & ");
};
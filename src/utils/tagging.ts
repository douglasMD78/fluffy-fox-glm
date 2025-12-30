"use client";

export type TagCode = "CM" | "LM" | "A" | "LT" | "J" | "S" | "AC" | "B";

/**
 * Normaliza uma string de códigos de tag (ex.: "cm, lt") para array ["CM","LT"] sem duplicatas.
 */
export function normalizeCodes(codeStr: string | undefined | null): TagCode[] {
  const raw = String(codeStr || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean) as TagCode[];

  // remove duplicatas preservando ordem
  const seen = new Set<string>();
  const out: TagCode[] = [];
  for (const c of raw) {
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

function includesAny(arr: string[], candidates: string[]) {
  return candidates.some((c) => arr.includes(c));
}

function titleHas(title: string | undefined, keyword: string) {
  return String(title || "").toUpperCase().includes(keyword.toUpperCase());
}

/**
 * Heurística simples de recomendação de tags baseada em categoria e palavras-chave do título.
 */
export function getRecommendedTags(title: string | undefined, category: string | undefined): TagCode[] {
  const cat = String(category || "").toUpperCase();

  // Regras por categoria principal
  if (cat.includes("CAFÉ DA MANHÃ") || cat.includes("LANCHES RÁPIDOS")) {
    // CM/LM
    return ["CM", "LM"];
  }

  if (cat.includes("BOLOS") || cat.includes("DOCES") || cat.includes("SOBREMESAS")) {
    return ["S"];
  }

  if (cat.includes("ACOMPANHAMENTOS") || cat.includes("SALADAS")) {
    // Acompanhamentos e saladas costumam ser AC
    // Caldinhos são tratados abaixo via título
    return ["AC"];
  }

  if (cat.includes("SALGADOS") || cat.includes("REFEIÇÕES")) {
    return ["A", "J"];
  }

  if (cat.includes("SHAKES") || cat.includes("IOGURTES")) {
    // Bases clássicas: Iogurte Natural Infinito, Shake Laxativo => B + um slot de consumo (LM/LT/CM)
    const t = String(title || "").toUpperCase();
    if (t.includes("IOGURTE NATURAL INFINITO") || t.includes("SHAKE LAXATIVO")) {
      return ["B", "LM"];
    }
    // Demais shakes/iogurtes: geralmente lanche
    return ["LM"];
  }

  // Ajustes finos por palavras-chave do título (independente da categoria)
  const t = String(title || "").toUpperCase();
  if (t.includes("CALDINHO") || t.includes("SOPA")) {
    // Caldos tendem a ser refeição leve -> A/J
    return ["A", "J"];
  }
  if (t.includes("TOAST") || t.includes("SANDUÍCHE") || t.includes("PÃO")) {
    return ["LM", "CM"];
  }
  if (t.includes("WAFFLE") || t.includes("PANQUECA") || t.includes("OVERNIGHT OATS") || t.includes("CREPIOCA")) {
    return ["CM", "LM"];
  }

  // Fallback neutro (sem forte indicação)
  return [];
}

/**
 * Valida se as tags atuais cobrem ao menos uma das recomendadas e identifica lacunas.
 * - ok: pelo menos uma das recomendadas está presente.
 * - missing: recomendadas que não aparecem nas atuais.
 * - recommended: conjunto recomendado inteiro (para UI sugerir).
 */
export function validateTags(currentCodesStr: string | undefined, title: string | undefined, category: string | undefined) {
  const current = normalizeCodes(currentCodesStr);
  const recommended = getRecommendedTags(title, category);

  const missing: TagCode[] = recommended.filter((rc) => !current.includes(rc));
  const ok = recommended.length === 0 ? current.length > 0 : includesAny(current, recommended);

  return { ok, current, recommended, missing };
}
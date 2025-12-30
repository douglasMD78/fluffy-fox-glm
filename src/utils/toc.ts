import { TEMPLATES } from "@/lib/constants";
import type { PageData } from "@/data/initialData";

export type TocItem =
  | { kind: "section"; title: string }
  | {
      kind: "recipe";
      title: string;
      pageId: string;
      time?: string;
      yield?: string;
      tags?: string;
    };

/**
 * Como o Sumário tem 2 colunas e títulos longos podem quebrar linha,
 * precisamos de folga real para não estourar a altura e cortar texto na impressão.
 */
export const TOC_MAX_UNITS_PER_PAGE = 34;

function normalizedTitle(s: string) {
  return String(s || "").trim().replace(/\s+/g, " ");
}

function recipeUnitsByTitle(title: string) {
  // Base: 1 item.
  // Se o título é longo, ele tende a quebrar linha e "custa" mais altura.
  const t = normalizedTitle(title);

  let u = 1;

  // thresholds calibrados para A5 em 2 colunas com font 11px
  if (t.length > 28) u += 0.6;
  if (t.length > 40) u += 0.6;
  if (t.length > 52) u += 0.6;

  // parênteses costumam aumentar quebra
  if (t.includes("(") || t.includes(")")) u += 0.2;

  return u;
}

function unitsFor(it: TocItem) {
  if (it.kind === "section") return 2;
  return recipeUnitsByTitle(it.title);
}

function partUnits(part: TocItem[]) {
  return part.reduce((acc, it) => acc + unitsFor(it), 0);
}

function endsWithSection(part: TocItem[]) {
  const last = part[part.length - 1];
  return Boolean(last && last.kind === "section");
}

function fixTrailingSection(parts: TocItem[][]) {
  for (let i = 0; i < parts.length - 1; i++) {
    while (parts[i].length > 0 && endsWithSection(parts[i])) {
      const section = parts[i].pop();
      if (!section) break;
      parts[i + 1].unshift(section);
    }
  }
}

function ensureSectionHasFollower(parts: TocItem[][]) {
  // Evita uma página começar com "seção" e logo em seguida outra seção,
  // ou ficar com seção "solta" no topo sem receita visível.
  for (let i = 0; i < parts.length; i++) {
    const first = parts[i][0];
    const second = parts[i][1];

    if (first?.kind === "section" && (!second || second.kind === "section")) {
      // tenta puxar 1 receita da página anterior (se existir)
      if (i > 0) {
        const prev = parts[i - 1];
        const candidate = prev[prev.length - 1];
        if (candidate && candidate.kind === "recipe") {
          parts[i].unshift(prev.pop()!);
        }
      }
    }
  }
}

export function buildTocItems(pages: PageData[]): TocItem[] {
  const items: TocItem[] = [];

  for (const p of pages) {
    if (p.type === TEMPLATES.SECTION) {
      items.push({ kind: "section", title: String(p.title || "").trim() });
      continue;
    }
    if (p.type === TEMPLATES.RECIPE) {
      items.push({
        kind: "recipe",
        title: String(p.title || "").trim(),
        pageId: String(p.id),
        time: (p as any).time ? String((p as any).time) : undefined,
        yield: (p as any).yield ? String((p as any).yield) : undefined,
        tags: (p as any).code ? String((p as any).code) : undefined,
      });
      continue;
    }
  }

  return items.filter((it) =>
    it.kind === "section" ? Boolean(it.title) : Boolean(it.title && it.pageId),
  );
}

export function splitTocIntoParts(items: TocItem[], maxUnitsPerPage: number): TocItem[][] {
  const parts: TocItem[][] = [];
  let current: TocItem[] = [];
  let used = 0;

  for (const it of items) {
    const u = unitsFor(it);

    if (current.length > 0 && used + u > maxUnitsPerPage) {
      parts.push(current);
      current = [];
      used = 0;
    }

    current.push(it);
    used += u;
  }

  if (current.length) parts.push(current);

  const normalized = parts.length ? parts : [[]];

  // Regras "inteligentes" para não estourar altura e não ficar feio.
  fixTrailingSection(normalized);
  ensureSectionHasFollower(normalized);

  return normalized;
}

export function getPrintablePageNumberMap(pages: PageData[]) {
  const map = new Map<string, number>();
  let n = 0;

  for (const p of pages) {
    if (p.type === TEMPLATES.COVER) continue;
    n += 1;
    map.set(String(p.id), n);
  }

  return map;
}
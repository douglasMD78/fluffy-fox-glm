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
 * Como agora o sumário está mais "enxuto", caberia mais conteúdo,
 * mas precisamos de folga para não cortar na impressão (área segura inferior).
 */
export const TOC_MAX_UNITS_PER_PAGE = 40;

function unitsFor(it: TocItem) {
  // Layout atual (sem meta/tags): seção ocupa um pouco mais; receita ocupa menos.
  return it.kind === "section" ? 2 : 1;
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

function balanceLastTwo(parts: TocItem[][], maxUnitsPerPage: number) {
  if (parts.length < 2) return;

  const lastIdx = parts.length - 1;
  const a = parts[lastIdx - 1];
  const b = parts[lastIdx];

  const minDesired = Math.floor(maxUnitsPerPage * 0.7);

  // Se a última página está muito vazia, puxar algumas receitas da anterior.
  // Mantém regra de não terminar em seção.
  while (
    partUnits(b) < minDesired &&
    partUnits(a) > minDesired &&
    a.length > 0
  ) {
    // não mover seção sozinha
    const candidate = a[a.length - 1];
    if (!candidate) break;

    if (candidate.kind === "section") {
      // se a anterior está terminando em seção, empurra ela pra próxima (e continua)
      fixTrailingSection(parts);
      break;
    }

    const u = unitsFor(candidate);
    if (partUnits(b) + u > maxUnitsPerPage) break;

    b.unshift(a.pop()!);
    fixTrailingSection(parts);
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

  // Regras "inteligentes"
  fixTrailingSection(normalized);
  balanceLastTwo(normalized, maxUnitsPerPage);

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
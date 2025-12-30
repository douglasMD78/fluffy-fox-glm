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

export const TOC_MAX_UNITS_PER_PAGE = 48;

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

  return items.filter((it) => (it.kind === "section" ? Boolean(it.title) : Boolean(it.title && it.pageId)));
}

export function splitTocIntoParts(items: TocItem[], maxUnitsPerPage: number): TocItem[][] {
  const parts: TocItem[][] = [];
  let current: TocItem[] = [];
  let used = 0;

  // Ajustado para refletir o layout atual (sem linha de meta/tags):
  // Seção ocupa um pouco mais; receita ocupa menos.
  const unitsFor = (it: TocItem) => (it.kind === "section" ? 2 : 1);

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
  return parts.length ? parts : [[]];
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
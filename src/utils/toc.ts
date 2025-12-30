import { TEMPLATES } from "@/lib/constants";
import type { PageData } from "@/data/initialData";

export type TocItem = {
  kind: "section";
  title: string;
  pageId: string;
};

export function buildTocItems(pages: PageData[]): TocItem[] {
  const items: TocItem[] = [];

  for (const p of pages) {
    if (p.type !== TEMPLATES.SECTION) continue;

    const title = String(p.title || "").trim();
    if (!title) continue;

    items.push({
      kind: "section",
      title,
      pageId: String(p.id),
    });
  }

  return items;
}

export function splitTocIntoParts(items: TocItem[], maxItemsPerPage: number): TocItem[][] {
  const parts: TocItem[][] = [];
  let current: TocItem[] = [];

  for (const it of items) {
    if (current.length >= maxItemsPerPage) {
      parts.push(current);
      current = [];
    }
    current.push(it);
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
import React, { useMemo } from "react";
import type { PageData, TocPageData } from "@/data/initialData";
import {
  buildTocItems,
  getPrintablePageNumberMap,
  splitTocIntoParts,
  TOC_MAX_UNITS_PER_PAGE,
} from "@/utils/toc";

interface TocViewProps {
  data: TocPageData;
  allPages: PageData[];
}

export const TocView: React.FC<TocViewProps> = ({ data, allPages }) => {
  const { part } = data;

  const fontScale = Math.max(0.8, Math.min(1, Number((data as any).fontScale ?? 1)));
  const itemFontPx = Math.round(11 * fontScale * 10) / 10;

  const { itemsForThisPart, totalParts, pageNumberById } = useMemo(() => {
    const pageNumberById = getPrintablePageNumberMap(allPages);

    // Importante: usa as páginas SEM o próprio sumário para evitar circularidade.
    const pagesWithoutToc = allPages.filter((p) => p.type !== "toc");
    const items = buildTocItems(pagesWithoutToc);

    const parts = splitTocIntoParts(items, TOC_MAX_UNITS_PER_PAGE);
    const idx = Math.max(1, part || 1) - 1;

    return {
      itemsForThisPart: parts[idx] || [],
      totalParts: parts.length,
      pageNumberById,
    };
  }, [allPages, part]);

  const isLastPart = (part || 1) >= totalParts;

  return (
    <div className="flex-1 flex flex-col h-full bg-white font-sans">
      <div className="px-8 pt-10 pb-6 text-center">
        <h1 className="font-playfair text-3xl font-bold text-navy uppercase tracking-[0.25em]">Sumário</h1>
        <div className="w-14 h-1 bg-accent/70 mx-auto mt-4 rounded-full" />
        {totalParts > 1 && (
          <p className="mt-3 text-[10px] font-bold tracking-widest uppercase text-navy/50">
            Parte {part} de {totalParts}
          </p>
        )}
      </div>

      {/* Safe-area real */}
      <div className="flex-1 px-8 pb-14">
        <div className="columns-2 gap-8">
          {itemsForThisPart.map((it, i) => {
            if (it.kind === "section") {
              return (
                <div key={`${it.kind}-${i}`} className="break-inside-avoid mb-3 mt-2">
                  <div
                    className="font-black tracking-[0.18em] uppercase text-accent"
                    style={{ fontSize: `${itemFontPx}px` }}
                  >
                    {it.title}
                  </div>
                  <div className="mt-2 h-px w-full bg-accent/15" />
                </div>
              );
            }

            const pageNum = pageNumberById.get(it.pageId);
            const pageLabel = pageNum ? String(pageNum).padStart(2, "0") : "--";

            return (
              <div key={`${it.kind}-${it.pageId}`} className="break-inside-avoid mb-3">
                <div className="flex items-end gap-2">
                  <div
                    className="font-bold text-navy leading-snug flex-1"
                    style={{ fontSize: `${itemFontPx}px` }}
                  >
                    {it.title}
                  </div>
                  <div className="flex-1 border-b border-dotted border-navy/25 translate-y-[-3px]" />
                  <div className="font-black text-navy tabular-nums" style={{ fontSize: `${itemFontPx}px` }}>
                    {pageLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="border-t border-navy/10 pt-3">
          <div className="text-center text-[9px] text-navy/40 font-bold tracking-widest uppercase">
            {!isLastPart ? "Continua na próxima página" : "Boa leitura"}
          </div>
        </div>
      </div>
    </div>
  );
};
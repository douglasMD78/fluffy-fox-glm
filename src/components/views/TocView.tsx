import React, { useMemo } from "react";
import type { PageData, TocPageData } from "@/data/initialData";
import { buildTocItems, getPrintablePageNumberMap, splitTocIntoParts } from "@/utils/toc";

interface TocViewProps {
  data: TocPageData;
  allPages: PageData[];
}

export const TocView: React.FC<TocViewProps> = ({ data, allPages }) => {
  const { part } = data;

  const { itemsForThisPart, totalParts, pageNumberById } = useMemo(() => {
    const pageNumberById = getPrintablePageNumberMap(allPages);

    // Importante: usa as páginas SEM o próprio sumário para evitar circularidade.
    const pagesWithoutToc = allPages.filter((p) => p.type !== "toc");
    const items = buildTocItems(pagesWithoutToc);

    // Só categorias -> geralmente 1 página, mas continua paginável.
    const parts = splitTocIntoParts(items, 30);
    const idx = Math.max(1, part || 1) - 1;

    return {
      itemsForThisPart: parts[idx] || [],
      totalParts: parts.length,
      pageNumberById,
    };
  }, [allPages, part]);

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

      <div className="flex-1 px-8 pb-10">
        <div className="space-y-3">
          {itemsForThisPart.map((it) => {
            const pageNum = pageNumberById.get(it.pageId);
            const pageLabel = pageNum ? String(pageNum).padStart(2, "0") : "--";

            return (
              <div key={it.pageId} className="break-inside-avoid">
                <div className="flex items-end gap-2">
                  <div className="text-[11px] font-black tracking-[0.18em] uppercase text-accent whitespace-nowrap">
                    {it.title}
                  </div>
                  <div className="flex-1 border-b border-dotted border-navy/25 translate-y-[-3px]" />
                  <div className="text-[11px] font-black text-navy tabular-nums">{pageLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-[9px] text-navy/40 font-bold tracking-widest uppercase">
          {totalParts > 1 ? "Continua na próxima página" : "Boa leitura"}
        </div>
      </div>
    </div>
  );
};
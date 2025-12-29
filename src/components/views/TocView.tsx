"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES, MAX_TOC_ITEMS_PER_PAGE } from '@/lib/constants';
import { BookOpen } from '@/components/icons';

interface TocViewProps {
  pages: PageData[];
  data: TocPageData;
  onRecipeClick: (pageId: string) => void;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
  // Itens do sumário (todas as páginas que não são o próprio TOC)
  const allItemsForToc = pages.filter(p => p.type !== TEMPLATES.TOC);

  // Posição e fatiamento usando a paginação fixa
  const currentPageNumber = data.tocPageNumber || 1;
  const itemsPerPage = MAX_TOC_ITEMS_PER_PAGE;
  const startIndex = (currentPageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = allItemsForToc.slice(startIndex, endIndex);

  // Título com continuação quando necessário
  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

  // Numeração editorial: front matter não entra na contagem
  const FRONT_MATTER = new Set<TEMPLATES>([
    TEMPLATES.COVER,
    TEMPLATES.INTRO,
    TEMPLATES.TOC,
    TEMPLATES.LEGEND,
  ]);
  const contentPagesForNumbering = pages.filter(p => !FRONT_MATTER.has(p.type));
  const getPageNumber = (item: PageData) => {
    if (FRONT_MATTER.has(item.type)) return null;
    const idx = contentPagesForNumbering.findIndex(p => p.id === item.id);
    if (idx === -1) return null;
    return String(idx + 1).padStart(2, '0');
  };

  const getDisplayTitle = (item: PageData) => {
    if (item.title) return item.title;
    switch (item.type) {
      case TEMPLATES.COVER: return 'Capa';
      case TEMPLATES.INTRO: return 'Introdução';
      case TEMPLATES.LEGEND: return 'Legendas';
      case TEMPLATES.SHOPPING: return 'Lista de Compras';
      case TEMPLATES.SECTION: return 'Seção';
      case TEMPLATES.RECIPE: return 'Receita';
      default: return 'Página sem Título';
    }
  };

  return (
    <div className="flex-1 flex flex-col py-8 px-6 font-sans">
      {/* Cabeçalho coerente com o app */}
      <div className="text-center mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy uppercase tracking-widest">
          {finalTitle}
        </h1>
        <div className="w-14 h-1 bg-accent mx-auto mt-2 rounded-full opacity-50"></div>
      </div>

      {/* Grid responsivo: ordem preservada, seções ocupam linha inteira */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemsToDisplay.map((item) => {
          const isSection = item.type === TEMPLATES.SECTION;
          const pageNum = getPageNumber(item);
          const title = getDisplayTitle(item);

          if (isSection) {
            return (
              <div
                key={item.id}
                className="md:col-span-2 flex items-center gap-2 py-2.5 px-4 bg-surface border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onRecipeClick(item.id)}
              >
                <BookOpen size={16} className="text-accent shrink-0" />
                <span className="text-accent font-semibold text-sm tracking-wide">
                  {title}
                </span>
                {pageNum && (
                  <span className="ml-auto text-accent font-semibold text-[11px] bg-pastel px-2 py-0.5 rounded-full shadow-sm">
                    {pageNum}
                  </span>
                )}
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="flex items-baseline justify-between py-2 px-3 bg-white/70 border border-gray-100 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => onRecipeClick(item.id)}
            >
              <span className="text-navy font-medium text-sm">{title}</span>
              {pageNum ? (
                <>
                  <div className="flex-1 border-b border-dotted border-accent/20 mx-2 mb-[3px] opacity-70"></div>
                  <span className="text-accent font-semibold text-[11px] bg-pastel px-2 py-0.5 rounded-full shadow-sm">
                    {pageNum}
                  </span>
                </>
              ) : (
                <span className="ml-2 text-sm text-muted-foreground"> </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TocView;
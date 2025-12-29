"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';

interface TocViewProps {
  pages: PageData[];
  data: TocPageData;
  onRecipeClick: (pageId: string) => void;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
  // Itens válidos para o sumário: apenas seções e receitas
  const allItemsForToc = pages.filter(p => p.type === TEMPLATES.SECTION || p.type === TEMPLATES.RECIPE);

  const currentPageNumber = data.tocPageNumber || 1;

  // NOVO: calcular itens por página dinamicamente baseado no total e no número de páginas de TOC existentes (máx. 2)
  const totalTocPages = pages.filter(p => p.type === TEMPLATES.TOC).length || 1;
  const itemsPerPage = Math.ceil(allItemsForToc.length / totalTocPages);
  const startIndex = (currentPageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsSlice = allItemsForToc.slice(startIndex, endIndex);

  // Título com continuação quando necessário
  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

  // Numeração editorial: não contar front matter
  const FRONT_MATTER = new Set<TEMPLATES>([TEMPLATES.COVER, TEMPLATES.INTRO, TEMPLATES.TOC, TEMPLATES.LEGEND, TEMPLATES.SHOPPING]);
  const contentPagesForNumbering = pages.filter(p => !FRONT_MATTER.has(p.type));
  const getPageNumber = (item: PageData) => {
    if (FRONT_MATTER.has(item.type)) return null;
    const idx = contentPagesForNumbering.findIndex(p => p.id === item.id);
    if (idx === -1) return null;
    return String(idx + 1).padStart(2, '0');
  };

  const getDisplayTitle = (item: PageData) => {
    if (item.title) return item.title;
    return item.type === TEMPLATES.SECTION ? 'Seção' : 'Receita';
  };

  // Encontrar a seção anterior do slice (para continuação)
  const previousSection = (() => {
    for (let i = startIndex - 1; i >= 0; i--) {
      const it = allItemsForToc[i];
      if (it?.type === TEMPLATES.SECTION) return it;
    }
    return null;
  })();

  // Montar blocos: cada seção seguida de suas receitas
  type Block = { section: PageData; continued: boolean; recipes: PageData[] };
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  // Se o slice começa no meio de uma seção (primeiro item é receita), abrir bloco de continuação
  if (itemsSlice[0]?.type === TEMPLATES.RECIPE && previousSection) {
    currentBlock = { section: previousSection, continued: true, recipes: [] };
    blocks.push(currentBlock);
  }

  itemsSlice.forEach((item) => {
    if (item.type === TEMPLATES.SECTION) {
      currentBlock = { section: item, continued: false, recipes: [] };
      blocks.push(currentBlock);
    } else {
      if (!currentBlock) {
        // Caso raro: receita sem seção anterior; criar bloco genérico
        currentBlock = { section: { ...item, title: 'Outras Receitas', type: TEMPLATES.SECTION } as PageData, continued: false, recipes: [] };
        blocks.push(currentBlock);
      }
      currentBlock.recipes.push(item);
    }
  });

  return (
    <div className="flex-1 flex flex-col py-6 px-5 font-sans">
      {/* Cabeçalho minimalista e compacto */}
      <div className="text-center mb-4">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy">{finalTitle}</h1>
        <div className="w-12 h-[2px] bg-navy/10 mx-auto mt-2 rounded"></div>
      </div>

      {/* Duas colunas com blocos que não quebram (compacto) */}
      <div className="columns-1 md:columns-2 gap-6">
        {blocks.map((block) => {
          const sectionTitle = `${getDisplayTitle(block.section)}${block.section.title ? `: ${block.section.title}` : ''}${block.continued ? ' (continuação)' : ''}`;
          const sectionPage = getPageNumber(block.section);
          return (
            <div key={`${block.section.id}-${block.continued ? 'cont' : 'full'}`} style={{ breakInside: 'avoid' }} className="mb-3">
              {/* Cabeçalho da seção */}
              <div
                className="flex items-baseline justify-between py-1 px-2 rounded hover:bg-surface transition-colors cursor-pointer"
                onClick={() => onRecipeClick(block.section.id)}
              >
                <span className="text-navy font-semibold text-[12px]">{sectionTitle}</span>
                <div className="flex-1 border-b border-dotted border-navy/15 mx-2 mb-[2px]"></div>
                {sectionPage && (
                  <span className="text-navy/70 font-semibold text-[10px]">{sectionPage}</span>
                )}
              </div>

              {/* Receitas da seção */}
              <ul className="mt-1 space-y-1">
                {block.recipes.map((r) => {
                  const pageNum = getPageNumber(r);
                  const title = getDisplayTitle(r);
                  return (
                    <li
                      key={r.id}
                      className="flex items-baseline justify-between py-1 px-2 pl-3 hover:bg-surface rounded cursor-pointer transition-colors"
                      onClick={() => onRecipeClick(r.id)}
                    >
                      <span className="text-navy/90 text-[12px]">{title}</span>
                      <div className="flex-1 border-b border-dotted border-navy/15 mx-2 mb-[2px]"></div>
                      {pageNum && <span className="text-navy/70 font-medium text-[10px]">{pageNum}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TocView;
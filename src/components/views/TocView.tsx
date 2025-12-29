"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { TOC_CATEGORIES, OTHER_CATEGORY, normalizeCategory } from '@/lib/toc-categories';

interface TocViewProps {
  pages: PageData[];
  data: TocPageData;
  onRecipeClick: (pageId: string) => void;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
  // Apenas receitas entram no sumário por categorias
  const recipePages = pages.filter(p => p.type === TEMPLATES.RECIPE);

  const currentPageNumber = data.tocPageNumber || 1;

  // Número de páginas de TOC criado pelo hook (limitado a 2)
  const totalTocPages = pages.filter(p => p.type === TEMPLATES.TOC).length || 1;

  // Montar lista achatada: [header, recipe, recipe, header, recipe, ...] na ordem oficial das categorias
  type FlatItem = 
    | { kind: 'header'; label: string }
    | { kind: 'recipe'; page: PageData };

  const flatItems: FlatItem[] = [];
  const normalizedCats = TOC_CATEGORIES.map(normalizeCategory);

  const assigned = new Set<string>();
  normalizedCats.forEach((catLabel, idx) => {
    const originalLabel = TOC_CATEGORIES[idx];
    const recipesInCat = recipePages.filter(r => normalizeCategory((r as any).category) === catLabel);
    if (recipesInCat.length > 0) {
      flatItems.push({ kind: 'header', label: originalLabel });
      recipesInCat.forEach(r => { flatItems.push({ kind: 'recipe', page: r }); assigned.add(r.id); });
    }
  });

  // Receitas com categoria fora da lista oficial vão para "OUTRAS RECEITAS"
  const others = recipePages.filter(r => !assigned.has(r.id));
  if (others.length > 0) {
    flatItems.push({ kind: 'header', label: OTHER_CATEGORY });
    others.forEach(r => flatItems.push({ kind: 'recipe', page: r }));
  }

  // Itens por página: dividir todo o conteúdo uniformemente entre as páginas existentes
  const itemsPerPage = Math.ceil(flatItems.length / totalTocPages);
  const startIndex = (currentPageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageSlice = flatItems.slice(startIndex, endIndex);

  // Título com continuação
  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

  // Numeração editorial (apenas conteúdo, sem front matter)
  const FRONT_MATTER = new Set<TEMPLATES>([TEMPLATES.COVER, TEMPLATES.INTRO, TEMPLATES.TOC, TEMPLATES.LEGEND, TEMPLATES.SHOPPING]);
  const contentPagesForNumbering = pages.filter(p => !FRONT_MATTER.has(p.type));
  const getPageNumber = (item: PageData) => {
    const idx = contentPagesForNumbering.findIndex(p => p.id === item.id);
    if (idx === -1) return null;
    return String(idx + 1).padStart(2, '0');
  };

  const getDisplayTitle = (item: PageData) => {
    return item.title || 'Receita';
  };

  // Encontrar cabeçalho anterior para continuação quando a página começa com receita
  const previousHeaderLabel = (() => {
    for (let i = startIndex - 1; i >= 0; i--) {
      const it = flatItems[i];
      if (it?.kind === 'header') return it.label;
    }
    return null;
  })();

  // Recriar blocos: { header, continued, recipes[] }
  type Block = { header: string; continued: boolean; recipes: PageData[] };
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  if (pageSlice[0]?.kind === 'recipe' && previousHeaderLabel) {
    currentBlock = { header: previousHeaderLabel, continued: true, recipes: [] };
    blocks.push(currentBlock);
  }

  pageSlice.forEach((it) => {
    if (it.kind === 'header') {
      currentBlock = { header: it.label, continued: false, recipes: [] };
      blocks.push(currentBlock);
    } else {
      if (!currentBlock) {
        currentBlock = { header: OTHER_CATEGORY, continued: false, recipes: [] };
        blocks.push(currentBlock);
      }
      currentBlock.recipes.push(it.page);
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
        {blocks.map((block, idx) => {
          const sectionTitle = `${block.header}${block.continued ? ' (continuação)' : ''}`;
          return (
            <div key={`${block.header}-${idx}-${block.continued ? 'cont' : 'full'}`} style={{ breakInside: 'avoid' }} className="mb-3">
              {/* Cabeçalho da categoria */}
              <div
                className="flex items-baseline justify-between py-1 px-2 rounded hover:bg-surface transition-colors cursor-pointer"
                onClick={() => {
                  const first = block.recipes[0];
                  if (first) onRecipeClick(first.id);
                }}
              >
                <span className="text-navy font-semibold text-[12px]">{sectionTitle}</span>
                <div className="flex-1 border-b border-dotted border-navy/15 mx-2 mb-[2px]"></div>
                {/* Não há número de página para cabeçalho de categoria */}
                <span className="text-navy/50 text-[10px]"></span>
              </div>

              {/* Receitas da categoria */}
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
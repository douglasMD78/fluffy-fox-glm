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
  // Somente receitas entram no TOC de categorias
  const recipePages = pages.filter(p => p.type === TEMPLATES.RECIPE);

  // Montar blocos por categoria oficial
  type CategoryBlock = { header: string; recipes: PageData[] };
  const normalizedCats = TOC_CATEGORIES.map(normalizeCategory);
  const blocks: CategoryBlock[] = [];
  const assigned = new Set<string>();

  normalizedCats.forEach((catNorm, idx) => {
    const label = TOC_CATEGORIES[idx];
    const recipesInCat = recipePages.filter(r => normalizeCategory((r as any).category) === catNorm);
    if (recipesInCat.length > 0) {
      blocks.push({ header: label, recipes: recipesInCat });
      recipesInCat.forEach(r => assigned.add(r.id));
    }
  });

  const others = recipePages.filter(r => !assigned.has(r.id));
  if (others.length > 0) {
    blocks.push({ header: OTHER_CATEGORY, recipes: others });
  }

  // NOVO: ordenar blocos e receitas pelo índice real no array de páginas (ordem de leitura)
  const pageIndexOf = (id: string) => pages.findIndex(p => p.id === id);
  const sortedBlocks: CategoryBlock[] = blocks
    .map(b => ({
      header: b.header,
      recipes: [...b.recipes].sort((r1, r2) => pageIndexOf(r1.id) - pageIndexOf(r2.id)),
      _minIdx: Math.min(...b.recipes.map(r => pageIndexOf(r.id)))
    }))
    .sort((a, b) => a._minIdx - b._minIdx)
    .map(({ _minIdx, ...rest }) => rest);

  // Quantidade de páginas de TOC existentes (máx. 2)
  const totalTocPages = pages.filter(p => p.type === TEMPLATES.TOC).length || 1;

  // Calcular "linhas" por bloco (1 cabeçalho + N receitas) e distribuir blocos entre as duas páginas
  const blockLines = (b: CategoryBlock) => 1 + b.recipes.length;
  const totalLines = sortedBlocks.reduce((sum, b) => sum + blockLines(b), 0);
  const targetPerPage = Math.ceil(totalLines / totalTocPages);

  const pagesBlocks: CategoryBlock[][] = Array.from({ length: totalTocPages }, () => []);
  const pageLines: number[] = Array.from({ length: totalTocPages }, () => 0);

  sortedBlocks.forEach((b) => {
    for (let pIdx = 0; pIdx < totalTocPages; pIdx++) {
      const fits = pageLines[pIdx] + blockLines(b) <= targetPerPage || pagesBlocks[pIdx].length === 0;
      if (fits) {
        pagesBlocks[pIdx].push(b);
        pageLines[pIdx] += blockLines(b);
        return;
      }
    }
    const last = totalTocPages - 1;
    pagesBlocks[last].push(b);
    pageLines[last] += blockLines(b);
  });

  const currentPageNumber = data.tocPageNumber || 1;
  const currentBlocks = pagesBlocks[Math.min(currentPageNumber - 1, totalTocPages - 1)] || [];

  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

  // Numeração que bate com o rodapé (posição real no array de páginas)
  const getActualPageNumber = (item: PageData) => {
    const idx = pages.findIndex(p => p.id === item.id);
    if (idx === -1) return null;
    return String(idx + 1).padStart(2, '0');
  };

  const getDisplayTitle = (item: PageData) => item.title || 'Receita';

  return (
    <div className="flex-1 flex flex-col py-6 px-5 font-sans">
      <div className="text-center mb-4">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy">{finalTitle}</h1>
        <div className="w-12 h-[2px] bg-navy/10 mx-auto mt-2 rounded"></div>
      </div>

      {/* Duas colunas por página, blocos não quebram */}
      <div className="columns-1 md:columns-2 gap-6">
        {currentBlocks.map((block, idx) => (
          <div key={`${block.header}-${idx}`} style={{ breakInside: 'avoid' }} className="mb-3">
            {/* Cabeçalho da categoria */}
            <div
              className="flex items-baseline justify-between py-1 px-2 rounded hover:bg-surface transition-colors cursor-pointer"
              onClick={() => {
                const first = block.recipes[0];
                if (first) onRecipeClick(first.id);
              }}
            >
              <span className="text-navy font-semibold text-[12px]">{block.header}</span>
              <div className="flex-1 border-b border-dotted border-navy/15 mx-2 mb-[2px]"></div>
              <span className="text-navy/50 text-[10px]"></span>
            </div>

            {/* Receitas da categoria */}
            <ul className="mt-1 space-y-1">
              {block.recipes.map((r) => {
                const pageNum = getActualPageNumber(r);
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
        ))}
      </div>
    </div>
  );
};

export default TocView;
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
  // Performance: criar mapa de índices uma vez
  const indexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((p, i) => map.set(p.id, i));
    return map;
  }, [pages]);

  // Performance: cache de categoria normalizada
  const normalizedCategoryCache = React.useMemo(() => {
    const cache = new Map<string, string>();
    pages.forEach(p => {
      if (p.type === TEMPLATES.RECIPE && (p as any).category) {
        cache.set(p.id, normalizeCategory((p as any).category));
      }
    });
    return cache;
  }, [pages]);

  // Somente receitas entram no TOC de categorias
  const recipePages = pages.filter(p => p.type === TEMPLATES.RECIPE);

  // Montar blocos por categoria oficial
  type CategoryBlock = { header: string; recipes: PageData[] };
  const normalizedCats = TOC_CATEGORIES.map(normalizeCategory);
  const blocks: CategoryBlock[] = [];
  const assigned = new Set<string>();

  normalizedCats.forEach((catNorm, idx) => {
    const label = TOC_CATEGORIES[idx];
    const recipesInCat = recipePages.filter(r => {
      const cachedCat = normalizedCategoryCache.get(r.id);
      return cachedCat === catNorm;
    });
    if (recipesInCat.length > 0) {
      blocks.push({ header: label, recipes: recipesInCat });
      recipesInCat.forEach(r => assigned.add(r.id));
    }
  });

  const others = recipePages.filter(r => !assigned.has(r.id));
  if (others.length > 0) {
    blocks.push({ header: OTHER_CATEGORY, recipes: others });
  }

  // Ordenar blocos e receitas pelo índice real no array de páginas (ordem de leitura)
  const pageIndexOf = (id: string) => indexMap.get(id) ?? -1;
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

  // Algoritmo melhorado de distribuição de blocos (balanceamento para 2 páginas)
  const distributeBlocks = (blocks: CategoryBlock[], totalPages: number): CategoryBlock[][] => {
    if (totalPages <= 1) return [blocks];
    
    const totalLines = blocks.reduce((sum, b) => sum + 1 + b.recipes.length, 0);
    const targetLines = Math.ceil(totalLines / totalPages);
    
    // Tentar todas as combinações para 2 páginas (pequeno backtracking)
    let bestDistribution: CategoryBlock[][] = [];
    let minDiff = Infinity;
    
    // Gerar todos os pontos de corte possíveis
    for (let i = 0; i <= blocks.length; i++) {
      const page1 = blocks.slice(0, i);
      const page2 = blocks.slice(i);
      
      if (page1.length > 0 && page2.length > 0) {
        const lines1 = page1.reduce((sum, b) => sum + 1 + b.recipes.length, 0);
        const lines2 = page2.reduce((sum, b) => sum + 1 + b.recipes.length, 0);
        const diff = Math.abs(lines1 - lines2);
        
        if (diff < minDiff) {
          minDiff = diff;
          bestDistribution = [page1, page2];
        }
      }
    }
    
    // Se não encontrou distribuição balanceada, usar fallback
    if (bestDistribution.length === 0) {
      return [blocks];
    }
    
    return bestDistribution;
  };

  const pagesBlocks = distributeBlocks(sortedBlocks, totalTocPages);

  const currentPageNumber = data.tocPageNumber || 1;
  const currentBlocks = pagesBlocks[Math.min(currentPageNumber - 1, totalTocPages - 1)] || [];

  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

  // Numeração configurável
  const getActualPageNumber = (item: PageData) => {
    const idx = indexMap.get(item.id);
    if (idx === undefined) return null;
    
    const numberingStyle = data.numberingStyle || 'absolute';
    
    if (numberingStyle === 'editorial') {
      // Contar apenas páginas de conteúdo (excluindo capa, intro, TOC, legend)
      let editorialNumber = 0;
      for (let i = 0; i <= idx; i++) {
        const pageType = pages[i]?.type;
        if (pageType === TEMPLATES.RECIPE || pageType === TEMPLATES.SECTION || pageType === TEMPLATES.SHOPPING) {
          editorialNumber++;
        }
      }
      return String(editorialNumber).padStart(2, '0');
    }
    
    // Numeração absoluta (padrão)
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
      <div className="columns-1 md:columns-2 gap-6 print:columns-2">
        {currentBlocks.map((block, idx) => (
          <div 
            key={`${block.header}-${idx}`} 
            style={{ 
              breakInside: 'avoid',
              pageBreakInside: 'avoid',
              columnBreakInside: 'avoid'
            }} 
            className="mb-3 print:mb-4"
          >
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
                    {pageNum ? (
                      <span className="text-navy/70 font-medium text-[10px]">{pageNum}</span>
                    ) : (
                      <span className="text-navy/30 font-medium text-[10px]">--</span>
                    )}
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
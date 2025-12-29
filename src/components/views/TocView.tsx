"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { TOC_CATEGORIES, OTHER_CATEGORY, normalizeCategory } from '@/lib/toc-categories';

interface TocViewProps {
  pages: PageData[];
  data: TocPageData;
  onRecipeClick: (pageId: string) => void;
}

interface TocItem {
  id: string;
  title: string;
  pageNumber: string;
  isSection?: boolean;
}

interface TocColumn {
  items: TocItem[];
  height: number;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tocColumns, setTocColumns] = useState<TocColumn[]>([]);

  // Cache de índices para performance
  const indexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((p, i) => map.set(p.id, i));
    return map;
  }, [pages]);

  // Gerar itens do TOC
  const generateTocItems = (): TocItem[] => {
    const items: TocItem[] = [];
    const recipePages = pages.filter(p => p.type === TEMPLATES.RECIPE);
    const normalizedCats = TOC_CATEGORIES.map(normalizeCategory);
    const assigned = new Set<string>();

    // Agrupar receitas por categoria
    normalizedCats.forEach((catNorm, idx) => {
      const categoryLabel = TOC_CATEGORIES[idx];
      const recipesInCat = recipePages.filter(r => 
        normalizeCategory((r as any).category) === catNorm
      );

      if (recipesInCat.length > 0) {
        // Adicionar seção
        items.push({
          id: `section-${categoryLabel}`,
          title: categoryLabel,
          pageNumber: '',
          isSection: true
        });

        // Adicionar receitas ordenadas por posição
        recipesInCat
          .sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0))
          .forEach(recipe => {
            const idx = indexMap.get(recipe.id);
            if (idx !== undefined) {
              const pageNum = getPageNumber(recipe, idx);
              items.push({
                id: recipe.id,
                title: recipe.title || 'Receita',
                pageNumber: pageNum
              });
              assigned.add(recipe.id);
            }
          });
      }
    });

    // Adicionar "OUTRAS RECEITAS" se houver
    const others = recipePages.filter(r => !assigned.has(r.id));
    if (others.length > 0) {
      items.push({
        id: 'section-others',
        title: OTHER_CATEGORY,
        pageNumber: '',
        isSection: true
      });

      others
        .sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0))
        .forEach(recipe => {
          const idx = indexMap.get(recipe.id);
          if (idx !== undefined) {
            const pageNum = getPageNumber(recipe, idx);
            items.push({
              id: recipe.id,
              title: recipe.title || 'Receita',
              pageNumber: pageNum
            });
          }
        });
    }

    return items;
  };

  // Obter número da página conforme configuração
  const getPageNumber = (item: PageData, idx: number): string => {
    const numberingStyle = data.numberingStyle || 'absolute';
    
    if (numberingStyle === 'editorial') {
      // Contar apenas páginas de conteúdo
      let editorialNumber = 0;
      for (let i = 0; i <= idx; i++) {
        const pageType = pages[i]?.type;
        if (pageType === TEMPLATES.RECIPE || pageType === TEMPLATES.SECTION || pageType === TEMPLATES.SHOPPING) {
          editorialNumber++;
        }
      }
      return String(editorialNumber).padStart(2, '0');
    }
    
    // Numeração absoluta
    return String(idx + 1).padStart(2, '0');
  };

  // Calcular colunas usando medição real
  const calculateColumns = (items: TocItem[]): TocColumn[] => {
    if (!containerRef.current) return [{ items, height: 0 }];

    const containerHeight = containerRef.current.clientHeight;
    const maxColumnHeight = containerHeight * 0.9; // 90% para margem de segurança
    const columns: TocColumn[] = [];
    let currentColumn: TocItem[] = [];
    let currentHeight = 0;

    // Estimativa de altura por item (em pixels)
    const getItemHeight = (item: TocItem): number => {
      return item.isSection ? 35 : 25; // Seções mais altas
    };

    items.forEach(item => {
      const itemHeight = getItemHeight(item);
      
      if (currentHeight + itemHeight > maxColumnHeight && currentColumn.length > 0) {
        // Finalizar coluna atual
        columns.push({ items: currentColumn, height: currentHeight });
        currentColumn = [item];
        currentHeight = itemHeight;
      } else {
        currentColumn.push(item);
        currentHeight += itemHeight;
      }
    });

    // Adicionar última coluna
    if (currentColumn.length > 0) {
      columns.push({ items: currentColumn, height: currentHeight });
    }

    return columns.length > 0 ? columns : [{ items, height: 0 }];
  };

  // Atualizar colunas quando mudar conteúdo
  useEffect(() => {
    const items = generateTocItems();
    const columns = calculateColumns(items);
    setTocColumns(columns);
  }, [pages, data.numberingStyle]);

  const currentPageNumber = data.tocPageNumber || 1;
  const currentColumn = tocColumns[currentPageNumber - 1] || { items: [], height: 0 };

  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Página ${currentPageNumber})` : displayTitle;

  const handleItemClick = (item: TocItem) => {
    if (!item.isSection && item.id !== 'section-others') {
      onRecipeClick(item.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col py-6 px-5 font-sans h-full">
      <div className="text-center mb-4">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy">{finalTitle}</h1>
        <div className="w-12 h-[2px] bg-navy/10 mx-auto mt-2 rounded"></div>
      </div>

      {/* Container de referência para medição */}
      <div 
        ref={containerRef}
        className="flex-1 relative"
        style={{ minHeight: '400px' }}
      >
        {/* Grid de 2 colunas com posicionamento preciso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          {currentColumn.items.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`
                ${item.isSection 
                  ? 'font-semibold text-navy text-sm py-2 px-3 border-b border-navy/20 mb-2' 
                  : 'flex items-center justify-between py-2 px-3 hover:bg-surface rounded cursor-pointer transition-colors text-[12px]'
                }
                ${!item.isSection ? 'text-navy/80' : ''}
              `}
              onClick={() => handleItemClick(item)}
            >
              <span className={`${item.isSection ? 'text-navy font-semibold' : 'text-navy/80'}`}>
                {item.title}
              </span>
              {!item.isSection && item.pageNumber && (
                <span className="text-navy/60 font-medium text-[10px] ml-4">
                  {item.pageNumber}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de páginas do TOC */}
      {tocColumns.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-navy/10">
          {tocColumns.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx + 1 === currentPageNumber ? 'bg-navy' : 'bg-navy/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TocView;
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
  const recipePages = pages.filter(p => p.type === TEMPLATES.RECIPE);
  
  // Mapear página para número
  const getPageNumber = (pageId: string): string => {
    const idx = pages.findIndex(p => p.id === pageId);
    if (idx === -1) return '--';
    
    const numberingStyle = data.numberingStyle || 'absolute';
    
    if (numberingStyle === 'editorial') {
      // Pular capa, intro, TOC, legend
      let editorialCount = 0;
      for (let i = 0; i <= idx; i++) {
        if ([TEMPLATES.RECIPE, TEMPLATES.SECTION, TEMPLATES.SHOPPING].includes(pages[i].type)) {
          editorialCount++;
        }
      }
      return String(editorialCount).padStart(2, '0');
    }
    
    return String(idx + 1).padStart(2, '0');
  };

  // Agrupar por categoria
  const tocItems: { category: string; recipes: { id: string; title: string; page: string }[] }[] = [];
  
  TOC_CATEGORIES.forEach(cat => {
    const normalizedCat = normalizeCategory(cat);
    const recipes = recipePages.filter(r => normalizeCategory((r as any).category) === normalizedCat);
    
    if (recipes.length > 0) {
      tocItems.push({
        category: cat,
        recipes: recipes.map(r => ({
          id: r.id,
          title: r.title || 'Receita',
          page: getPageNumber(r.id)
        }))
      });
    }
  });

  // Adicionar "Outras" se houver
  const categorizedIds = new Set(tocItems.flatMap(c => c.recipes.map(r => r.id)));
  const others = recipePages.filter(r => !categorizedIds.has(r.id));
  if (others.length > 0) {
    tocItems.push({
      category: OTHER_CATEGORY,
      recipes: others.map(r => ({
        id: r.id,
        title: r.title || 'Receita',
        page: getPageNumber(r.id)
      }))
    });
  }

  const currentPageNumber = data.tocPageNumber || 1;
  const displayTitle = data.title || "SUMÁRIO";
  const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Página ${currentPageNumber})` : displayTitle;

  return (
    <div className="flex-1 flex flex-col py-6 px-5 font-sans">
      <div className="text-center mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy">{finalTitle}</h1>
        <div className="w-12 h-[2px] bg-navy/10 mx-auto mt-2 rounded"></div>
      </div>

      {/* Layout simples em duas colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-4">
          {tocItems.slice(0, Math.ceil(tocItems.length / 2)).map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-navy font-semibold text-sm border-b border-navy/20 pb-1">
                {cat.category}
              </h3>
              <div className="space-y-1 ml-2">
                {cat.recipes.map(recipe => (
                  <div 
                    key={recipe.id}
                    className="flex justify-between items-center py-1 text-[12px] text-navy/80 hover:text-navy cursor-pointer hover:bg-surface/50 rounded px-2 transition-colors"
                    onClick={() => onRecipeClick(recipe.id)}
                  >
                    <span>{recipe.title}</span>
                    <span className="text-navy/60 font-medium text-[10px]">{recipe.page}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {tocItems.slice(Math.ceil(tocItems.length / 2)).map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-navy font-semibold text-sm border-b border-navy/20 pb-1">
                {cat.category}
              </h3>
              <div className="space-y-1 ml-2">
                {cat.recipes.map(recipe => (
                  <div 
                    key={recipe.id}
                    className="flex justify-between items-center py-1 text-[12px] text-navy/80 hover:text-navy cursor-pointer hover:bg-surface/50 rounded px-2 transition-colors"
                    onClick={() => onRecipeClick(recipe.id)}
                  >
                    <span>{recipe.title}</span>
                    <span className="text-navy/60 font-medium text-[10px]">{recipe.page}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TocView;
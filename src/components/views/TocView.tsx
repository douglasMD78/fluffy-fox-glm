"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES, MAX_TOC_ITEMS_PER_PAGE } from '@/lib/constants'; // Importando MAX_TOC_ITEMS_PER_PAGE
import { BookOpen } from '@/components/icons'; // Importando o ícone BookOpen

interface TocViewProps {
    pages: PageData[];
    data: TocPageData;
    onRecipeClick: (pageId: string) => void; // Nova prop para a função de clique
}

// Removido: const MAX_TOC_ITEMS_PER_PAGE = 15; // Define a constante para o número máximo de itens por página de sumário

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
    // Filtra todas as páginas que não são do tipo SUMÁRIO para serem listadas
    const allItemsForToc = pages.filter(p => p.type !== TEMPLATES.TOC);

    const currentPageNumber = data.tocPageNumber || 1;

    // NOVO: usar paginação fixa alinhada ao hook (MAX_TOC_ITEMS_PER_PAGE)
    const itemsPerPage = MAX_TOC_ITEMS_PER_PAGE;
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = allItemsForToc.slice(startIndex, endIndex);

    const displayTitle = data.title || "SUMÁRIO";
    const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

    // NOVO: numeração editorial (não contar front matter)
    const FRONT_MATTER = new Set<TEMPLATES>([
        TEMPLATES.COVER,
        TEMPLATES.INTRO,
        TEMPLATES.TOC,
        TEMPLATES.LEGEND
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
            <div className="text-center mb-6">
                <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide text-navy">{finalTitle}</h1>
                <div className="w-16 h-1 bg-rose-400/70 mx-auto mt-3 rounded-full"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                    Navegue pelas seções e receitas em ordem clara.
                </p>
            </div>

            {/* Grid responsivo: 1 coluna no mobile, 2 colunas a partir de md, preservando ordem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemsToDisplay.map((item) => {
                    const isSection = item.type === TEMPLATES.SECTION;
                    const pageNum = getPageNumber(item);
                    const title = getDisplayTitle(item);

                    if (isSection) {
                        return (
                            <div
                                key={item.id}
                                className="md:col-span-2 flex items-center gap-2 py-2.5 px-4 bg-rose-50/70 border border-rose-100 rounded-xl cursor-pointer hover:bg-rose-50 transition-colors shadow-sm"
                                onClick={() => onRecipeClick(item.id)}
                            >
                                <BookOpen size={16} className="text-rose-500 shrink-0" />
                                <span className="text-rose-700 font-semibold text-sm tracking-wide">{title}</span>
                                {pageNum && (
                                    <span className="ml-auto text-rose-700 font-semibold text-[11px] bg-rose-100 px-2 py-0.5 rounded-full shadow-sm">
                                        {pageNum}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            className="flex items-baseline justify-between py-2 px-3 bg-white/80 border border-rose-100 rounded-lg cursor-pointer hover:bg-rose-50/70 transition-colors"
                            onClick={() => onRecipeClick(item.id)}
                        >
                            <span className="text-navy font-medium text-sm">{title}</span>
                            {pageNum ? (
                                <>
                                    <div className="flex-1 border-b border-dotted border-rose-200 mx-2 mb-[3px] opacity-70"></div>
                                    <span className="text-rose-700 font-semibold text-[11px] bg-rose-100 px-2 py-0.5 rounded-full shadow-sm">
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
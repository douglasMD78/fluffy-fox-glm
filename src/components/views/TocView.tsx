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

    // NOVO: calcular dinamicamente itens por página com base na quantidade total e número de páginas existentes
    const totalTocPages = pages.filter(p => p.type === TEMPLATES.TOC).length || 1;
    const itemsPerPageDynamic = Math.ceil(allItemsForToc.length / totalTocPages);

    const startIndex = (currentPageNumber - 1) * itemsPerPageDynamic;
    const endIndex = startIndex + itemsPerPageDynamic;
    const itemsToDisplay = allItemsForToc.slice(startIndex, endIndex);

    const displayTitle = data.title || "SUMÁRIO";
    const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

    // NOVO: dividir itens em duas colunas (intercalados para balancear altura visual)
    const leftColumn: typeof itemsToDisplay = [];
    const rightColumn: typeof itemsToDisplay = [];
    itemsToDisplay.forEach((item, idx) => (idx % 2 === 0 ? leftColumn.push(item) : rightColumn.push(item)));

    return (
        <div className="flex-1 flex flex-col py-8 px-6 font-sans">
            <div className="text-center mb-6">
                <h1 className="font-playfair text-2xl md:text-3xl font-extrabold tracking-wide text-navy">
                    {finalTitle}
                </h1>
                <div className="w-16 h-1 bg-rose-400/70 mx-auto mt-3 rounded-full"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                    Navegue pelas seções e receitas com um toque delicado.
                </p>
            </div>

            {/* Grid de duas colunas com seções em col-span-2 */}
            <div className="grid grid-cols-2 gap-5">
                {/* Seções ocupam toda a largura */}
                {itemsToDisplay.filter(i => i.type === TEMPLATES.SECTION).map(i => (
                    <div 
                        key={i.id}
                        className="col-span-2 relative overflow-hidden rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onRecipeClick(i.id)}
                    >
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-rose-100/60 to-transparent pointer-events-none" />
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-rose-500 shrink-0" />
                            <span className="text-rose-700 font-bold text-sm uppercase tracking-[0.2em]">
                                {(() => {
                                    let t = i.title;
                                    if (!t) {
                                        switch (i.type) {
                                            case TEMPLATES.SECTION: return 'Seção';
                                            case TEMPLATES.COVER: return 'Capa';
                                            case TEMPLATES.INTRO: return 'Introdução';
                                            case TEMPLATES.LEGEND: return 'Legendas';
                                            case TEMPLATES.SHOPPING: return 'Lista de Compras';
                                            case TEMPLATES.RECIPE: return 'Receita';
                                            default: return 'Página';
                                        }
                                    }
                                    return t;
                                })()}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Coluna esquerda: receitas não-seção */}
                <div className="space-y-2">
                    {leftColumn.filter(i => i.type !== TEMPLATES.SECTION).map((item) => {
                        const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                        let itemDisplayTitle = item.title;
                        if (!itemDisplayTitle) {
                            switch (item.type) {
                                case TEMPLATES.COVER: itemDisplayTitle = 'Capa'; break;
                                case TEMPLATES.INTRO: itemDisplayTitle = 'Introdução'; break;
                                case TEMPLATES.LEGEND: itemDisplayTitle = 'Legendas'; break;
                                case TEMPLATES.SHOPPING: itemDisplayTitle = 'Lista de Compras'; break;
                                case TEMPLATES.RECIPE: itemDisplayTitle = 'Receita'; break;
                                default: itemDisplayTitle = 'Página'; break;
                            }
                        }
                        return (
                            <div
                                key={item.id}
                                className="group flex items-baseline justify-between rounded-lg bg-white/70 px-3 py-2 border border-rose-100 hover:bg-rose-50/70 transition-colors cursor-pointer"
                                onClick={() => onRecipeClick(item.id)}
                            >
                                <span className="text-navy font-medium text-sm group-hover:text-rose-700 transition-colors">
                                    {itemDisplayTitle}
                                </span>
                                <div className="flex-1 border-b border-dotted border-rose-200 mx-2 mb-[3px] opacity-70 group-hover:opacity-90"></div>
                                <span className="text-rose-700 font-semibold text-[11px] bg-rose-100 px-2 py-0.5 rounded-full shadow-sm">
                                    {String(pageNum).padStart(2, '0')}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Coluna direita: receitas não-seção */}
                <div className="space-y-2">
                    {rightColumn.filter(i => i.type !== TEMPLATES.SECTION).map((item) => {
                        const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                        let itemDisplayTitle = item.title;
                        if (!itemDisplayTitle) {
                            switch (item.type) {
                                case TEMPLATES.COVER: itemDisplayTitle = 'Capa'; break;
                                case TEMPLATES.INTRO: itemDisplayTitle = 'Introdução'; break;
                                case TEMPLATES.LEGEND: itemDisplayTitle = 'Legendas'; break;
                                case TEMPLATES.SHOPPING: itemDisplayTitle = 'Lista de Compras'; break;
                                case TEMPLATES.RECIPE: itemDisplayTitle = 'Receita'; break;
                                default: itemDisplayTitle = 'Página'; break;
                            }
                        }
                        return (
                            <div
                                key={item.id}
                                className="group flex items-baseline justify-between rounded-lg bg-white/70 px-3 py-2 border border-rose-100 hover:bg-rose-50/70 transition-colors cursor-pointer"
                                onClick={() => onRecipeClick(item.id)}
                            >
                                <span className="text-navy font-medium text-sm group-hover:text-rose-700 transition-colors">
                                    {itemDisplayTitle}
                                </span>
                                <div className="flex-1 border-b border-dotted border-rose-200 mx-2 mb-[3px] opacity-70 group-hover:opacity-90"></div>
                                <span className="text-rose-700 font-semibold text-[11px] bg-rose-100 px-2 py-0.5 rounded-full shadow-sm">
                                    {String(pageNum).padStart(2, '0')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
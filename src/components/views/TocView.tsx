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

    // Componente de item de sumário (seção ocupa col-span-2)
    const renderTocItem = (item: PageData) => {
        const isSection = item.type === TEMPLATES.SECTION;
        const pageNum = pages.findIndex(p => p.id === item.id) + 1;
        let itemDisplayTitle = item.title;
        if (!itemDisplayTitle) {
            switch (item.type) {
                case TEMPLATES.COVER: itemDisplayTitle = 'Capa'; break;
                case TEMPLATES.INTRO: itemDisplayTitle = 'Introdução'; break;
                case TEMPLATES.LEGEND: itemDisplayTitle = 'Legendas'; break;
                case TEMPLATES.SHOPPING: itemDisplayTitle = 'Lista de Compras'; break;
                case TEMPLATES.SECTION: itemDisplayTitle = 'Seção'; break;
                case TEMPLATES.RECIPE: itemDisplayTitle = 'Receita'; break;
                default: itemDisplayTitle = 'Página sem Título'; break;
            }
        }

        if (isSection) {
            return (
                <div 
                    key={item.id}
                    className="col-span-2 flex items-center gap-2 py-1.5 px-3 bg-accent/10 rounded-lg my-2 cursor-pointer hover:bg-accent/20 transition-colors shadow-sm"
                    onClick={() => onRecipeClick(item.id)}
                >
                    <BookOpen size={16} className="text-accent shrink-0" />
                    <span className="text-accent font-black text-sm uppercase tracking-widest">{itemDisplayTitle}</span>
                </div>
            );
        }

        return (
            <div 
                key={item.id}
                className="flex items-baseline justify-between py-1.5 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-surface rounded-md px-2 transition-colors"
                onClick={() => onRecipeClick(item.id)}
            >
                <span className="text-navy font-semibold text-sm">{itemDisplayTitle}</span>
                <div className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></div>
                <span className="text-navy font-bold text-[11px] bg-cream px-2 py-0.5 rounded-full shadow-sm">
                    {String(pageNum).padStart(2, '0')}
                </span>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col py-8 px-6 font-sans">
            <div className="text-center mb-6">
                <h1 className="font-playfair text-2xl font-bold tracking-widest text-navy">{finalTitle}</h1>
                <div className="w-14 h-1 bg-accent mx-auto mt-2 rounded-full opacity-70"></div>
            </div>

            {/* NOVO: Grid de duas colunas com seções em col-span-2 */}
            <div className="grid grid-cols-2 gap-4">
                {/* Seções que aparecem dentro do recorte da página devem ocupar toda a largura */}
                {itemsToDisplay.filter(i => i.type === TEMPLATES.SECTION).map(i => renderTocItem(i))}

                {/* Coluna esquerda: receitas não-seção */}
                <div className="space-y-1.5">
                    {leftColumn.filter(i => i.type !== TEMPLATES.SECTION).map(renderTocItem)}
                </div>

                {/* Coluna direita: receitas não-seção */}
                <div className="space-y-1.5">
                    {rightColumn.filter(i => i.type !== TEMPLATES.SECTION).map(renderTocItem)}
                </div>
            </div>
        </div>
    );
};
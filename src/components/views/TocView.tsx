"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { BookOpen } from '@/components/icons'; // Importando o ícone BookOpen

interface TocViewProps {
    pages: PageData[];
    data: TocPageData;
    onRecipeClick: (pageId: string) => void; // Nova prop para a função de clique
}

const MAX_TOC_ITEMS_PER_PAGE = 15; // Define a constante para o número máximo de itens por página de sumário

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
    // Filtra todas as páginas que não são do tipo SUMÁRIO para serem listadas
    const allItemsForToc = pages.filter(p => p.type !== TEMPLATES.TOC);

    const currentPageNumber = data.tocPageNumber || 1;
    const startIndex = (currentPageNumber - 1) * MAX_TOC_ITEMS_PER_PAGE;
    const endIndex = startIndex + MAX_TOC_ITEMS_PER_PAGE;
    const itemsToDisplay = allItemsForToc.slice(startIndex, endIndex);

    const displayTitle = data.title || "SUMÁRIO";
    const finalTitle = currentPageNumber > 1 ? `${displayTitle} (Continuação)` : displayTitle;

    return (
        <div className="flex-1 flex flex-col py-10 px-8 font-sans"> {/* Aumentado o padding horizontal */}
            <div className="text-center mb-8"> {/* Aumentado o margin-bottom */}
                <h1 className="font-playfair text-3xl font-bold tracking-widest text-navy">{finalTitle}</h1> {/* Título maior */}
                <div className="w-16 h-1.5 bg-accent mx-auto mt-3 rounded-full opacity-70"></div> {/* Divisor mais substancial */}
            </div>
            <div className="space-y-1 w-full"> {/* Ajustado o espaçamento entre os itens */}
                {itemsToDisplay.map((item) => {
                const isSection = item.type === TEMPLATES.SECTION;
                const isRecipe = item.type === TEMPLATES.RECIPE;
                const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                
                // Determina o título a ser exibido, com fallback mais específico
                let itemDisplayTitle = item.title;
                if (!itemDisplayTitle) {
                    switch (item.type) {
                        case TEMPLATES.COVER: itemDisplayTitle = 'Capa'; break;
                        case TEMPLATES.INTRO: itemDisplayTitle = 'Introdução'; break;
                        case TEMPLATES.LEGEND: itemDisplayTitle = 'Legendas'; break;
                        case TEMPLATES.SHOPPING: itemDisplayTitle = 'Lista de Compras'; break;
                        case TEMPLATES.SECTION: itemDisplayTitle = 'Seção'; break;
                        case TEMPLATES.RECIPE: itemDisplayTitle = 'Receita'; break;
                        default: itemDisplayTitle = 'Página sem Título'; break; // Fallback genérico
                    }
                }

                return (
                    <div key={item.id}> {/* Usando item.id como key */}
                        {isSection ? (
                            <div 
                                className="flex items-center gap-3 py-2 px-3 bg-accent/10 rounded-lg mb-2 mt-6 cursor-pointer hover:bg-accent/20 transition-colors"
                                onClick={() => onRecipeClick(item.id)}
                            > {/* Novo estilo para seção */}
                                <BookOpen size={16} className="text-accent shrink-0" />
                                <span className="text-accent font-black text-sm uppercase tracking-widest">{itemDisplayTitle}</span>
                            </div>
                        ) : isRecipe ? (
                            <div 
                                className="flex items-baseline justify-between py-2 border-b border-navy/10 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors"
                                onClick={() => onRecipeClick(item.id)}
                            > {/* Novo estilo para receita */}
                                <span className="text-navy/90 font-medium text-sm">{itemDisplayTitle}</span> {/* Texto da receita */}
                                <div className="flex-1 border-b border-dotted border-navy/30 mx-3 mb-1.5"></div> {/* Linha pontilhada mais grossa */}
                                <span className="text-navy font-bold text-xs bg-cream px-2 py-0.5 rounded-full shadow-sm">{String(pageNum).padStart(2, '0')}</span> {/* Badge do número da página */}
                            </div>
                        ) : (
                            // Estilo genérico para outras páginas (Capa, Intro, Legenda, Compras)
                            <div 
                                className="flex items-baseline justify-between py-2 border-b border-navy/10 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors"
                                onClick={() => onRecipeClick(item.id)}
                            >
                                <span className="text-navy/90 font-medium text-sm">{itemDisplayTitle}</span>
                                <div className="flex-1 border-b border-dotted border-navy/30 mx-3 mb-1.5"></div>
                                <span className="text-navy font-bold text-xs bg-cream px-2 py-0.5 rounded-full shadow-sm">{String(pageNum).padStart(2, '0')}</span>
                            </div>
                        )}
                    </div>
                );
                })}
            </div>
        </div>
    );
};
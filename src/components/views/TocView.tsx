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

export const TocView: React.FC<TocViewProps> = ({ pages, data, onRecipeClick }) => {
    // Agora inclui todos os tipos de página relevantes no sumário
    const items = pages.filter(p => 
        [TEMPLATES.COVER, TEMPLATES.INTRO, TEMPLATES.TOC, TEMPLATES.LEGEND, TEMPLATES.RECIPE, TEMPLATES.SECTION, TEMPLATES.SHOPPING].includes(p.type)
    );

    return (
        <div className="flex-1 flex flex-col py-10 px-8 font-sans"> {/* Aumentado o padding horizontal */}
            <div className="text-center mb-8"> {/* Aumentado o margin-bottom */}
                <h1 className="font-playfair text-3xl font-bold tracking-widest text-navy">{data.title}</h1> {/* Título maior */}
                <div className="w-16 h-1.5 bg-accent mx-auto mt-3 rounded-full opacity-70"></div> {/* Divisor mais substancial */}
            </div>
            <div className="space-y-1 w-full"> {/* Ajustado o espaçamento entre os itens */}
                {items.map((item, idx) => {
                const isSection = item.type === TEMPLATES.SECTION;
                const isRecipe = item.type === TEMPLATES.RECIPE;
                const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                
                // Determina o título a ser exibido, com fallback para 'Sem Título'
                const displayTitle = item.title || (item.type === TEMPLATES.COVER ? 'Capa' : item.type === TEMPLATES.INTRO ? 'Introdução' : item.type === TEMPLATES.LEGEND ? 'Legendas' : item.type === TEMPLATES.SHOPPING ? 'Lista de Compras' : 'Sem Título');

                return (
                    <div key={idx}>
                        {isSection ? (
                            <div 
                                className="flex items-center gap-3 py-2 px-3 bg-accent/10 rounded-lg mb-2 mt-6 cursor-pointer hover:bg-accent/20 transition-colors"
                                onClick={() => onRecipeClick(item.id)}
                            > {/* Novo estilo para seção */}
                                <BookOpen size={16} className="text-accent shrink-0" />
                                <span className="text-accent font-black text-sm uppercase tracking-widest">{displayTitle}</span>
                            </div>
                        ) : isRecipe ? (
                            <div 
                                className="flex items-baseline justify-between py-2 border-b border-navy/10 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors" // Adicionado cursor-pointer e estilos de hover
                                onClick={() => onRecipeClick(item.id)} // Torna o item clicável
                            > {/* Novo estilo para receita */}
                                <span className="text-navy/90 font-medium text-sm">{displayTitle}</span> {/* Texto da receita */}
                                <div className="flex-1 border-b border-dotted border-navy/30 mx-3 mb-1.5"></div> {/* Linha pontilhada mais grossa */}
                                <span className="text-navy font-bold text-xs bg-cream px-2 py-0.5 rounded-full shadow-sm">{String(pageNum).padStart(2, '0')}</span> {/* Badge do número da página */}
                            </div>
                        ) : (
                            // Estilo genérico para outras páginas (Capa, Intro, Legenda, Compras)
                            <div 
                                className="flex items-baseline justify-between py-2 border-b border-navy/10 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors"
                                onClick={() => onRecipeClick(item.id)}
                            >
                                <span className="text-navy/90 font-medium text-sm">{displayTitle}</span>
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
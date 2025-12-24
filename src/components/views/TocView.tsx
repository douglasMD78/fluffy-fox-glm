"use client";

import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { BookOpen } from '@/components/icons'; // Importando o ícone BookOpen

interface TocViewProps {
    pages: PageData[];
    data: TocPageData;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data }) => {
    const items = pages.filter(p => [TEMPLATES.RECIPE, TEMPLATES.SECTION].includes(p.type));
    return (
        <div className="flex-1 flex flex-col py-10 px-8 font-sans"> {/* Aumentado o padding horizontal */}
            <div className="text-center mb-8"> {/* Aumentado o margin-bottom */}
                <h1 className="font-playfair text-3xl font-bold tracking-widest text-navy">{data.title}</h1> {/* Título maior */}
                <div className="w-16 h-1.5 bg-accent mx-auto mt-3 rounded-full opacity-70"></div> {/* Divisor mais substancial */}
            </div>
            <div className="space-y-1 w-full"> {/* Ajustado o espaçamento entre os itens */}
                {items.map((item, idx) => {
                const isSection = item.type === TEMPLATES.SECTION;
                const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                return (
                    <div key={idx}>
                        {isSection ? (
                            <div className="flex items-center gap-3 py-2 px-3 bg-accent/10 rounded-lg mb-2 mt-6"> {/* Novo estilo para seção */}
                                <BookOpen size={16} className="text-accent shrink-0" />
                                <span className="text-accent font-black text-sm uppercase tracking-widest">{item.title}</span>
                            </div>
                        ) : (
                            <div className="flex items-baseline justify-between py-2 border-b border-navy/10 last:border-b-0"> {/* Novo estilo para receita */}
                                <span className="text-navy/90 font-medium text-sm">{item.title}</span> {/* Texto da receita */}
                                <div className="flex-1 border-b border-dotted border-navy/30 mx-3 mb-1.5"></div> {/* Linha pontilhada mais grossa */}
                                <span className="text-navy font-bold text-xs bg-cream px-2 py-0.5 rounded-full shadow-sm">{String(pageNum).padStart(2, '0')}</span> {/* Badge do número da página */}
                            </div>
                        )}
                    </div>
                );
                })}
            </div>
        </div>
    );
};
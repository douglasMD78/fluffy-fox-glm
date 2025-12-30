import React from 'react';
import { LegendPageData } from '@/data/initialData';
import { TAG_DEFS } from '@/lib/constants';

interface LegendViewProps {
    data: LegendPageData;
}

export const LegendView: React.FC<LegendViewProps> = ({ data }) => {
    const codes = TAG_DEFS;
    
    // Agrupar tags por categorias para melhor organização
    const mealTags = codes.filter(tag => ['CM', 'LM', 'A', 'LT', 'J'].includes(tag.code));
    const otherTags = codes.filter(tag => ['S', 'AC', 'B'].includes(tag.code));

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-white font-sans print:min-h-[297mm] print:w-[210mm] print:overflow-hidden">
            {/* Header otimizado para PDF */}
            <div className="text-center py-8 px-6 print:py-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-playfair text-2xl md:text-3xl font-bold text-navy uppercase tracking-widest mb-4 print:text-xl">
                        {data.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-0.5 w-12 bg-accent/60 print:w-8"></div>
                        <div className="w-2 h-2 bg-accent rounded-full print:w-1.5 print:h-1.5"></div>
                        <div className="h-0.5 w-12 bg-accent/60 print:w-8"></div>
                    </div>
                    <p className="text-navy/60 text-sm md:text-base leading-relaxed italic max-w-2xl mx-auto print:text-xs print:max-w-lg">
                        {data.text}
                    </p>
                </div>
            </div>

            {/* Conteúdo principal otimizado para PDF */}
            <div className="flex-1 px-6 pb-8 print:px-8 print:pb-6">
                <div className="max-w-4xl mx-auto print:max-w-none">
                    {/* Seção de Refeições */}
                    <div className="mb-10 print:mb-8">
                        <h2 className="text-center font-bold text-navy/30 text-xs uppercase tracking-widest mb-5 print:mb-4 print:text-[10px]">
                            Refeições do Dia
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 print:grid-cols-3 print:gap-3">
                            {mealTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="bg-white border border-gray-200 rounded-xl p-4 print:p-3 print:border-gray-300 print:shadow-none"
                                >
                                    <div className="flex flex-col items-center text-center space-y-2 print:space-y-1">
                                        <div className={`${tag.color} ${tag.text} font-bold text-xs w-10 h-10 flex items-center justify-center rounded-lg print:w-8 print:h-8 print:text-[10px] print-color-adjust`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy font-semibold text-[10px] uppercase tracking-wide leading-tight print:text-[9px]">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Outras Categorias */}
                    <div>
                        <h2 className="text-center font-bold text-navy/30 text-xs uppercase tracking-widest mb-5 print:mb-4 print:text-[10px]">
                            Categorias Especiais
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
                            {otherTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="bg-white border border-gray-200 rounded-xl p-4 print:p-3 print:border-gray-300 print:shadow-none"
                                >
                                    <div className="flex flex-col items-center text-center space-y-2 print:space-y-1">
                                        <div className={`${tag.color} ${tag.text} font-bold text-xs w-10 h-10 flex items-center justify-center rounded-lg print:w-8 print:h-8 print:text-[10px] print-color-adjust`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy font-semibold text-[10px] uppercase tracking-wide leading-tight print:text-[9px]">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rodapé simples para PDF */}
                    <div className="mt-12 text-center print:mt-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-px w-6 bg-accent/30 print:w-4"></div>
                            <div className="w-1 h-1 bg-accent/50 rounded-full print:w-0.5 print:h-0.5"></div>
                            <div className="h-px w-6 bg-accent/30 print:w-4"></div>
                        </div>
                        <p className="text-navy/20 text-[10px] uppercase tracking-widest print:text-[8px]">
                            Guia de Referência Rápida
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
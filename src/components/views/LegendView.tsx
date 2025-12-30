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
        <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#fafafa] to-white font-sans print:min-h-[297mm] print:w-[210mm] print:overflow-hidden">
            {/* Header elegante e delicado */}
            <div className="text-center py-10 px-6 print:py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-playfair text-2xl md:text-3xl font-light text-navy uppercase tracking-[0.3em] mb-5 print:text-[18px] print:font-light">
                        {data.title}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
                        <div className="w-1.5 h-1.5 bg-accent/70 rounded-full"></div>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent/40 to-transparent"></div>
                    </div>
                    <p className="text-navy/50 text-sm leading-relaxed font-light italic max-w-2xl mx-auto print:text-[11px] print:leading-relaxed">
                        {data.text}
                    </p>
                </div>
            </div>

            {/* Conteúdo principal com design delicado */}
            <div className="flex-1 px-8 pb-10 print:px-10 print:pb-8">
                <div className="max-w-4xl mx-auto print:max-w-none">
                    {/* Seção de Refeições */}
                    <div className="mb-12 print:mb-10">
                        <h2 className="text-center font-light text-navy/30 text-[11px] uppercase tracking-[0.2em] mb-6 print:text-[9px] print:mb-5">
                            Refeições
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 print:grid-cols-3 print:gap-4">
                            {mealTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="group bg-white/60 backdrop-blur-sm border border-gray-100/50 rounded-2xl p-5 print:p-4 print:bg-white print:border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-sm"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3 print:space-y-2">
                                        <div className={`${tag.color} ${tag.text} font-light text-xs w-11 h-11 flex items-center justify-center rounded-xl shadow-xs print:w-9 print:h-9 print:text-[10px] print:shadow-none print-color-adjust`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy/80 font-light text-[11px] uppercase tracking-wider leading-tight print:text-[9px] print:text-navy/70">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Outras Categorias */}
                    <div>
                        <h2 className="text-center font-light text-navy/30 text-[11px] uppercase tracking-[0.2em] mb-6 print:text-[9px] print:mb-5">
                            Especiais
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:grid-cols-3 print:gap-4">
                            {otherTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="group bg-white/60 backdrop-blur-sm border border-gray-100/50 rounded-2xl p-5 print:p-4 print:bg-white print:border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-sm"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3 print:space-y-2">
                                        <div className={`${tag.color} ${tag.text} font-light text-xs w-11 h-11 flex items-center justify-center rounded-xl shadow-xs print:w-9 print:h-9 print:text-[10px] print:shadow-none print-color-adjust`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy/80 font-light text-[11px] uppercase tracking-wider leading-tight print:text-[9px] print:text-navy/70">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rodapé decorativo e sutil */}
                    <div className="mt-16 text-center print:mt-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-px w-5 bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
                            <div className="w-1 h-1 bg-accent/40 rounded-full"></div>
                            <div className="h-px w-5 bg-gradient-to-l from-transparent via-accent/20 to-transparent"></div>
                        </div>
                        <p className="text-navy/20 text-[9px] uppercase tracking-[0.15em] font-light print:text-[7px]">
                            Guia de Referência
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
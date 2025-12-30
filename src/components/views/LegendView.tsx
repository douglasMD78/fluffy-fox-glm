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
        <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 font-sans">
            {/* Header elegante */}
            <div className="text-center py-12 px-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-navy uppercase tracking-widest mb-6">
                        {data.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-0.5 w-16 bg-accent/60"></div>
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <div className="h-0.5 w-16 bg-accent/60"></div>
                    </div>
                    <p className="text-navy/60 text-sm md:text-base leading-relaxed italic max-w-lg mx-auto">
                        {data.text}
                    </p>
                </div>
            </div>

            {/* Conteúdo principal com layout moderno */}
            <div className="flex-1 px-6 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Seção de Refeições */}
                    <div className="mb-12">
                        <h2 className="text-center font-bold text-navy/40 text-xs uppercase tracking-widest mb-6">
                            Refeições do Dia
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {mealTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className={`${tag.color} ${tag.text} font-bold text-sm w-12 h-12 flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy font-semibold text-xs uppercase tracking-wide leading-tight">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Outras Categorias */}
                    <div>
                        <h2 className="text-center font-bold text-navy/40 text-xs uppercase tracking-widest mb-6">
                            Categorias Especiais
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {otherTags.map((tag) => (
                                <div
                                    key={tag.code}
                                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className={`${tag.color} ${tag.text} font-bold text-sm w-12 h-12 flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                            {tag.code}
                                        </div>
                                        <span className="text-navy font-semibold text-xs uppercase tracking-wide leading-tight">
                                            {tag.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rodapé decorativo */}
                    <div className="mt-16 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-0.5 w-8 bg-accent/30"></div>
                            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full"></div>
                            <div className="h-0.5 w-8 bg-accent/30"></div>
                        </div>
                        <p className="text-navy/30 text-xs uppercase tracking-widest">
                            Guia de Referência Rápida
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
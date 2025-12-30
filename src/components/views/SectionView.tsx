import React from 'react';
import { SectionPageData } from '@/data/initialData';

interface SectionViewProps {
    data: SectionPageData;
}

export const SectionView: React.FC<SectionViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/60 h-full relative font-sans">
            {/* Background decorativo sutil mantido */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            
            {/* Container principal com design mais sofisticado */}
            <div className="relative z-10 border-4 border-double border-cream p-10 m-4 rounded-[2rem] w-4/5 shadow-lg">
                {/* Header elegante */}
                <div className="mb-8">
                    <span className="inline-block text-[10px] font-light text-accent/40 uppercase tracking-[0.3em] mb-4">
                        Capítulo de Receitas
                    </span>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
                    </div>
                </div>
                
                {/* Título principal com mais destaque */}
                <h1 className="font-playfair text-4xl font-light text-navy tracking-[0.15em] uppercase mb-6 leading-tight">
                    {data.title}
                </h1>
                
                {/* Subtítulo com posicionamento refinado */}
                <div className="relative">
                    <p className="font-hand text-4xl text-accent/90 transform -rotate-1 mb-8">
                        {data.subtitle}
                    </p>
                    {/* Elemento decorativo sutil abaixo do subtítulo */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
                            <span className="w-1 h-1 bg-accent/40 rounded-full"></span>
                            <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
                        </div>
                    </div>
                </div>

                {/* Footer elegante */}
                <div className="mt-10 pt-6 border-t border-accent/10">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
                            Receitas selecionadas
                        </span>
                        <div className="w-1 h-1 bg-accent/30 rounded-full"></div>
                        <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
                            Para seu dia a dia
                        </span>
                    </div>
                </div>
            </div>

            {/* Elementos decorativos mais elaborados */}
            <div className="absolute top-8 right-8 opacity-8">
                <div className="w-12 h-12 border-2 border-accent/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-accent/10 rounded-full"></div>
                </div>
            </div>
            <div className="absolute bottom-8 left-8 opacity-8">
                <div className="w-10 h-10 border-2 border-accent/15 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent/8 rounded-full"></div>
                </div>
            </div>

            {/* Elementos flutuantes sutis */}
            <div className="absolute top-1/4 left-1/4 opacity-3">
                <div className="w-6 h-6 border border-accent/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 opacity-3">
                <div className="w-4 h-4 border border-accent/8 rounded-full"></div>
            </div>
        </div>
    );
};
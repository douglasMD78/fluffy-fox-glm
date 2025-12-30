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
            
            {/* Container principal com melhorias sutis */}
            <div className="relative z-10 border-4 border-double border-cream p-8 m-4 rounded-[2rem] w-4/5 shadow-sm">
                {/* Divisor superior refinado */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="h-px w-8 bg-accent/20"></div>
                    <div className="w-1.5 h-1.5 bg-accent/40 rounded-full"></div>
                    <div className="h-px w-8 bg-accent/20"></div>
                </div>
                
                {/* Título com melhor espaçamento */}
                <h1 className="font-playfair text-3xl font-bold text-navy tracking-widest uppercase mb-4 leading-tight">
                    {data.title}
                </h1>
                
                {/* Subtítulo com posicionamento refinado */}
                <p className="font-hand text-3xl text-accent/80 transform -rotate-2">
                    {data.subtitle}
                </p>

                {/* Divisor inferior simétrico */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="h-px w-8 bg-accent/20"></div>
                    <div className="w-1.5 h-1.5 bg-accent/40 rounded-full"></div>
                    <div className="h-px w-8 bg-accent/20"></div>
                </div>
            </div>

            {/* Elementos decorativos sutis nos cantos */}
            <div className="absolute top-6 right-6 opacity-5">
                <div className="w-8 h-8 border border-accent/30 rounded-full"></div>
            </div>
            <div className="absolute bottom-6 left-6 opacity-5">
                <div className="w-6 h-6 border border-accent/20 rounded-full"></div>
            </div>
        </div>
    );
};
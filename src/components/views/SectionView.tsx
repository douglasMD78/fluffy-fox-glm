import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { Coffee, Cookie, Sandwich, ChefHat, Cake, Salad, Milk } from 'lucide-react';

interface SectionViewProps {
    data: SectionPageData;
}

// Mapeamento de ícones por categoria
const CATEGORY_ICONS = {
    "ACOMPANHAMENTOS, SALADAS & SOPAS": { icon: Salad, color: "text-green-600" },
    "BOLOS, DOCES & SOBREMESAS": { icon: Cake, color: "text-pink-600" },
    "CAFÉ DA MANHÃ & LANCHES RÁPIDOS": { icon: Coffee, color: "text-amber-600" },
    "SALGADOS E REFEIÇÕES": { icon: ChefHat, color: "text-orange-600" },
    "SHAKES E IOGURTES": { icon: Milk, color: "text-blue-600" }
};

export const SectionView: React.FC<SectionViewProps> = ({ data }) => {
    const categoryData = CATEGORY_ICONS[data.title as keyof typeof CATEGORY_ICONS] || { icon: Cookie, color: "text-accent" };
    const IconComponent = categoryData.icon;

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#fefefe] via-[#f8fafb] to-[#f1f5f9] h-full relative font-sans overflow-hidden">
            {/* Background decorativo sutil */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            
            {/* Corner decorations */}
            <div className="absolute top-8 right-8 opacity-10">
                <div className="w-16 h-16 border-2 border-accent rounded-full"></div>
            </div>
            <div className="absolute bottom-8 left-8 opacity-10">
                <div className="w-12 h-12 border-2 border-accent/50 rounded-full"></div>
            </div>

            {/* Conteúdo principal */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Ícone da categoria */}
                <div className="mb-6">
                    <div className={`w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center border border-accent/20`}>
                        <IconComponent size={32} className={categoryData.color} />
                    </div>
                </div>

                {/* Container do título */}
                <div className="bg-white/70 backdrop-blur-sm border-4 border-double border-cream p-8 m-4 rounded-[2rem] w-4/5 shadow-xl">
                    {/* Divisor superior */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
                    </div>

                    {/* Título principal */}
                    <h1 className="font-playfair text-3xl font-bold text-navy tracking-widest uppercase mb-4 leading-tight">
                        {data.title}
                    </h1>

                    {/* Subtítulo manuscrito */}
                    <p className="font-hand text-3xl text-accent/80 transform -rotate-2 mb-4">
                        {data.subtitle}
                    </p>

                    {/* Divisor inferior */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
                    </div>
                </div>

                {/* Elementos decorativos flutuantes */}
                <div className="flex gap-2 mt-4">
                    <span className="w-2 h-2 bg-accent/30 rounded-full"></span>
                    <span className="w-2 h-2 bg-accent/50 rounded-full"></span>
                    <span className="w-2 h-2 bg-accent/30 rounded-full"></span>
                </div>
            </div>
        </div>
    );
};
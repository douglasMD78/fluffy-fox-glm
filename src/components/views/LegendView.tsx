import React from 'react';
import { LegendPageData } from '@/data/initialData';
import { TAG_DEFS } from '@/lib/constants';
import { 
  Coffee, 
  Cookie, 
  Sandwich, 
  Soup, 
  Cake, 
  Milk,
  ChefHat,
  Salad
} from 'lucide-react';

interface LegendViewProps {
    data: LegendPageData;
}

export const LegendView: React.FC<LegendViewProps> = ({ data }) => {
    const codes = TAG_DEFS;
    
    // Agrupar tags por categorias para melhor organização
    const mealTags = codes.filter(tag => ['CM', 'LM', 'A', 'LT', 'J'].includes(tag.code));
    const otherTags = codes.filter(tag => ['S', 'AC', 'B'].includes(tag.code));

    // Mapeamento de tags para ícones do Lucide
    const TAG_ICONS = {
        'CM': { icon: Coffee, label: 'Café da Manhã' },
        'LM': { icon: Cookie, label: 'Lanche da Manhã' },
        'A': { icon: Sandwich, label: 'Almoço' },
        'LT': { icon: Cookie, label: 'Lanche da Tarde' },
        'J': { icon: ChefHat, label: 'Jantar' },
        'S': { icon: Cake, label: 'Sobremesa' },
        'AC': { icon: Salad, label: 'Acompanhamento' },
        'B': { icon: Milk, label: 'Base' }
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-[#fefefe] via-[#f8fafb] to-[#f1f5f9] font-sans print:min-h-[297mm] print:w-[210mm] print:overflow-hidden relative">
            {/* Background decorativo sutil */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] print:hidden"></div>
            
            {/* Header elegante e impactante */}
            <div className="relative text-center py-12 px-6 print:py-8 print:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 print:mb-4">
                        <span className="inline-block text-[11px] font-light text-navy/40 uppercase tracking-[0.3em] mb-3 print:text-[9px]">
                            Guia Completo
                        </span>
                    </div>
                    <h1 className="font-playfair text-3xl md:text-4xl font-light text-navy uppercase tracking-[0.2em] mb-6 print:text-[22px] print:font-light leading-tight">
                        {data.title}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/50 to-transparent print:w-8"></div>
                        <div className="w-2 h-2 bg-accent rounded-full shadow-sm print:w-1.5 print:h-1.5"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent/50 to-transparent print:w-8"></div>
                    </div>
                    <p className="text-navy/60 text-sm leading-relaxed font-light max-w-2xl mx-auto print:text-[12px] print:leading-relaxed">
                        {data.text}
                    </p>
                </div>
            </div>

            {/* Conteúdo principal com design premium */}
            <div className="relative flex-1 px-8 pb-12 print:px-12 print:pb-10">
                <div className="max-w-5xl mx-auto print:max-w-none">
                    {/* Seção de Refeições - Layout Premium */}
                    <div className="mb-12 print:mb-10">
                        <div className="text-center mb-8 print:mb-6">
                            <h2 className="font-light text-navy/40 text-xs uppercase tracking-[0.25em] mb-2 print:text-[10px]">
                                Refeições Diárias
                            </h2>
                            <div className="inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/50 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 print:grid-cols-3 print:gap-4">
                            {mealTags.map((tag) => {
                                const iconData = TAG_ICONS[tag.code as keyof typeof TAG_ICONS];
                                const IconComponent = iconData?.icon;
                                
                                return (
                                    <div
                                        key={tag.code}
                                        className="relative bg-white/70 backdrop-blur-sm border border-gray-100/60 rounded-2xl p-6 print:p-4 print:bg-white print:border-gray-200"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3 print:space-y-2">
                                            <div className={`${tag.color} ${tag.text} font-light text-xs w-12 h-12 flex items-center justify-center rounded-xl shadow-md print:w-9 print:h-9 print:text-[10px] print:shadow-sm print-color-adjust flex items-center justify-center`}>
                                                {IconComponent ? <IconComponent size={20} /> : tag.code}
                                            </div>
                                            <span className="text-navy font-light text-[11px] uppercase tracking-wider leading-tight print:text-[9px]">
                                                {tag.label}
                                            </span>
                                            <span className="text-navy/60 font-bold text-[9px] uppercase tracking-wider print:text-[7px]">
                                                {tag.code}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Seção de Outras Categorias - Layout Premium */}
                    <div className="mb-12 print:mb-10">
                        <div className="text-center mb-8 print:mb-6">
                            <h2 className="font-light text-navy/40 text-xs uppercase tracking-[0.25em] mb-2 print:text-[10px]">
                                Categorias Especiais
                            </h2>
                            <div className="inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/50 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
                            {otherTags.map((tag) => {
                                const iconData = TAG_ICONS[tag.code as keyof typeof TAG_ICONS];
                                const IconComponent = iconData?.icon;
                                
                                return (
                                    <div
                                        key={tag.code}
                                        className="relative bg-white/70 backdrop-blur-sm border border-gray-100/60 rounded-2xl p-6 print:p-4 print:bg-white print:border-gray-200"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3 print:space-y-2">
                                            <div className={`${tag.color} ${tag.text} font-light text-xs w-12 h-12 flex items-center justify-center rounded-xl shadow-md print:w-9 print:h-9 print:text-[10px] print:shadow-sm print-color-adjust flex items-center justify-center`}>
                                                {IconComponent ? <IconComponent size={20} /> : tag.code}
                                            </div>
                                            <span className="text-navy font-light text-[11px] uppercase tracking-wider leading-tight print:text-[9px]">
                                                {tag.label}
                                            </span>
                                            <span className="text-navy/60 font-bold text-[9px] uppercase tracking-wider print:text-[7px]">
                                                {tag.code}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rodapé profissional */}
                    <div className="mt-16 text-center print:mt-12">
                        <div className="flex items-center justify-center gap-3 mb-5">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent print:w-6"></div>
                            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full print:w-1 print:h-1"></div>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent/30 to-transparent print:w-6"></div>
                        </div>
                        <p className="text-navy/30 text-[10px] uppercase tracking-[0.15em] font-light print:text-[8px] mb-2">
                            Guia de Referência Rápida
                        </p>
                        <p className="text-navy/20 text-[9px] font-light italic print:text-[7px]">
                            Organização inteligente para seu dia a dia
                        </p>
                    </div>
                </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute top-8 right-8 opacity-10 print:hidden">
                <div className="w-16 h-16 border-2 border-accent rounded-full"></div>
            </div>
            <div className="absolute bottom-8 left-8 opacity-10 print:hidden">
                <div className="w-12 h-12 border-2 border-accent/50 rounded-full"></div>
            </div>
        </div>
    );
};
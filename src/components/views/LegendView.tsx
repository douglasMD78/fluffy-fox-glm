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
        <div className="flex-1 flex flex-col font-sans bg-white/60 print:bg-white">
            {/* Header */}
            <div className="text-center py-8 px-6 border-b border-accent/20">
                <span className="inline-block text-[10px] font-light text-accent/60 uppercase tracking-[0.3em] mb-3">
                    Guia de Referência
                </span>
                <h1 className="font-playfair text-2xl font-light text-navy uppercase tracking-[0.15em] mb-4">
                    {data.title}
                </h1>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
                </div>
                <p className="text-navy/60 text-sm leading-relaxed font-light max-w-2xl mx-auto">
                    {data.text}
                </p>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Seção de Refeições */}
                    <div className="mb-10">
                        <div className="text-center mb-6">
                            <h2 className="font-light text-navy/40 text-xs uppercase tracking-[0.25em] mb-2">
                                Refeições Diárias
                            </h2>
                            <div className="inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/50 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {mealTags.map((tag) => {
                                const iconData = TAG_ICONS[tag.code as keyof typeof TAG_ICONS];
                                const IconComponent = iconData?.icon;
                                
                                return (
                                    <div
                                        key={tag.code}
                                        className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        <div className={`${tag.color} ${tag.text} w-10 h-10 flex items-center justify-center rounded-lg mx-auto mb-3 shadow-sm`}>
                                            {IconComponent ? <IconComponent size={18} strokeWidth={1.75} className="shrink-0" /> : tag.code}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-navy font-light text-[10px] uppercase tracking-wider block">
                                                {tag.label}
                                            </span>
                                            <span className="text-navy/50 font-bold text-[8px] uppercase tracking-wider block">
                                                {tag.code}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Seção de Outras Categorias */}
                    <div className="mb-10">
                        <div className="text-center mb-6">
                            <h2 className="font-light text-navy/40 text-xs uppercase tracking-[0.25em] mb-2">
                                Categorias Especiais
                            </h2>
                            <div className="inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/50 rounded-full"></span>
                                <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {otherTags.map((tag) => {
                                const iconData = TAG_ICONS[tag.code as keyof typeof TAG_ICONS];
                                const IconComponent = iconData?.icon;
                                
                                return (
                                    <div
                                        key={tag.code}
                                        className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        <div className={`${tag.color} ${tag.text} w-10 h-10 flex items-center justify-center rounded-lg mx-auto mb-3 shadow-sm`}>
                                            {IconComponent ? <IconComponent size={18} strokeWidth={1.75} className="shrink-0" /> : tag.code}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-navy font-light text-[10px] uppercase tracking-wider block">
                                                {tag.label}
                                            </span>
                                            <span className="text-navy/50 font-bold text-[8px] uppercase tracking-wider block">
                                                {tag.code}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rodapé */}
                    <div className="text-center pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-6 bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
                            <div className="w-1 h-1 bg-accent/40 rounded-full"></div>
                            <div className="h-px w-6 bg-gradient-to-l from-transparent via-accent/20 to-transparent"></div>
                        </div>
                        <p className="text-navy/30 text-[9px] uppercase tracking-[0.15em] font-light mb-1">
                            Organização inteligente para seu dia a dia
                        </p>
                        <p className="text-navy/20 text-[8px] font-light italic">
                            Referência rápida de classificação
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
"use client";

import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { ImageIcon, Sparkles, Package, PlayCircle } from '@/components/icons';
import { FONT_SIZES, IMG_SIZES, SPACING_MAP, COLUMN_RATIOS } from '@/lib/constants';
import { TagList } from './TagList';
import { RecipeClassification } from './RecipeClassification'; // Importar novo componente
import { InfoFooter } from './InfoFooter';
import { renderMarkdownText } from '@/utils/markdown';
import { RecipeTip } from './RecipeTip'; // Importar RecipeTip
import { RecipeStorage } from './RecipeStorage'; // Importar RecipeStorage
import { NutritionDisplay } from './NutritionDisplay'; // Importar NutritionDisplay

interface RecipeViewProps {
    data: RecipePageData;
    updatePage: (newData: Partial<RecipePageData>) => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ data, updatePage }) => {
    const layout = data.layout || '2';
    const imgSize = data.imageSize || 3;
    const columnRatioClass = COLUMN_RATIOS[data.columnRatio || 'default'];
    
    // Helper function to get pixel value from FONT_SIZES
    const getFontSizePx = (type: 'title' | 'ingredients' | 'prep', sizeLevel: number | undefined, defaultLevel: number): number => {
        const level = sizeLevel && sizeLevel >= 1 && sizeLevel <= 5 ? sizeLevel : defaultLevel;
        return FONT_SIZES[type][level as keyof typeof FONT_SIZES['title']];
    };

    const fs = {
        title: getFontSizePx('title', data.fontSizes?.title, 3),
        ing: getFontSizePx('ingredients', data.fontSizes?.ingredients, 2),
        prep: getFontSizePx('prep', data.fontSizes?.prep, 2)
    };
    
    const p = SPACING_MAP[data.spacing || 'normal'];

    const renderVideoOverlay = (imageContainerClasses: string) => {
        if (data.videoLink && data.videoDisplayStyle === 'overlay') {
            return (
                <a 
                    href={data.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`absolute bottom-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-accent shadow-md hover:scale-110 transition-transform z-10`}
                    title="Ver Vídeo da Receita"
                >
                    <PlayCircle size={16} />
                </a>
            );
        }
        return null;
    };

    const imageStyle: React.CSSProperties = {
        objectFit: (data.objectFit || 'cover') as React.CSSProperties['objectFit'], // Corrigido: Asserção de tipo
        objectPosition: data.objectPosition || 'center',
        transform: `scale(${ (data.imageZoom || 100) / 100 })`,
        transformOrigin: 'center center'
    };

    // Lógica para determinar o alinhamento do título
    const getTitleAlignmentClass = () => {
        if (data.titleAlignment) {
            return `text-${data.titleAlignment}`;
        }
        // Alinhamentos padrão por layout
        switch (layout) {
            case '2': // Imagem esquerda
            case '7': // Imagem esquerda otimizada
                return 'text-left';
            case '4': // Imagem direita
            case '8': // Imagem direita otimizada
                return 'text-right';
            case '3': // Imagem topo
            case '5': // Somente texto
            case '6': // Macros no topo
            case '9': // Imagem topo com macros no título
            default:
                return 'text-center';
        }
    };

    const titleAlignmentClass = getTitleAlignmentClass();

    // --- LAYOUT 2: EDITORIAL (FOTO ESQUERDA) ---
    if (layout === '2') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                <div className="flex gap-3 mb-3 shrink-0">
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 aspect-square`}>
                        {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={24}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className={`flex-1 flex flex-col justify-center ${titleAlignmentClass}`}>
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-none text-navy mb-1.5" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className={`mt-auto flex items-center gap-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : ''}`}>
                            <span className="text-[8px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <RecipeClassification tags={data.code} compact={true} />
                        </div>
                    </div>
                </div>

                <div className={`flex-1 grid ${columnRatioClass} gap-3 min-h-0`}>
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span> 
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                <NutritionDisplay nutrition={data.nutrition} displayStyle={data.nutritionDisplayStyle} macroNote={data.macroNote} />
            </div>
        );
    }

    // Layout 3: Imagem no Topo (4:3)
    if (layout === '3') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                {/* Imagem em Destaque no Topo */}
                <div className="w-full mb-3 shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 aspect-[4/3]">
                    {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={48}/></div>}
                    {renderVideoOverlay("aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100")}
                </div>

                {/* Título e Meta */}
                <div className={`mb-4 shrink-0 ${titleAlignmentClass}`}>
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest block mb-1">{data.category}</span>
                    <h1 className="font-playfair font-bold leading-tight text-navy mb-2" style={{ fontSize: `${fs.title * 1.1}px` }}>{data.title}</h1>
                    <div className={`flex items-center gap-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : titleAlignmentClass === 'text-center' ? 'justify-center' : ''}`}>
                        <span className="text-[9px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                        <div className="h-2 w-px bg-accent/30"></div>
                        <TagList tags={data.code} />
                    </div>
                </div>

                {/* Conteúdo em Duas Colunas (Ingredientes e Preparo) */}
                <div className={`flex-1 grid ${columnRatioClass} gap-4 min-h-0`}>
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-3 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} />}
                    </div>

                    {/* Preparo */}
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                <NutritionDisplay nutrition={data.nutrition} displayStyle={data.nutritionDisplayStyle} macroNote={data.macroNote} />
            </div>
        );
    }

    // Layout 4: Imagem à Direita
    if (layout === '4') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                <div className="flex flex-row-reverse gap-3 mb-3 shrink-0"> {/* flex-row-reverse para imagem à direita */}
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 aspect-square`}>
                        {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={24}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className={`flex-1 flex flex-col justify-center ${titleAlignmentClass}`}> {/* text-right para alinhar texto à esquerda da imagem */}
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-none text-navy mb-1.5" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className={`mt-auto flex items-center gap-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : ''}`}> {/* justify-end para alinhar tags à direita */}
                            <span className="text-[8px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className={`flex-1 grid ${columnRatioClass} gap-3 min-h-0`}>
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                <NutritionDisplay nutrition={data.nutrition} displayStyle={data.nutritionDisplayStyle} macroNote={data.macroNote} />
            </div>
        );
    }

    // Layout 5: Somente Texto (Duas Colunas)
    if (layout === '5') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                {/* Título e Meta */}
                <div className={`mb-4 shrink-0 ${titleAlignmentClass}`}>
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest block mb-1">{data.category}</span>
                    <h1 className="font-playfair font-bold leading-tight text-navy mb-2" style={{ fontSize: `${fs.title * 1.1}px` }}>{data.title}</h1>
                    <div className={`flex items-center gap-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : titleAlignmentClass === 'text-center' ? 'justify-center' : ''}`}>
                        <span className="text-[9px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                        <div className="h-2 w-px bg-accent/30"></div>
                        <TagList tags={data.code} />
                    </div>
                </div>

                {/* Conteúdo em Duas Colunas (Ingredientes e Preparo) */}
                <div className={`flex-1 grid ${columnRatioClass} gap-4 min-h-0`}>
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-3 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} />}
                    </div>

                    {/* Preparo */}
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                <NutritionDisplay nutrition={data.nutrition} displayStyle={data.nutritionDisplayStyle} macroNote={data.macroNote} />
            </div>
        );
    }

    // Layout 6: Macros no Topo
    if (layout === '6') {
         return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                {/* 1. Cabeçalho de Macros em Destaque */}
                <div className={`flex justify-between items-center mb-4 pb-3 border-b border-accent/20 ${titleAlignmentClass}`}>
                     <div className="text-left"> {/* Mantido text-left para o bloco de categoria/título */}
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest block mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-none text-navy" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1>
                     </div>
                     
                     {/* Mini Tabela de Macros Visual (agora controlada pelo displayStyle) */}
                     <NutritionDisplay nutrition={data.nutrition} displayStyle={'inline-compact'} macroNote={data.macroNote} />
                </div>

                {/* 2. Imagem Centralizada Larga */}
                <div className="w-full mb-4 shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 aspect-[16/9]">
                     {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={32}/></div>}
                     {renderVideoOverlay("aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100")}
                </div>

                {/* 3. Colunas de Texto */}
                 <div className={`flex-1 grid ${columnRatioClass} gap-4 min-h-0`}>
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                    </div>
                    
                    {/* Preparo e Extras */}
                     <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                        {/* Info Footer Simplificado (já que macros estão no topo) */}
                        <InfoFooter data={data} compact={true} />
                    </div>
                 </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                {/* Removido NutritionDisplay duplicado aqui */}
            </div>
        );
    }

    // --- LAYOUT 7: EDITORIAL OTIMIZADO (FOTO ESQUERDA) ---
    if (layout === '7') {
        const optimizedP = SPACING_MAP['compact']; 
        return (
            <div className={`h-full flex flex-col ${optimizedP} font-sans`}>
                <div className="flex gap-2 mb-2 shrink-0">
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-xl shadow-sm border border-gray-100 aspect-square`}>
                        {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className={`flex-1 flex flex-col justify-center py-0.5 ${titleAlignmentClass}`}>
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className={`mt-auto flex items-center gap-1 ${titleAlignmentClass === 'text-right' ? 'justify-end' : ''}`}>
                            <span className="text-[7px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className={`flex-1 grid ${columnRatioClass} gap-2 min-h-0`}>
                    <div className="bg-white/60 rounded-xl p-2 border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Ingredientes</h3>
                        <ul className="space-y-0.5 pr-0.5">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid">
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">●</span>
                                    <span>{renderMarkdownText(step)}</span>
                                </p>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
                <NutritionDisplay nutrition={data.nutrition} displayStyle={data.nutritionDisplayStyle} compact={true} macroNote={data.macroNote} />
            </div>
        );
    }

    // --- LAYOUT 8: EDITORIAL OTIMIZADO COM MACROS NO TOPO (Variação do Layout 7) ---
    if (layout === '8') {
        const optimizedP = SPACING_MAP['compact']; 
        return (
            <div className={`h-full flex flex-col ${optimizedP} font-sans`}>
                {/* Cabeçalho com Imagem, Título e Macros */}
                <div className="flex gap-2 mb-2 shrink-0">
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-xl shadow-sm border border-gray-100 aspect-square`}>
                        {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className={`flex-1 flex flex-col justify-center py-0.5 ${titleAlignmentClass}`}>
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className={`flex items-center gap-1 mb-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : ''}`}>
                            <span className="text-[7px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                        
                        {/* Mini Tabela de Macros Visual - MOVIDA PARA CÁ */}
                        <NutritionDisplay nutrition={data.nutrition} displayStyle={'inline-compact'} macroNote={data.macroNote} />
                    </div>
                </div>

                {/* Colunas de Ingredientes e Preparo */}
                <div className={`flex-1 grid ${columnRatioClass} gap-2 min-h-0`}>
                    <div className="bg-white/60 rounded-xl p-2 border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Ingredientes</h3>
                        <ul className="space-y-0.5 pr-0.5">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid">
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">●</span>
                                    <span>{renderMarkdownText(step)}</span>
                                </p>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} compact={true} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} compact={true} />}
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
            </div>
        );
    }

    // --- LAYOUT 9: IMAGEM EM DESTAQUE NO TOPO COM MACROS NO TÍTULO (Ultra-Minimalista e ao lado) ---
    if (layout === '9') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                {/* Imagem em Destaque */}
                <div className="w-full mb-4 shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 aspect-[16/9]">
                    {data.image ? <img src={data.image} className={`w-full h-full`} style={imageStyle} /> : <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={48}/></div>}
                    {renderVideoOverlay("aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100")}
                </div>

                {/* Título e Meta com Macros Ultra-Minimalistas e ao lado */}
                <div className={`flex justify-between items-start mb-4 shrink-0 ${titleAlignmentClass}`}>
                    {/* Lado esquerdo: Categoria, Título, Rendimento, Tags */}
                    <div className={`flex-1 pr-4 ${titleAlignmentClass}`}> {/* Adicionado pr-4 para espaçamento */}
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest block mb-1">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-2" style={{ fontSize: `${fs.title * 1.1}px` }}>{data.title}</h1>
                        <div className={`flex items-center gap-2 ${titleAlignmentClass === 'text-right' ? 'justify-end' : titleAlignmentClass === 'text-center' ? 'justify-center' : ''}`}>
                            <span className="text-[9px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>

                    {/* Lado direito: Tabela de Macros Minimalista e Horizontal */}
                    <NutritionDisplay nutrition={data.nutrition} displayStyle={'inline-compact'} macroNote={data.macroNote} />
                </div>

                {/* Conteúdo em Duas Colunas (Ingredientes e Preparo) */}
                <div className={`flex-1 grid ${columnRatioClass} gap-4 min-h-0`}>
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-3 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                        {data.tipPlacement === 'ingredients' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'ingredients' && data.storage && <RecipeStorage storage={data.storage} />}
                    </div>

                    {/* Preparo */}
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-2 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {String(data.prepSteps || '').split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">●</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        {data.tipPlacement === 'prep' && data.tips && <RecipeTip tips={data.tips} />}
                        {data.storagePlacement === 'prep' && data.storage && <RecipeStorage storage={data.storage} />}
                        <InfoFooter data={data} compact={true} /> {/* Esconder nutrição no footer */}
                    </div>
                </div>
                {data.tipPlacement === 'footer' && data.tips && <RecipeTip tips={data.tips} />}
                {data.storagePlacement === 'footer' && data.storage && <RecipeStorage storage={data.storage} />}
            </div>
        );
    }

    return null;
};
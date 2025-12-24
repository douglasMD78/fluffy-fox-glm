import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { ImageIcon, Sparkles, Package, PlayCircle } from '@/components/icons';
import { FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';
import { TagList } from './TagList';
import { InfoFooter } from './InfoFooter';

interface RecipeViewProps {
    data: RecipePageData;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ data }) => {
    const layout = data.layout || '2';
    const imgSize = data.imageSize || 3;
    // Fonts: Default to pixel values if provided, else map old index to pixels
    const fs = {
        title: typeof data.fontSizes?.title === 'number' && data.fontSizes.title > 10 ? data.fontSizes.title : parseInt(FONT_SIZES.title[data.fontSizes?.title || 3].match(/\d+/)?.[0] || '28'),
        ing: typeof data.fontSizes?.ingredients === 'number' && data.fontSizes.ingredients > 5 ? data.fontSizes.ingredients : parseInt(FONT_SIZES.ingredients[data.fontSizes?.ingredients || 2].match(/\d+/)?.[0] || '9'),
        prep: typeof data.fontSizes?.prep === 'number' && data.fontSizes.prep > 5 ? data.fontSizes.prep : parseInt(FONT_SIZES.prep[data.fontSizes?.prep || 2].match(/\d+/)?.[0] || '11')
    };
    
    const p = SPACING_MAP[data.spacing || 'normal'];

    // Layout 6: Macros no Topo (Novo)
    if (layout === '6') {
         return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                {/* 1. Cabeçalho de Macros em Destaque */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-accent/20">
                     <div className="text-left">
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest block mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-none text-navy" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1>
                     </div>
                     
                     {/* Mini Tabela de Macros Visual */}
                     <div className="flex gap-2">
                        <div className="text-center">
                            <span className="block text-[14px] font-black text-accent leading-none">{data.nutrition?.cal || '000'}</span>
                            <span className="block text-[6px] uppercase font-bold text-navy/40">Kcal</span>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <span className="block text-[14px] font-black text-navy leading-none">{data.nutrition?.prot || '0g'}</span>
                            <span className="block text-[6px] uppercase font-bold text-navy/40">Prot</span>
                        </div>
                         <div className="text-center">
                            <span className="block text-[14px] font-black text-navy leading-none">{data.nutrition?.carb || '0g'}</span>
                            <span className="block text-[6px] uppercase font-bold text-navy/40">Carb</span>
                        </div>
                         <div className="text-center">
                            <span className="block text-[14px] font-black text-navy leading-none">{data.nutrition?.fat || '0g'}</span>
                            <span className="block text-[6px] uppercase font-bold text-navy/40">Gord</span>
                        </div>
                     </div>
                </div>

                {/* 2. Imagem Centralizada Larga */}
                <div className="w-full mb-4 shrink-0">
                     {data.image ? <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-[21/9] w-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={32}/></div>}
                </div>

                {/* 3. Colunas de Texto */}
                 <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-4 min-h-0">
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    
                    {/* Preparo e Extras */}
                     <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">{i+1}.</span>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Info Footer Simplificado (já que macros estão no topo) */}
                        <div className="mt-auto pt-2 space-y-2">
                             {data.videoLink && (
                                <a href={data.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-2 rounded-xl border border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors group mb-1 no-underline" style={{backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)'}}>
                                    <PlayCircle size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Ver Vídeo</span>
                                </a>
                            )}
                            {data.tips && (
                                <div className="flex gap-2 items-start p-2 rounded-xl border border-accent/20 bg-cream/50">
                                    <div className="text-accent shrink-0 mt-0.5"><Sparkles size={10}/></div>
                                    <div>
                                        <h5 className="text-[10px] font-hand font-bold text-accent mb-0.5">Dica</h5>
                                        <p className="text-[9px] text-navy/80 italic font-medium leading-tight">{data.tips}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>
        );
    }

    // --- LAYOUT 2: EDITORIAL (FOTO ESQUERDA) ---
    if (layout === '2') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                <div className="flex gap-3 mb-3 shrink-0">
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0`}>
                        {data.image ? <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={24}/></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-none text-navy mb-1.5" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className="mt-auto flex items-center gap-2">
                            <span className="text-[8px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-3 min-h-0">
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">{i+1}.</span>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
            </div>
        );
    }

    // --- LAYOUT 7: EDITORIAL OTIMIZADO (FOTO ESQUERDA) ---
    if (layout === '7') {
        // Usaremos o espaçamento 'compact' como base para otimização
        const optimizedP = SPACING_MAP['compact']; 
        return (
            <div className={`h-full flex flex-col ${optimizedP} font-sans`}> {/* Removido overflow-hidden aqui para permitir fluxo */}
                <div className="flex gap-2 mb-2 shrink-0"> {/* Reduzido mb-3 para mb-2, gap-3 para gap-2 */}
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0`}>
                        {data.image ? <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm border border-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>} {/* Rounded-2xl para rounded-xl, size 24 para 20 */}
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-0.5"> {/* Adicionado py-0.5 para alinhar melhor */}
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span> {/* Reduzido text-[8px] para text-[7px] */}
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1> {/* Reduzido mb-1.5 para mb-1, título um pouco menor */}
                        <div className="mt-auto flex items-center gap-1"> {/* Reduzido gap-2 para gap-1 */}
                            <span className="text-[7px] text-accent font-bold uppercase tracking-widest">{data.yield}</span> {/* Reduzido text-[8px] para text-[7px] */}
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-2 min-h-0"> {/* Reduzido gap-3 para gap-2 */}
                    <div className="bg-white/60 rounded-xl p-2 border border-rose-100 flex flex-col shadow-sm"> {/* Rounded-2xl para rounded-xl, p-2 */}
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Ingredientes</h3> {/* Reduzido text-xl para text-lg, mb-1.5 para mb-1, pb-1 para pb-0.5 */}
                        <ul className="space-y-0.5 pr-0.5"> {/* Removido overflow-y-auto custom-scrollbar, reduzido space-y-1 para space-y-0.5, pr-1 para pr-0.5 */}
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing * 0.9}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))} {/* Reduzido font-size, text-[8px] para text-[7px], adicionado break-inside-avoid */}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3> {/* Reduzido text-xl para text-lg, mb-1 para mb-1, pb-1 para pb-0.5 */}
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep * 0.9}px` }}> {/* Removido overflow-y-auto custom-scrollbar, reduzido space-y-1.5 para space-y-1, pr-1 para pr-0.5, leading-relaxed para leading-snug, font-size um pouco menor */}
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid"> {/* Adicionado break-inside-avoid */}
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">{i+1}.</span> {/* Reduzido text-[10px] para text-[9px] */}
                                    <span>{step}</span>
                                </p>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} /> {/* Garantindo que o footer seja compacto */}
                    </div>
                </div>
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
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0`}>
                        {data.image ? <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm border border-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-0.5">
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1>
                        <div className="flex items-center gap-1 mb-2"> {/* Adicionado mb-2 para espaçar dos macros */}
                            <span className="text-[7px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                        
                        {/* Mini Tabela de Macros Visual - MOVIDA PARA CÁ */}
                        {data.nutrition && (
                            <div className="mt-auto p-1 rounded-lg border border-accent/20 bg-cream/30">
                                <div className="flex justify-between items-center text-center">
                                    {Object.entries(data.nutrition || {}).map(([key, val]) => (
                                        <div key={key} className="flex-1 border-r border-accent/20 last:border-0 group">
                                            <span className="block text-[10px] font-black text-accent leading-none">{val}</span> {/* Font size ajustado */}
                                            <span className="block text-[5px] uppercase text-rose-400 font-bold tracking-widest mt-0.5">{key === 'cal' ? 'Kcal' : key}</span> {/* Font size ajustado */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Colunas de Ingredientes e Preparo */}
                <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-2 min-h-0">
                    <div className="bg-white/60 rounded-xl p-2 border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Ingredientes</h3>
                        <ul className="space-y-0.5 pr-0.5">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing * 0.9}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep * 0.9}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid">
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">{i+1}.</span>
                                    <span>{step}</span>
                                </p>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} hideNutrition={true} /> {/* Esconde nutrição aqui */}
                    </div>
                </div>
            </div>
        );
    }

    // --- LAYOUT 3: EDITORIAL (FOTO DIREITA) ---
    if (layout === '3') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                <div className="flex gap-3 mb-3 flex-row-reverse shrink-0">
                    <div className={`${IMG_SIZES.side[imgSize]} shrink-0`}>
                        {data.image ? <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={24}/></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-start pt-1 text-right">
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className={`font-playfair font-bold leading-none text-navy mb-1`} style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                        <div className="mt-auto flex flex-col items-end gap-1">
                            <span className="text-[8px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 min-h-0">
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 shrink-0 shadow-sm max-h-[30%]">
                        <h3 className="font-hand text-xl text-accent mb-1.5">Ingredientes</h3>
                        <ul className="columns-2 gap-x-4 gap-y-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className={`font-medium text-navy/80 mb-0.5 flex gap-1 break-inside-avoid`} style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1">Modo de Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/90 pl-2 border-l-2 border-accent/20 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="mb-1 relative"><span className="absolute -left-3 text-accent font-bold text-[8px] top-1">●</span> {step}</p>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} />
                    </div>
                </div>
            </div>
        );
    }

    // --- LAYOUT 4: Z-LAYOUT (FOTO PEQUENA + TEXTO) ---
    if (layout === '4') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans overflow-hidden`}>
                <div className="text-center mb-2 border-b border-accent/10 pb-2 shrink-0">
                    <h1 className="font-playfair font-bold text-navy leading-none mb-1" style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                    <div className="flex justify-center items-center gap-3">
                        <span className="text-[8px] font-bold text-accent uppercase tracking-[0.2em]">{data.category}</span>
                        <TagList tags={data.code} />
                    </div>
                </div>
                
                <div className="flex gap-3 mb-2 shrink-0 max-h-[30%]">
                    <div className={`${IMG_SIZES.z[imgSize]}`}>
                        {data.image ? <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-white shadow-md rotate-[-2deg]"><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="aspect-square w-full bg-rose-50 rounded-2xl"></div>}
                    </div>
                    <div className="flex-1 pt-1 overflow-hidden">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-rose-100 pb-1">Ingredientes</h3>
                        <ul className="space-y-0.5 overflow-y-auto h-full custom-scrollbar pb-2">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className={`font-medium text-navy/80 leading-tight truncate flex gap-1`} style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{item}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl p-2.5 border border-rose-50 shadow-sm mb-2">
                    <h3 className="font-hand text-xl text-accent mb-1 text-center shrink-0">Passo a Passo</h3>
                    <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/80 font-serif flex-1 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                        {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                            <p key={i}><span className="font-bold text-accent font-hand mr-1 text-lg">{i+1}.</span> {step}</p>
                        ))}
                    </div>
                </div>
                
                <InfoFooter data={data} compact={true} />
            </div>
        );
    }

    // --- LAYOUT 5: MOLDURA (CENTRALIZADO) ---
    if (layout === '5') {
        return (
            <div className={`h-full flex flex-col ${p} font-sans bg-white border-[6px] border-cream box-border overflow-hidden rounded-3xl`}>
                <div className="flex flex-col items-center mb-2 shrink-0">
                    <div className="p-1 border border-accent/20 rounded-full mb-1 shadow-sm">
                        {data.image ? <div className={`${IMG_SIZES.center[imgSize]} rounded-full overflow-hidden border-2 border-white`}><img src={data.image} className="w-full h-full object-cover" /></div> : <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-300"/></div>}
                    </div>
                    <h1 className={`font-playfair font-bold text-navy leading-none text-center mb-1`} style={{ fontSize: `${fs.title}px` }}>{data.title}</h1>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-0.5 w-6 bg-accent rounded-full"></div>
                        <TagList tags={data.code} />
                        <div className="h-0.5 w-6 bg-accent rounded-full"></div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col gap-2">
                    <div className="text-center shrink-0">
                        <h3 className="font-hand text-xl text-accent mb-1">Ingredientes</h3>
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{g.items.split('\n').filter(l => l.trim()).map((item, j) => (<span key={j} className={`font-medium text-navy/80`} style={{ fontSize: `${fs.ing}px` }}>{item} <span className="text-accent mx-0.5">~</span></span>))}</React.Fragment>))}
                        </div>
                    </div>
                    
                    <div className="text-center flex-1 min-h-0 flex flex-col bg-rose-50/30 rounded-3xl p-2.5">
                        <h3 className="font-hand text-xl text-accent mb-1 shrink-0">Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 leading-relaxed text-navy/80`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i}><span className="text-accent font-bold">{i+1}</span> {step}</p>
                            ))}
                        </div>
                    </div>
                    <InfoFooter data={data} compact={true} />
                </div>
            </div>
        );
    }

    return null;
};
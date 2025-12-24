import React, { useState, useRef, useEffect } from 'react';
import { RecipePageData } from '@/data/initialData';
import { ImageIcon, Sparkles, Package, PlayCircle } from '@/components/icons';
import { FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';
import { TagList } from './TagList';
import { InfoFooter } from './InfoFooter';
import { renderMarkdownText } from '@/utils/markdown';

interface RecipeViewProps {
    data: RecipePageData;
    updatePage: (newData: Partial<RecipePageData>) => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ data, updatePage }) => {
    const layout = data.layout || '2';
    const imgSize = data.imageSize || 3;
    const fs = {
        title: typeof data.fontSizes?.title === 'number' && data.fontSizes.title > 10 ? data.fontSizes.title : parseInt(FONT_SIZES.title[data.fontSizes?.title || 3].match(/\d+/)?.[0] || '28'),
        ing: typeof data.fontSizes?.ingredients === 'number' && data.fontSizes.ingredients > 5 ? data.fontSizes.ingredients : parseInt(FONT_SIZES.ingredients[data.fontSizes?.ingredients || 2].match(/\d+/)?.[0] || '9'),
        prep: typeof data.fontSizes?.prep === 'number' && data.fontSizes.prep > 5 ? data.fontSizes.prep : parseInt(FONT_SIZES.prep[data.fontSizes?.prep || 2].match(/\d+/)?.[0] || '11')
    };
    
    const p = SPACING_MAP[data.spacing || 'normal'];
    const imageZoom = data.imageZoom || 100;

    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // Ref for the clipping container

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartMouseX, setDragStartMouseX] = useState(0);
    const [dragStartMouseY, setDragStartMouseY] = useState(0);
    const [dragStartImageX, setDragStartImageX] = useState(50); // Current object-position x percentage
    const [dragStartImageY, setDragStartImageY] = useState(50); // Current object-position y percentage

    const parseObjectPosition = (pos: string | undefined) => {
        if (!pos) return { x: 50, y: 50 };
        const parts = pos.split(' ').map(p => parseFloat(p));
        return { x: parts[0] || 50, y: parts[1] || 50 };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!imgRef.current || !containerRef.current || !data.image) return;

        setIsDragging(true);
        setDragStartMouseX(e.clientX);
        setDragStartMouseY(e.clientY);

        const { x, y } = parseObjectPosition(data.imageAlignment);
        setDragStartImageX(x);
        setDragStartImageY(y);

        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !imgRef.current || !containerRef.current) return;

            const container = containerRef.current;
            const img = imgRef.current;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const imgNaturalWidth = img.naturalWidth;
            const imgNaturalHeight = img.naturalHeight;

            // Calculate effective image dimensions when object-fit: cover
            const containerAspectRatio = containerWidth / containerHeight;
            const imageAspectRatio = imgNaturalWidth / imgNaturalHeight;

            let effectiveImageWidth, effectiveImageHeight;

            if (imageAspectRatio > containerAspectRatio) {
                effectiveImageHeight = containerHeight;
                effectiveImageWidth = imgNaturalWidth * (containerHeight / imgNaturalHeight);
            } else {
                effectiveImageWidth = containerWidth;
                effectiveImageHeight = imgNaturalHeight * (containerWidth / imgNaturalWidth);
            }

            // Apply zoom to effective dimensions
            const zoomedImageWidth = effectiveImageWidth * (imageZoom / 100);
            const zoomedImageHeight = effectiveImageHeight * (imageZoom / 100);

            const deltaX = e.clientX - dragStartMouseX;
            const deltaY = e.clientY - dragStartMouseY;

            // Calculate maximum shift in pixels for object-position
            const maxShiftX = zoomedImageWidth - containerWidth;
            const maxShiftY = zoomedImageHeight - containerHeight;

            let newX = dragStartImageX;
            let newY = dragStartImageY;

            if (maxShiftX > 0) {
                // If mouse moves right (deltaX > 0), we want content to move right.
                // This means object-position-x percentage should INCREASE.
                newX = dragStartImageX + (deltaX / maxShiftX) * 100;
                newX = Math.max(0, Math.min(100, newX));
            } else {
                newX = 50; // Center if no horizontal overflow
            }
            
            if (maxShiftY > 0) {
                // If mouse moves down (deltaY > 0), we want content to move down.
                // This means object-position-y percentage should INCREASE.
                newY = dragStartImageY + (deltaY / maxShiftY) * 100;
                newY = Math.max(0, Math.min(100, newY));
            } else {
                newY = 50; // Center if no vertical overflow
            }
            
            updatePage({ imageAlignment: `${newX.toFixed(0)}% ${newY.toFixed(0)}%` });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStartMouseX, dragStartMouseY, dragStartImageX, dragStartImageY, data.imageAlignment, updatePage, imageZoom]);


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

    // Apply the object-position and transform: scale styles
    const currentImageAlignment = data.imageAlignment || '50% 50%';
    const imageStyle = {
        objectPosition: currentImageAlignment,
        transform: `scale(${imageZoom / 100})`,
        transformOrigin: 'center center' // Ensure scaling is from the center
    };

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
                <div ref={containerRef} className="w-full mb-4 shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                     {data.image ? <img ref={imgRef} src={data.image} className={`w-full h-full object-cover cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} style={imageStyle} onMouseDown={handleMouseDown} /> : <div className="aspect-[21/9] w-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={32}/></div>}
                     {renderVideoOverlay("aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100")}
                </div>

                {/* 3. Colunas de Texto */}
                 <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-4 min-h-0">
                    {/* Ingredientes */}
                    <div className="bg-white/60 rounded-2xl p-2 overflow-hidden border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-xl text-accent mb-1.5 border-b border-accent/20 pb-1 shrink-0">Ingredientes</h3>
                        <ul className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    
                    {/* Preparo e Extras */}
                     <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">{i+1}.</span>
                                    <p>{renderMarkdownText(step)}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Info Footer Simplificado (já que macros estão no topo) */}
                        <div className="mt-auto pt-2 space-y-2">
                             {data.tips && (
                                <div className="flex gap-2 items-start p-2 rounded-xl border border-accent/20 bg-cream/50">
                                    <div className="text-accent shrink-0 mt-0.5"><Sparkles size={10}/></div>
                                    <div>
                                        <h5 className="text-[10px] font-hand font-bold text-accent mb-0.5">Dica</h5>
                                        <p className="text-[9px] text-navy/80 italic font-medium leading-tight">{renderMarkdownText(data.tips)}</p>
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
                    <div ref={containerRef} className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100`}>
                        {data.image ? <img ref={imgRef} src={data.image} className={`w-full h-full object-cover cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} style={imageStyle} onMouseDown={handleMouseDown} /> : <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={24}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
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
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 border-b border-rose-50 pb-0.5 flex gap-1" style={{ fontSize: `${fs.ing}px` }}><span className="text-accent text-[8px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-xl text-accent mb-1 border-b border-accent/20 pb-1 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 text-navy/90 mb-2 leading-relaxed`} style={{ fontSize: `${fs.prep}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-black text-accent shrink-0 text-[10px] font-hand pt-0.5">{i+1}.</span>
                                    <p>{renderMarkdownText(step)}</p>
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
        const optimizedP = SPACING_MAP['compact']; 
        return (
            <div className={`h-full flex flex-col ${optimizedP} font-sans`}>
                <div className="flex gap-2 mb-2 shrink-0">
                    <div ref={containerRef} className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-xl shadow-sm border border-gray-100`}>
                        {data.image ? <img ref={imgRef} src={data.image} className={`w-full h-full object-cover cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} style={imageStyle} onMouseDown={handleMouseDown} /> : <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-0.5">
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1>
                        <div className="mt-auto flex items-center gap-1">
                            <span className="text-[7px] text-accent font-bold uppercase tracking-widest">{data.yield}</span>
                            <div className="h-2 w-px bg-accent/30"></div>
                            <TagList tags={data.code} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-2 min-h-0">
                    <div className="bg-white/60 rounded-xl p-2 border border-rose-100 flex flex-col shadow-sm">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Ingredientes</h3>
                        <ul className="space-y-0.5 pr-0.5">
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing * 0.9}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep * 0.9}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid">
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">{i+1}.</span>
                                    <span>{renderMarkdownText(step)}</span>
                                </p>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} />
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
                    <div ref={containerRef} className={`${IMG_SIZES.side[imgSize]} shrink-0 relative overflow-hidden rounded-xl shadow-sm border border-gray-100`}>
                        {data.image ? <img ref={imgRef} src={data.image} className={`w-full h-full object-cover cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} style={imageStyle} onMouseDown={handleMouseDown} /> : <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center text-pastel"><ImageIcon size={20}/></div>}
                        {renderVideoOverlay(`${IMG_SIZES.side[imgSize]} shrink-0`)}
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-0.5">
                        <span className="text-[7px] font-black text-accent uppercase tracking-widest mb-0.5">{data.category}</span>
                        <h1 className="font-playfair font-bold leading-tight text-navy mb-1" style={{ fontSize: `${fs.title * 0.9}px` }}>{data.title}</h1>
                        <div className="flex items-center gap-1 mb-2">
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
                                            <span className="block text-[10px] font-black text-accent leading-none">{val}</span>
                                            <span className="block text-[5px] uppercase text-rose-400 font-bold tracking-widest mt-0.5">{key === 'cal' ? 'Kcal' : key === 'fat' ? 'Gord' : key}</span>
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
                            {data.ingredientGroups.map((g, i) => (<React.Fragment key={i}>{(String(g.items || '')).split('\n').filter(l => l.trim()).map((item, j) => (<li key={j} className="font-medium text-navy/80 pb-0.5 flex gap-1 break-inside-avoid" style={{ fontSize: `${fs.ing * 0.9}px` }}><span className="text-accent text-[7px] mt-0.5">●</span>{renderMarkdownText(item)}</li>))}</React.Fragment>))}
                        </ul>
                    </div>
                    <div className="flex flex-col min-h-0">
                        <h3 className="font-hand text-lg text-accent mb-1 border-b border-accent/20 pb-0.5 shrink-0">Modo de Preparo</h3>
                        <div className={`space-y-1 pr-0.5 text-navy/90 mb-2 leading-snug`} style={{ fontSize: `${fs.prep * 0.9}px` }}>
                            {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                                <p key={i} className="flex gap-1 break-inside-avoid">
                                    <span className="font-black text-accent shrink-0 text-[9px] font-hand pt-0.5">{i+1}.</span>
                                    <span>{renderMarkdownText(step)}</span>
                                </p>
                            ))}
                        </div>
                        <InfoFooter data={data} compact={true} hideNutrition={true} />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
"use client";

import React, { useState, useMemo } from 'react';
import { TEMPLATES } from '@/lib/constants';
import { PageData } from '@/data/initialData';

// Icons
import { Plus, Trash2, Save, FileUp, Printer, Settings, BookOpen, ImageIcon, Layout, List, AlignLeft, MagicStick, RefreshCw, Sparkles, Brain, Package, Columns, PlayCircle, Type, Minus, HardDrive, Palette, Maximize, Search } from '@/components/icons';

interface SidebarProps {
    pages: PageData[];
    selectedId: string | null;
    onPageSelect: (id: string) => void;
    onAddPage: (type: TEMPLATES) => void;
    onExportProject: () => void;
    onImportProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onShowThemeEditor: () => void;
    onShowImporter: () => void;
    onOpenMagicModal: (type: 'recipe' | 'intro' | 'shopping') => void;
    onPrint: () => void;
    onRestoreDefault: () => void;
    isSaving: boolean;
    unsavedChanges: boolean;
    dragItem: number | null;
    dragOverItem: number | null;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    onRefactor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    pages,
    selectedId,
    onPageSelect,
    onAddPage,
    onExportProject,
    onImportProject,
    onShowThemeEditor,
    onShowImporter,
    onOpenMagicModal,
    onPrint,
    onRestoreDefault,
    isSaving,
    unsavedChanges,
    dragItem,
    dragOverItem,
    onDragStart,
    onDragEnter,
    onDragEnd,
    onRefactor,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPages = useMemo(() => {
        if (!searchTerm.trim()) return pages;
        
        const term = searchTerm.toLowerCase();
        return pages.filter(page => 
            (page.title && page.title.toLowerCase().includes(term)) ||
            (page.type && page.type.toLowerCase().includes(term))
        );
    }, [pages, searchTerm]);

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-md border-r border-white/50 flex flex-col no-print shrink-0 z-10 shadow-soft">
            <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30"><BookOpen className="text-white" size={20} /></div>
                    <div><h1 className="text-lg font-playfair italic font-bold leading-tight text-navy">Luiza<span className="text-accent">.Studio</span></h1><p className="text-[9px] uppercase tracking-widest text-navy/40 font-bold">Fixed Final v10.13</p></div>
                </div>
                <div className="flex justify-center mb-2">
                    {isSaving && <span className="text-[9px] font-black text-accent uppercase tracking-widest animate-pulse">Salvando...</span>}
                    {!isSaving && <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">Sincronizado</span>}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button onClick={onExportProject} className={`flex items-center justify-center gap-2 p-2 rounded-xl text-[10px] font-bold border transition-all ${unsavedChanges ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-surface text-navy/60 border-transparent hover:bg-gray-100'}`}><Save size={12}/> {unsavedChanges ? 'Salvar*' : 'Salvo'}</button>
                    <label className="flex items-center justify-center gap-2 p-2 bg-surface rounded-xl text-[10px] font-bold text-navy/60 cursor-pointer hover:bg-gray-100 transition-all"><FileUp size={12}/> Abrir <input type="file" className="hidden" onChange={onImportProject}/></label>
                </div>
                <button onClick={onShowThemeEditor} className="w-full bg-surface hover:bg-gray-100 text-navy/60 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-2 transition-all mb-2"><Palette size={12} /> Configurar Cores</button>
                <button onClick={onRestoreDefault} className="w-full bg-surface hover:bg-gray-100 text-navy/50 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-2 transition-all"><RefreshCw size={12} /> Restaurar Padrão</button>
            </div>

            <div className="p-4 border-b border-gray-100/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/40" size={14} />
                    <input
                        type="text"
                        placeholder="Pesquisar receitas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-surface border border-gray-200 rounded-xl text-[11px] font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                </div>
                {searchTerm && (
                    <div className="mt-2 text-[9px] text-navy/50 text-center">
                        {filteredPages.length} {filteredPages.length === 1 ? 'resultado' : 'resultados'} encontrados
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredPages.map((p, i) => (
                <div
                    key={p.id}
                    draggable={p.type !== TEMPLATES.TOC}
                    onDragStart={() => (p.type !== TEMPLATES.TOC ? onDragStart(pages.indexOf(p)) : undefined)}
                    onDragEnter={() => (p.type !== TEMPLATES.TOC ? onDragEnter(pages.indexOf(p)) : undefined)}
                    onDragEnd={() => (p.type !== TEMPLATES.TOC ? onDragEnd() : undefined)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => onPageSelect(p.id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border ${selectedId === p.id ? 'bg-accent text-white shadow-lg shadow-accent/30 border-transparent' : 'border-transparent text-navy/60 hover:bg-surface'} ${dragOverItem === pages.indexOf(p) ? 'border-t-2 border-accent' : ''} ${p.type === TEMPLATES.TOC ? 'cursor-default active:cursor-default' : ''}`}
                >
                    <span className={`text-[10px] font-mono w-4 ${selectedId === p.id ? 'text-white/70' : 'text-accent'}`}>{pages.indexOf(p) + 1}</span>
                    <div className="flex-1 truncate text-[11px] font-bold uppercase tracking-widest font-sans">{p.title || 'Sem Título'}</div>
                </div>
                ))}
                {filteredPages.length === 0 && (
                    <div className="text-center py-8 text-navy/40">
                        <Search size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-[11px] font-sans">Nenhuma receita encontrada</p>
                        <p className="text-[9px] mt-1">Tente outros termos</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100/50 bg-white/50">
                <button onClick={() => onOpenMagicModal('recipe')} className="w-full bg-gradient-to-r from-accent to-rose-500 hover:from-accent hover:to-rose-600 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all mb-3 text-white transform active:scale-95"><Sparkles size={16}/> ✨ Receita Mágica IA</button>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={onShowImporter} className="bg-surface hover:bg-gray-100 p-2 rounded-xl text-[9px] font-bold uppercase text-navy/70 flex items-center justify-center gap-1 transition-colors"><FileUp size={12}/> Importar Txt</button>
                    <button onClick={() => onAddPage(TEMPLATES.RECIPE)} className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 transition-colors"><Plus size={12}/> Manual</button>
                </div>

                <div className="grid grid-cols-4 gap-1 mb-4">
                    <button onClick={() => onAddPage(TEMPLATES.COVER)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Capa"><Layout size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.SECTION)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Capítulo"><Settings size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.INTRO)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Intro"><AlignLeft size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.LEGEND)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Legendas"><BookOpen size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.SHOPPING)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Compras"><Package size={14}/></button>
                </div>
                <button onClick={onPrint} className="w-full bg-navy text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors shadow-lg"><Printer size={16}/> Salvar PDF (A5)</button>
            </div>
        </aside>
    );
};
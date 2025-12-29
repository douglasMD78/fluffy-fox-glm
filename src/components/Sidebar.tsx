"use client";

import React from 'react';
import { TEMPLATES } from '@/lib/constants';
import { PageData, TocPageData } from '@/data/initialData';

// Icons
import { Plus, Trash2, Save, FileUp, Printer, Settings, BookOpen, ImageIcon, Layout, List, AlignLeft, MagicStick, RefreshCw, Sparkles, Brain, Package, Columns, PlayCircle, Type, Minus, HardDrive, Palette, Maximize } from '@/components/icons';

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
}) => {
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

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {pages.map((p, i) => (
                <div
                    key={p.id}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragEnter={() => onDragEnter(i)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => onPageSelect(p.id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border ${selectedId === p.id ? 'bg-accent text-white shadow-lg shadow-accent/30 border-transparent' : 'border-transparent text-navy/60 hover:bg-surface'} ${dragOverItem === i ? 'border-t-2 border-accent' : ''}`}
                >
                    <span className={`text-[10px] font-mono w-4 ${selectedId === p.id ? 'text-white/70' : 'text-accent'}`}>{i + 1}</span>
                    <div className="flex-1 truncate text-[11px] font-bold uppercase tracking-widest font-sans">{p.title || 'Sem Título'}</div>
                </div>
                ))}
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
                    <button onClick={() => onAddPage(TEMPLATES.TOC)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Sumário"><List size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.INTRO)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Intro"><AlignLeft size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.LEGEND)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Legendas"><BookOpen size={14}/></button>
                    <button onClick={() => onAddPage(TEMPLATES.SHOPPING)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Compras"><Package size={14}/></button>
                </div>
                <button onClick={onPrint} className="w-full bg-navy text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors shadow-lg"><Printer size={16}/> Salvar PDF (A5)</button>
            </div>
        </aside>
    );
};
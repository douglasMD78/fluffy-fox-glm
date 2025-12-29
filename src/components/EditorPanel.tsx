"use client";

import React from 'react';
import { TEMPLATES } from '@/lib/constants';
import { PageData, RecipePageData, IntroPageData, CoverPageData, SectionPageData, ShoppingPageData, LegendPageData } from '@/data/initialData';

// Icons
import { Trash2 } from '@/components/icons';

// Editors
import { RecipeEditor } from '@/components/editors/RecipeEditor';
import { CoverEditor } from '@/components/editors/CoverEditor';
import { IntroEditor } from '@/components/editors/IntroEditor';
import { SectionEditor } from '@/components/editors/SectionEditor';
import { ShoppingEditor } from '@/components/editors/ShoppingEditor';
import { LegendEditor } from '@/components/editors/LegendEditor';

interface EditorPanelProps {
    activePage: PageData | undefined;
    updatePage: (newData: Partial<PageData>) => void;
    onAiRequest: (type: 'recipe' | 'intro' | 'shopping') => void;
    onDeletePage: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ activePage, updatePage, onAiRequest, onDeletePage }) => {
    if (!activePage) {
        return (
            <section className="w-96 bg-white/80 backdrop-blur-md border-l border-white/50 flex flex-col no-print shrink-0 z-10 shadow-soft p-6 items-center justify-center text-center text-navy/60">
                <p className="text-sm">Selecione uma página na barra lateral para editar o conteúdo.</p>
            </section>
        );
    }

    const renderEditor = () => {
        switch (activePage.type) {
            case TEMPLATES.COVER:
                return <CoverEditor activePage={activePage as CoverPageData} updatePage={updatePage} />;
            case TEMPLATES.INTRO:
                return <IntroEditor activePage={activePage as IntroPageData} updatePage={updatePage} onAiRequest={() => onAiRequest('intro')} />;
            case TEMPLATES.RECIPE:
                return <RecipeEditor activePage={activePage as RecipePageData} updatePage={updatePage} />;
            case TEMPLATES.SECTION:
                return <SectionEditor activePage={activePage as SectionPageData} updatePage={updatePage} />;
            case TEMPLATES.SHOPPING:
                return <ShoppingEditor activePage={activePage as ShoppingPageData} updatePage={updatePage} onAiRequest={() => onAiRequest('shopping')} />;
            case TEMPLATES.LEGEND:
                return <LegendEditor activePage={activePage as LegendPageData} updatePage={updatePage} />;
            default:
                return (
                    <div className="p-4 text-center text-navy/60">
                        <p className="text-sm">Nenhum editor disponível para este tipo de página.</p>
                    </div>
                );
        }
    };

    return (
        <section className="w-96 bg-white/80 backdrop-blur-md border-l border-white/50 flex flex-col no-print shrink-0 z-10 shadow-soft">
            <div className="p-6 border-b border-gray-100/50 flex items-center justify-between">
                <h2 className="text-lg font-playfair italic font-bold text-navy">Editar Página</h2>
                <button onClick={onDeletePage} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors" title="Excluir Página">
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {renderEditor()}
            </div>
        </section>
    );
};
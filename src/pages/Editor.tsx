import React, { useState, useEffect, useRef } from 'react';
import { TEMPLATES, FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';
import { INITIAL_DATA, PDF_LUIZA_DATA, PageData, RecipePageData, IntroPageData, CoverPageData, SectionPageData, ShoppingPageData, LegendPageData, recipeSchema, introSchema, shoppingSchema, TocPageData } from '@/data/initialData'; // Importar esquemas Zod e tipos específicos
import { compressImage } from '@/utils/image';
import { callGemini } from '@/utils/gemini';
import { generatePdf } from '@/utils/pdf';
import * as idb from 'idb-keyval'; // Import idb-keyval
import { toast } from 'sonner'; // Importar toast

// Icons
import { Plus, Trash2, Save, FileUp, Printer, Settings, BookOpen, ImageIcon, Layout, List, AlignLeft, MagicStick, RefreshCw, Sparkles, Brain, Package, Columns, PlayCircle, Type, Minus, HardDrive, Palette, Maximize } from '@/components/icons';

// Editors
import { GlobalSettingsEditor } from '@/components/editors/GlobalSettingsEditor'; // Caminho corrigido

// Views
import { CoverView } from '@/components/views/CoverView';
import { SectionView } from '@/components/views/SectionView';
import { RecipeView } from '@/components/views/RecipeView';
import { IntroView } from '@/components/views/IntroView';
import { ShoppingView } from '@/components/views/ShoppingView';
import { LegendView } from '@/components/views/LegendView';
import { TocView } from '@/components/views/TocView';

// Theme Styles
import { ThemeStyles } from '@/components/ThemeStyles';

// Utils
import { getPageBackgroundColor } from '@/utils/pageStyles';

// Components
import { Sidebar } from '@/components/Sidebar'; // Importar o novo componente Sidebar
import { EditorPanel } from '@/components/EditorPanel'; // Importar o novo componente EditorPanel
import { ImporterModal } from '@/components/modals/ImporterModal'; // Importar ImporterModal
import { MagicModal } from '@/components/modals/MagicModal'; // Importar MagicModal

// Hooks
import { useAiFeatures } from '@/hooks/useAiFeatures'; // Importar useAiFeatures
import { useAppPersistence } from '@/hooks/useAppPersistence'; // Importar o novo hook useAppPersistence

import { refatorarDadosIniciais } from '@/data/initialData';

const Editor = () => {
    // Usar o hook useAppPersistence para gerenciar páginas, tema e persistência
    const {
        pages,
        setPages, // Necessário para o useAiFeatures
        selectedId,
        setSelectedId, // Necessário para o useAiFeatures
        activePage,
        addPage,
        updatePage,
        handleDeletePage,
        handlePageClick,
        dragItem,
        dragOverItem,
        handleDragStart,
        onDragEnter, // Renomeado para onDragEnter
        handleSort,
        theme,
        setTheme,
        isSaving,
        unsavedChanges,
        exportProject,
        importProject,
        loadPdfData,
        showThemeEditor, // Novo
        setShowThemeEditor, // Novo
        handlePrint, // Novo
    } = useAppPersistence();

    // Usar o hook useAiFeatures
    const {
        showImporter,
        setShowImporter,
        importText,
        setImportText,
        isImporting,
        organizeRecipeWithAI,
        magicModal,
        setMagicModal,
        isMagicGenerating,
        handleMagicSubmit,
        openMagicModal,
    } = useAiFeatures({ pages, setPages, updatePage, setSelectedId });

    // Removido: const [showThemeEditor, setShowThemeEditor] = useState(false);
    // Removido: const handlePrint = async () => { ... };
    
    const handleRefactor = () => {
        if (confirm("Refatorar vai reaplicar ordenação, tags e rendimentos automáticos. Continuar?")) {
            const refactored = refatorarDadosIniciais();
            setPages(refactored);
        }
    };

    return (
        <>
            <div id="app-container" className="flex h-screen bg-cream text-navy overflow-hidden font-sans select-none relative">
                <div className="bg-grain opacity-50 pointer-events-none fixed inset-0 z-0"></div>
                <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-b from-pastel/20 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>

                <ThemeStyles theme={theme} />

                {/* MODAIS */}
                {showThemeEditor && (
                    <GlobalSettingsEditor 
                        theme={theme} 
                        updateTheme={setTheme} 
                        onClose={() => setShowThemeEditor(false)} 
                    />
                )}

                <ImporterModal
                    showImporter={showImporter}
                    setShowImporter={setShowImporter}
                    importText={importText}
                    setImportText={setImportText}
                    isImporting={isImporting}
                    organizeRecipeWithAI={organizeRecipeWithAI}
                />

                <MagicModal
                    magicModal={magicModal}
                    setMagicModal={setMagicModal}
                    isMagicGenerating={isMagicGenerating}
                    handleMagicSubmit={handleMagicSubmit}
                />

                {/* SIDEBAR */}
                <Sidebar
                    pages={pages}
                    selectedId={selectedId}
                    onPageSelect={handlePageClick}
                    onAddPage={addPage}
                    onExportProject={exportProject}
                    onImportProject={importProject}
                    onShowThemeEditor={() => setShowThemeEditor(true)}
                    onShowImporter={() => setShowImporter(true)}
                    onOpenMagicModal={openMagicModal}
                    onPrint={handlePrint}
                    onRestoreDefault={loadPdfData}
                    isSaving={isSaving}
                    unsavedChanges={unsavedChanges}
                    dragItem={dragItem}
                    dragOverItem={dragOverItem}
                    onDragStart={handleDragStart}
                    onDragEnter={onDragEnter} // Usando onDragEnter do hook
                    onDragEnd={handleSort}
                    onRefactor={handleRefactor}
                />

                {/* PREVIEW */}
                <section id="preview-container" className="flex-1 bg-transparent overflow-y-auto p-12 flex flex-col items-center custom-scrollbar print:p-0 print:bg-white z-10 relative">
                    {(() => {
                        let pageCounter = 0;

                        return pages.map((p, idx) => {
                            const pageNumberLabel =
                                p.type === TEMPLATES.COVER
                                    ? ''
                                    : String((pageCounter += 1)).padStart(2, '0');

                            return (
                                <div 
                                    key={p.id} 
                                    id={`preview-${p.id}`} 
                                    className={`mobile-page transition-all duration-700 mb-12 shrink-0 ${selectedId === p.id ? 'z-10 ring-4 ring-accent/30 scale-[1.01]' : 'opacity-90 scale-100 hover:opacity-100'}`}
                                    style={{ backgroundColor: getPageBackgroundColor(p.type, theme) }}
                                >
                                    <div className="a4-page-texture"></div>
                                    {/* Wrapper "Safe Print Area" */}
                                    <div className="z-10 relative h-full flex flex-col">
                                        {p.type === TEMPLATES.COVER && <CoverView data={p as CoverPageData} />}
                                        {p.type === TEMPLATES.TOC && <TocView data={p as TocPageData} allPages={pages} />}
                                        {p.type === TEMPLATES.SECTION && <SectionView data={p as SectionPageData} />}

                                        {/* RECIPE VIEW AGORA TEM LAYOUTS DINÂMICOS */}
                                        {p.type === TEMPLATES.RECIPE && <RecipeView data={p as RecipePageData} updatePage={updatePage} />}

                                        {p.type === TEMPLATES.INTRO && <IntroView data={p as IntroPageData} />}
                                        {p.type === TEMPLATES.SHOPPING && <ShoppingView data={p as ShoppingPageData} />}
                                        {p.type === TEMPLATES.LEGEND && <LegendView data={p as LegendPageData} />}

                                        <div className="mt-auto flex justify-between items-end text-[10px] text-navy/40 font-bold tracking-[0.2em] uppercase border-t border-navy/10 pt-4 w-full px-4 pb-0 no-print-footer">
                                            <span>{p.type === TEMPLATES.COVER ? '' : 'www.lumts.com'}</span>
                                            <span>{p.type === TEMPLATES.COVER ? '' : pageNumberLabel}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        });
                    })()}
                    <div className="h-40 no-print"></div>
                </section>

                {/* EDITOR PANEL */}
                <EditorPanel
                    activePage={activePage}
                    updatePage={updatePage}
                    onAiRequest={openMagicModal}
                    onDeletePage={handleDeletePage}
                />
            </div>
        </>
    );
};

export default Editor;
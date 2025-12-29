import React, { useState, useEffect, useRef } from 'react';
import { TEMPLATES, FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';
import { INITIAL_DATA, PDF_LUIZA_DATA, PageData, RecipePageData, IntroPageData, CoverPageData, SectionPageData, ShoppingPageData, LegendPageData, TocPageData, recipeSchema, introSchema, shoppingSchema } from '@/data/initialData'; // Importar esquemas Zod e tipos específicos
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
import { TocView } from '@/components/views/TocView';
import { IntroView } from '@/components/views/IntroView';
import { ShoppingView } from '@/components/views/ShoppingView';
import { LegendView } from '@/components/views/LegendView';

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
import { usePageManagement } from '@/hooks/usePageManagement'; // Importar usePageManagement

const Editor = () => {
    const [isSaving, setIsSaving] = useState(false);
    
    // Theme State
    const [theme, setTheme] = useState({
        "bg": "#FFF0F5",
        "text": "#2D2D2D",
        "accent": "#FF2D75"
    });
    const [showThemeEditor, setShowThemeEditor] = useState(false);

    const [unsavedChanges, setUnsavedChanges] = useState(false);
    
    const DB_KEY = 'luiza_studio_db_v1';

    // Usar o hook usePageManagement
    const {
        pages,
        setPages,
        selectedId,
        setSelectedId,
        activePage,
        addPage,
        updatePage,
        handleDeletePage,
        handlePageClick,
        dragItem,
        dragOverItem,
        handleDragStart,
        handleDragEnter,
        handleSort,
    } = usePageManagement();

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

    useEffect(() => {
        const initDB = async () => {
            try {
                const savedData = await idb.get(DB_KEY);
                if (savedData) {
                    if (savedData.pages) { // Check for new format
                        setPages(savedData.pages);
                        if (savedData.theme) setTheme(savedData.theme);
                        setSelectedId(savedData.pages[0]?.id || null);
                    } else { // Legacy format
                        setPages(savedData);
                        setSelectedId(savedData[0]?.id || null);
                    }
                } else {
                    const oldData = localStorage.getItem('luiza_studio_v8_5_classic');
                    if (oldData) {
                        const parsed = JSON.parse(oldData);
                        setPages(parsed);
                        setSelectedId(parsed[0]?.id || null);
                        await idb.set(DB_KEY, { pages: parsed, theme }); // Save in new format
                    } else {
                        setPages(PDF_LUIZA_DATA);
                        setSelectedId(PDF_LUIZA_DATA[0].id);
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar DB", err);
                toast.error("Erro ao carregar dados salvos. Carregando dados padrão.");
                setPages(PDF_LUIZA_DATA);
            }
        };
        initDB();
    }, []);

    useEffect(() => {
        if (pages.length > 0) {
            setIsSaving(true);
            const timer = setTimeout(async () => {
                try {
                    await idb.set(DB_KEY, { pages, theme });
                    setUnsavedChanges(true);
                } catch (err) {
                    console.error("Erro ao salvar", err);
                    toast.error("Erro ao salvar dados. Verifique o espaço em disco ou tente novamente.");
                } finally {
                    setIsSaving(false);
                }
            }, 1000); 
            return () => clearTimeout(timer);
        }
    }, [pages, theme]);

    // Update CSS Variables
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-bg', theme.bg);
        root.style.setProperty('--color-text', theme.text);
        root.style.setProperty('--color-accent', theme.accent);
        root.style.setProperty('--color-accent-light', theme.accent + '20'); // 12% opacity hex approximation
    }, [theme]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => { if (unsavedChanges) { e.preventDefault(); e.returnValue = ''; } };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

    const loadPdfData = () => { 
        if(confirm("Restaurar padrão? Todo o trabalho atual será perdido.")) { 
            setPages(JSON.parse(JSON.stringify(PDF_LUIZA_DATA))); 
            setSelectedId(PDF_LUIZA_DATA[0].id); 
            setUnsavedChanges(false);
            toast.success("Dados restaurados para o padrão com sucesso!");
        } 
    };

    const exportProject = () => {
        const data = { pages, theme };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = url; 
        a.download = `ebook_luiza_projeto.json`; 
        a.click();
        setUnsavedChanges(false);
        toast.success("Projeto exportado com sucesso!");
    };

    const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; 
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { 
            try { 
                const data = JSON.parse(ev.target?.result as string); 
                if (data.pages) {
                    setPages(data.pages); 
                    if(data.theme) setTheme(data.theme);
                    if (data.pages.length > 0) setSelectedId(data.pages[0].id); 
                    setUnsavedChanges(false); 
                    toast.success("Projeto importado com sucesso!");
                } else { // Legacy format support
                    setPages(data);
                    if (data.length > 0) setSelectedId(data[0].id); 
                    toast.success("Projeto importado (formato antigo) com sucesso!");
                }
            } catch (err) { 
                console.error("Erro ao importar projeto:", err);
                toast.error("Erro ao importar projeto. Verifique se o arquivo é válido."); 
            } 
        };
        reader.readAsText(file);
    };

    const handlePrint = async () => { 
        document.fonts.ready.then(() => {
            toast.info("⚠️ DICA PARA PDF DIGITAL:\n1. Margens: 'Nenhuma'\n2. Ative: 'Gráficos de plano de fundo'\n3. Salvar como PDF", { duration: 8000 }); 
            window.print(); 
        });
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
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleSort}
                />

                {/* PREVIEW */}
                <section id="preview-container" className="flex-1 bg-transparent overflow-y-auto p-12 flex flex-col items-center custom-scrollbar print:p-0 print:bg-white z-10 relative">
                    {pages.map((p, idx) => (
                    <div 
                        key={p.id} 
                        id={`preview-${p.id}`} 
                        className={`mobile-page transition-all duration-700 mb-12 shrink-0 ${selectedId === p.id ? 'z-10 ring-4 ring-accent/30 scale-[1.01]' : 'opacity-90 scale-100 hover:opacity-100'}`}
                        style={{ backgroundColor: getPageBackgroundColor(p.type, theme) }}
                    >
                        <div className="a4-page-texture"></div>
                        {/* Wrapper "Safe Print Area" */}
                        <div className="z-10 relative h-full flex flex-col">
                            {p.type === TEMPLATES.COVER && <CoverView data={p as CoverPageData} />} {/* Corrigido: Asserção de tipo */}
                            {p.type === TEMPLATES.SECTION && <SectionView data={p as SectionPageData} />} {/* Corrigido: Asserção de tipo */}
                            
                            {/* RECIPE VIEW AGORA TEM LAYOUTS DINÂMICOS */}
                            {p.type === TEMPLATES.RECIPE && <RecipeView data={p as RecipePageData} updatePage={updatePage} />}
                            
                            {p.type === TEMPLATES.TOC && <TocView pages={pages} data={p as TocPageData} onRecipeClick={handlePageClick} />}
                            {p.type === TEMPLATES.INTRO && <IntroView data={p as IntroPageData} />} {/* Corrigido: Asserção de tipo */}
                            {p.type === TEMPLATES.SHOPPING && <ShoppingView data={p as ShoppingPageData} />} {/* Corrigido: Asserção de tipo */}
                            {p.type === TEMPLATES.LEGEND && <LegendView data={p as LegendPageData} />}
                            
                            <div className="mt-auto flex justify-between items-end text-[10px] text-navy/40 font-bold tracking-[0.2em] uppercase border-t border-navy/10 pt-4 w-full px-4 pb-0 no-print-footer">
                                <span>{p.type === TEMPLATES.COVER ? '' : 'www.lumts.com'}</span><span>{p.type === TEMPLATES.COVER ? '' : String(idx + 1).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    ))}
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
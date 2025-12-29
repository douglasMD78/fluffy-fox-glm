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

const MAX_TOC_ITEMS_PER_PAGE = 15; // Deve ser consistente com TocView.tsx

const Editor = () => {
    const [pages, setPages] = useState<PageData[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showImporter, setShowImporter] = useState(false);
    const [importText, setImportText] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [magicModal, setMagicModal] = useState({ isOpen: false, type: 'recipe', title: '', description: '', placeholder: '', prompt: '' });
    const [isMagicGenerating, setIsMagicGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Theme State
    const [theme, setTheme] = useState({
        "bg": "#FFF0F5",
        "text": "#2D2D2D",
        "accent": "#FF2D75"
    });
    const [showThemeEditor, setShowThemeEditor] = useState(false);

    const [dragItem, setDragItem] = useState<number | null>(null);
    const [dragOverItem, setDragOverItem] = useState<number | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    
    const DB_KEY = 'luiza_studio_db_v1';

    // Memoiza as páginas de conteúdo (não-sumário) para otimizar o useEffect do sumário
    const contentPages = React.useMemo(() => pages.filter(p => p.type !== TEMPLATES.TOC), [pages]);

    // Efeito para gerenciar a paginação do sumário
    useEffect(() => {
        const existingTocPages = pages.filter(p => p.type === TEMPLATES.TOC);
        const totalItemsForToc = contentPages.length;
        const requiredTocPagesCount = Math.max(1, Math.ceil(totalItemsForToc / MAX_TOC_ITEMS_PER_PAGE));

        let newTocPages: PageData[] = [];
        for (let i = 0; i < requiredTocPagesCount; i++) {
            const tocPageNumber = i + 1;
            const existingTocPage = existingTocPages.find(p => (p as TocPageData).tocPageNumber === tocPageNumber);
            
            if (existingTocPage) {
                newTocPages.push({ ...existingTocPage, tocPageNumber });
            } else {
                const newId = `p_toc_${Date.now()}_${tocPageNumber}`;
                newTocPages.push({ id: newId, type: TEMPLATES.TOC, ...JSON.parse(JSON.stringify(INITIAL_DATA[TEMPLATES.TOC])), tocPageNumber });
            }
        }

        // Compara as páginas de sumário geradas com as existentes para evitar loop infinito
        const currentTocPageIdsAndNumbers = existingTocPages.map(p => `${p.id}-${(p as TocPageData).tocPageNumber}`).sort().join(',');
        const newTocPageIdsAndNumbers = newTocPages.map(p => `${p.id}-${(p as TocPageData).tocPageNumber}`).sort().join(',');

        if (currentTocPageIdsAndNumbers !== newTocPageIdsAndNumbers || existingTocPages.length !== newTocPages.length) {
            let finalPages: PageData[] = [];
            let tocInsertIndex = -1;

            // Encontra a posição da primeira página de sumário existente ou onde ela deveria ser inserida
            const firstExistingTocIndex = pages.findIndex(p => p.type === TEMPLATES.TOC);
            if (firstExistingTocIndex !== -1) {
                tocInsertIndex = firstExistingTocIndex;
            } else {
                // Tenta inserir após a introdução ou capa
                tocInsertIndex = pages.findIndex(p => p.type === TEMPLATES.INTRO);
                if (tocInsertIndex === -1) tocInsertIndex = pages.findIndex(p => p.type === TEMPLATES.COVER);
                if (tocInsertIndex !== -1) tocInsertIndex++; // Inserir APÓS a página encontrada
                else tocInsertIndex = 0; // Padrão: no início
            }

            const pagesWithoutOldTocs = pages.filter(p => p.type !== TEMPLATES.TOC);
            
            finalPages = [
                ...pagesWithoutOldTocs.slice(0, tocInsertIndex),
                ...newTocPages,
                ...pagesWithoutOldTocs.slice(tocInsertIndex)
            ];

            setPages(finalPages);
        }
    }, [contentPages, pages]); // Depende de contentPages (para mudanças de conteúdo) e pages (para contexto completo)


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

    const addPage = (type: TEMPLATES) => { 
        const newId = `p_${Date.now()}`; 
        const pageData = { id: newId, type, ...JSON.parse(JSON.stringify(INITIAL_DATA[type])) }; 
        setPages([...pages, pageData]); 
        setSelectedId(newId); 
        toast.success(`Página de ${type} adicionada!`);
    };

    const updatePage = (newData: Partial<PageData>) => { 
        setPages(pages.map(p => p.id === selectedId ? { ...p, ...newData } as PageData : p)); // Corrigido: Asserção de tipo para PageData
    };
   
    const handleDragStart = (index: number) => setDragItem(index);
    const handleDragEnter = (index: number) => setDragOverItem(index);

    const handleSort = () => {
        if (dragItem === null || dragOverItem === null) return;
        let _pages = [...pages];
        const draggedItemContent = _pages.splice(dragItem, 1)[0];
        _pages.splice(dragOverItem, 0, draggedItemContent);
        setDragItem(null); 
        setDragOverItem(null);
        setPages(_pages);
        toast.info("Páginas reordenadas.");
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

    const organizeRecipeWithAI = async () => {
        if (!importText.trim()) {
            toast.info("Por favor, cole o texto da receita para organizar.");
            return;
        }
        setIsImporting(true);
        try {
            // Prompt atualizado para permitir valores decimais em calorias
            const prompt = `Organize esta receita em JSON estrito: "${importText}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser **strings**. Para 'prot', 'carb', 'fat', inclua 'g' no final (ex: "5g"). Para 'cal', inclua o número (inteiro ou decimal) como string (ex: "110" ou "67.8"). Formato: { "title": "...", "category": "...", "yield": "...", "nutrition": { "cal": "STRING_NUMERIC_VALUE", "prot": "STRING_NUMERIC_VALUE_WITH_G", "carb": "STRING_NUMERIC_VALUE_WITH_G", "fat": "STRING_NUMERIC_VALUE_WITH_G" }, "ingredientGroups": [{ "title": "...", "items": "item 1\\nitem 2" }], "prepSteps": "Primeiro passo\\nSegundo passo", "tips": "Dica com **negrito**", "storage": "Armazenamento com **negrito**" }. Sem markdown para o JSON em si.`;
            const text = await callGemini(prompt);
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const parsedData = JSON.parse(cleanJson);
            const validatedData = recipeSchema.parse(parsedData); // Validação Zod

            const newId = `p_${Date.now()}`;
            const pageData = { id: newId, type: TEMPLATES.RECIPE, ...JSON.parse(JSON.stringify(INITIAL_DATA[TEMPLATES.RECIPE])), ...validatedData };
            setPages([...pages, pageData]); 
            setSelectedId(newId); 
            setShowImporter(false); 
            setImportText("");
            toast.success("Receita organizada e adicionada com sucesso!");

        } catch (err: any) { 
            console.error("Erro ao organizar receita com IA:", err);
            if (err.name === 'ZodError') {
                toast.error("Erro de validação: A IA retornou um formato inesperado. Tente ajustar o texto ou o prompt. Detalhes: " + err.errors.map((e: any) => e.message).join(', '));
            } else if (err instanceof SyntaxError) {
                toast.error("Erro de formato JSON: A IA retornou um JSON inválido. Tente novamente.");
            } else {
                toast.error("Erro ao organizar receita: " + err.message); 
            }
        } finally { 
            setIsImporting(false); 
        }
    };

    const handleMagicSubmit = async () => {
        if (!magicModal.prompt.trim()) {
            toast.info("Por favor, digite um prompt para a IA gerar o conteúdo.");
            return;
        }
        setIsMagicGenerating(true);
        try {
            let prompt = "";
            let schemaToValidate;

            if (magicModal.type === 'recipe') {
                // Prompt atualizado para permitir valores decimais em calorias
                prompt = `Crie receita JSON para: "${magicModal.prompt}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser **strings**. Para 'prot', 'carb', 'fat', inclua 'g' no final (ex: "5g"). Para 'cal', inclua o número (inteiro ou decimal) como string (ex: "110" ou "67.8"). Chaves: title, category, yield, nutrition, ingredientGroups, prepSteps, tips, storage. Formato de prepSteps: "Primeiro passo\\nSegundo passo". Sem markdown para o JSON em si.`;
                schemaToValidate = recipeSchema;
            } else if (magicModal.type === 'intro') {
                prompt = `Escreva intro curta para ebook sobre: "${magicModal.prompt}". Permita **negrito** com markdown. Texto puro.`;
                schemaToValidate = introSchema;
            } else if (magicModal.type === 'shopping') {
                prompt = `Crie lista compras JSON para dieta: "${magicModal.prompt}". Chaves: hortifruti, acougue, laticinios, padaria, mercearia. Sem markdown para o JSON em si.`;
                schemaToValidate = shoppingSchema;
            }
           
            const text = await callGemini(prompt);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            if (magicModal.type === 'recipe') {
                const parsedData = JSON.parse(cleanText);
                const validatedData = schemaToValidate.parse(parsedData); // Validação Zod
                const newId = `p_${Date.now()}`;
                setPages([...pages, { id: newId, type: TEMPLATES.RECIPE, ...INITIAL_DATA[TEMPLATES.RECIPE], ...validatedData as Partial<RecipePageData> }]);
                setSelectedId(newId);
            } else if (magicModal.type === 'intro') {
                const parsedData = { text: cleanText }; // Intro é texto puro, mas validamos se não está vazio
                const validatedData = schemaToValidate.parse(parsedData);
                updatePage(validatedData);
            }
            else if (magicModal.type === 'shopping') {
                const parsedData = JSON.parse(cleanText);
                const validatedData = schemaToValidate.parse(parsedData); // Validação Zod
                updatePage(validatedData);
            }
           
            setMagicModal({ ...magicModal, isOpen: false, prompt: '' });
            toast.success("Conteúdo gerado com IA com sucesso!");

        } catch (err: any) { 
            console.error("Erro na IA:", err);
            if (err.name === 'ZodError') {
                toast.error("Erro de validação: A IA retornou um formato inesperado. Tente ajustar o prompt. Detalhes: " + err.errors.map((e: any) => e.message).join(', '));
            } else if (err instanceof SyntaxError) {
                toast.error("Erro de formato JSON: A IA retornou um JSON inválido. Tente novamente.");
            } else {
                toast.error("Erro ao gerar conteúdo com IA: " + err.message); 
            }
        } finally { 
            setIsMagicGenerating(false); 
        }
    };

    const openMagicModal = (type: 'recipe' | 'intro' | 'shopping') => {
        let title = '';
        let description = '';
        let placeholder = '';
        if (type === 'recipe') {
            title = 'Receita Mágica com IA';
            description = 'Descreva a receita que você deseja criar (ex: "Bolo de cenoura fit com cobertura de chocolate").';
            placeholder = 'Ex: Torta de frango cremosa low carb';
        } else if (type === 'intro') {
            title = 'Escrever Introdução com IA';
            description = 'Descreva o tema do seu e-book para a IA escrever uma introdução (ex: "E-book de receitas saudáveis para emagrecimento").';
            placeholder = 'Ex: E-book de marmitas fitness para semana';
        } else if (type === 'shopping') {
            title = 'Gerar Lista de Compras com IA';
            description = 'Descreva o tipo de dieta ou refeições para a IA gerar uma lista de compras (ex: "Dieta mediterrânea para 7 dias").';
            placeholder = 'Ex: Lista de compras para dieta vegana';
        }
        setMagicModal({ isOpen: true, type, title, description, placeholder, prompt: '' });
    };

    const handlePageClick = (pageId: string) => {
        setSelectedId(pageId);
        const previewElement = document.getElementById(`preview-${pageId}`);
        if (previewElement) {
            previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleDeletePage = () => {
        if (selectedId && confirm("Tem certeza que deseja excluir esta página?")) {
            setPages(pages.filter(p => p.id !== selectedId));
            setSelectedId(null);
            toast.success("Página excluída com sucesso!");
        }
    };

    const activePage = pages.find(p => p.id === selectedId);
    
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

                {showImporter && (
                    <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
                        <div className="bg-white p-6 rounded-[2rem] w-full max-w-lg shadow-2xl border border-white">
                            <h3 className="text-xl font-serif font-bold text-navy mb-2 flex items-center gap-2"><FileUp className="text-accent"/> Importação Inteligente</h3>
                            <p className="text-sm text-navy/60 mb-4">Cole o texto de uma receita desorganizada aqui e a IA irá estruturá-la automaticamente para você.</p>
                            <textarea className="w-full h-64 bg-surface border border-gray-100 rounded-xl p-4 text-xs font-mono mb-4 focus:ring-1 focus:ring-accent focus:outline-none text-navy" value={importText} onChange={e => setImportText(e.target.value)} placeholder="Cole o texto bagunçado da receita aqui..."/>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setShowImporter(false)} className="px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 rounded-xl text-navy/60">Cancelar</button>
                                <button onClick={organizeRecipeWithAI} disabled={isImporting || !importText.trim()} className="px-4 py-2 bg-gradient-to-r from-accent to-rose-500 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-accent/30">
                                    {isImporting ? <RefreshCw className="animate-spin" size={12}/> : <Brain size={12}/>} {isImporting ? "Organizando..." : "Organizar com IA"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {magicModal.isOpen && (
                    <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
                        <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-glass border border-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-pastel to-orange-300"></div>
                            <h3 className="text-2xl font-serif italic mb-2 flex items-center gap-2 text-navy"><Sparkles className="text-accent animate-pulse"/> {magicModal.title}</h3>
                            <p className="text-sm text-navy/60 mb-6">{magicModal.description}</p>
                            <textarea className="w-full h-32 bg-surface border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none text-navy" placeholder={magicModal.placeholder} value={magicModal.prompt} onChange={e => setMagicModal({...magicModal, prompt: e.target.value})} disabled={isMagicGenerating}/>
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setMagicModal({...magicModal, isOpen: false})} className="px-5 py-3 text-xs font-bold uppercase hover:bg-surface rounded-xl text-navy/60 transition-colors">Cancelar</button>
                                <button onClick={handleMagicSubmit} disabled={isMagicGenerating || !magicModal.prompt.trim()} className="px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 bg-gradient-to-r from-accent to-rose-500 text-white shadow-lg shadow-accent/30 hover:scale-105 transition-transform">
                                    {isMagicGenerating ? <><RefreshCw className="animate-spin" size={14}/> Criando...</> : <><MagicStick size={14}/> ✨ Criar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
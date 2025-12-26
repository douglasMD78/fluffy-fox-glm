import React, { useState, useEffect, useRef } from 'react';
import { TEMPLATES, FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';
import { INITIAL_DATA, PDF_LUIZA_DATA, PageData, RecipePageData, IntroPageData, CoverPageData, SectionPageData, ShoppingPageData, LegendPageData, recipeSchema, introSchema, shoppingSchema } from '@/data/initialData'; // Importar esquemas Zod e tipos específicos
import { compressImage } from '@/utils/image';
import { callGemini } from '@/utils/gemini';
import { generatePdf } from '@/utils/pdf';
import * as idb from 'idb-keyval'; // Import idb-keyval
import { toast } from 'sonner'; // Importar toast

// Icons
import { Plus, Trash2, Save, FileUp, Printer, Settings, BookOpen, ImageIcon, Layout, List, AlignLeft, MagicStick, RefreshCw, Sparkles, Brain, Package, Columns, PlayCircle, Type, Minus, HardDrive, Palette, Maximize } from '@/components/icons';

// Editors
import { RecipeEditor } from '@/components/editors/RecipeEditor';
import { CoverEditor } from '@/components/editors/CoverEditor';
import { IntroEditor } from '@/components/editors/IntroEditor';
import { SectionEditor } from '@/components/editors/SectionEditor';
import { ShoppingEditor } from '@/components/editors/ShoppingEditor';
import { LegendEditor } from '@/components/editors/LegendEditor';
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
        bg: '#FFF0F5',
        text: '#2D2D2D',
        accent: '#FF2D75'
    });
    const [showThemeEditor, setShowThemeEditor] = useState(false);

    const [dragItem, setDragItem] = useState<number | null>(null);
    const [dragOverItem, setDragOverItem] = useState<number | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    
    const DB_KEY = 'luiza_studio_db_v1';

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
            // Prompt atualizado para garantir passos sem numeração e permitir markdown em tips/storage
            const prompt = `Organize esta receita em JSON estrito: "${importText}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser apenas números (sem unidades como 'g' ou 'kcal'). Formato: { "title": "...", "category": "...", "yield": "...", "nutrition": { "cal": "NUMERIC_VALUE", "prot": "NUMERIC_VALUE", "carb": "NUMERIC_VALUE", "fat": "NUMERIC_VALUE" }, "ingredientGroups": [{ "title": "...", "items": "item 1\\nitem 2" }], "prepSteps": "Primeiro passo\\nSegundo passo", "tips": "Dica com **negrito**", "storage": "Armazenamento com **negrito**" }. Sem markdown para o JSON em si.`;
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
                prompt = `Crie receita JSON para: "${magicModal.prompt}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser apenas números (sem unidades como 'g' ou 'kcal'). Chaves: title, category, yield, nutrition, ingredientGroups, prepSteps, tips, storage. Formato de prepSteps: "Primeiro passo\\nSegundo passo". Sem markdown para o JSON em si.`;
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
                            <button onClick={exportProject} className={`flex items-center justify-center gap-2 p-2 rounded-xl text-[10px] font-bold border transition-all ${unsavedChanges ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-surface text-navy/60 border-transparent hover:bg-gray-100'}`}><Save size={12}/> {unsavedChanges ? 'Salvar*' : 'Salvo'}</button>
                            <label className="flex items-center justify-center gap-2 p-2 bg-surface rounded-xl text-[10px] font-bold text-navy/60 cursor-pointer hover:bg-gray-100 transition-all"><FileUp size={12}/> Abrir <input type="file" className="hidden" onChange={importProject}/></label>
                        </div>
                        <button onClick={() => setShowThemeEditor(true)} className="w-full bg-surface hover:bg-gray-100 text-navy/60 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-2 transition-all mb-2"><Palette size={12} /> Configurar Cores</button>
                        <button onClick={loadPdfData} className="w-full bg-surface hover:bg-gray-100 text-navy/50 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-2 transition-all"><RefreshCw size={12} /> Restaurar Padrão</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {pages.map((p, i) => (
                        <div
                            key={p.id}
                            draggable
                            onDragStart={() => setDragItem(i)}
                            onDragEnter={() => setDragOverItem(i)}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => handlePageClick(p.id)}
                            className={`group flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border ${selectedId === p.id ? 'bg-accent text-white shadow-lg shadow-accent/30 border-transparent' : 'border-transparent text-navy/60 hover:bg-surface'} ${dragOverItem === i ? 'border-t-2 border-accent' : ''}`}
                        >
                            <span className={`text-[10px] font-mono w-4 ${selectedId === p.id ? 'text-white/70' : 'text-accent'}`}>{i + 1}</span>
                            <div className="flex-1 truncate text-[11px] font-bold uppercase tracking-widest font-sans">{p.title || 'Sem Título'}</div>
                        </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100/50 bg-white/50">
                        <button onClick={() => openMagicModal('recipe')} className="w-full bg-gradient-to-r from-accent to-rose-500 hover:from-accent hover:to-rose-600 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all mb-3 text-white transform active:scale-95"><Sparkles size={16}/> ✨ Receita Mágica IA</button>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button onClick={() => setShowImporter(true)} className="bg-surface hover:bg-gray-100 p-2 rounded-xl text-[9px] font-bold uppercase text-navy/70 flex items-center justify-center gap-1 transition-colors"><FileUp size={12}/> Importar Txt</button>
                            <button onClick={() => addPage(TEMPLATES.RECIPE)} className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 transition-colors"><Plus size={12}/> Manual</button>
                        </div>

                        <div className="grid grid-cols-4 gap-1 mb-4">
                            <button onClick={() => addPage(TEMPLATES.COVER)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Capa"><Layout size={14}/></button>
                            <button onClick={() => addPage(TEMPLATES.SECTION)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Capítulo"><Settings size={14}/></button>
                            <button onClick={() => addPage(TEMPLATES.TOC)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Sumário"><List size={14}/></button>
                            <button onClick={() => addPage(TEMPLATES.INTRO)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Intro"><AlignLeft size={14}/></button>
                            <button onClick={() => addPage(TEMPLATES.LEGEND)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Legendas"><BookOpen size={14}/></button>
                            <button onClick={() => addPage(TEMPLATES.SHOPPING)} className="bg-surface hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center text-navy/60" title="Compras"><Package size={14}/></button>
                        </div>
                        <button onClick={handlePrint} className="w-full bg-navy text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors shadow-lg"><Printer size={16}/> Salvar PDF (A5)</button>
                    </div>
                </aside>

                {/* EDITOR */}
                <main className="w-[450px] bg-surface/50 border-r border-white/50 overflow-y-auto p-8 custom-scrollbar no-print shrink-0 z-10">
                    {activePage ? (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center pb-6 border-b border-navy/5">
                            <div className="space-y-1"><h2 className="text-accent text-[12px] font-black uppercase tracking-widest">Painel de Edição</h2><p className="text-[10px] text-navy/40 font-bold uppercase font-sans">{activePage.type}</p></div>
                            <button onClick={() => { if(confirm("Apagar página?")) setPages(pages.filter(p => p.id !== selectedId)) }} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                        </div>
                        <div className="space-y-6">
                            {/* Titulo comum a todos exceto capas que tem campos proprios */}
                            {activePage.type !== TEMPLATES.COVER && activePage.type !== TEMPLATES.SECTION && activePage.type !== TEMPLATES.TOC && activePage.type !== TEMPLATES.INTRO && activePage.type !== TEMPLATES.LEGEND && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Título Principal</label>
                                <input className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-navy transition-all shadow-sm" value={activePage.title} onChange={e => updatePage({title: e.target.value})} />
                            </div>
                            )}

                            {activePage.type === TEMPLATES.RECIPE && <RecipeEditor activePage={activePage as RecipePageData} updatePage={updatePage} />}
                            {activePage.type === TEMPLATES.COVER && <CoverEditor activePage={activePage as CoverPageData} updatePage={updatePage} />} {/* Corrigido: Asserção de tipo */}
                            {activePage.type === TEMPLATES.INTRO && <IntroEditor activePage={activePage as IntroPageData} updatePage={updatePage} onAiRequest={() => openMagicModal('intro')} />} {/* Corrigido: Asserção de tipo */}
                            {activePage.type === TEMPLATES.SECTION && <SectionEditor activePage={activePage as SectionPageData} updatePage={updatePage} />} {/* Corrigido: Asserção de tipo */}
                            {activePage.type === TEMPLATES.SHOPPING && <ShoppingEditor activePage={activePage as ShoppingPageData} updatePage={updatePage} onAiRequest={() => openMagicModal('shopping')} />} {/* Corrigido: Asserção de tipo */}
                            {activePage.type === TEMPLATES.LEGEND && <LegendEditor activePage={activePage as LegendPageData} updatePage={updatePage} />}
                        </div>
                    </div>
                    ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30 text-navy"><ImageIcon size={48} className="mb-4" /><p className="text-sm font-bold uppercase tracking-widest">Selecione uma página</p></div>
                    )}
                </main>

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
                            
                            {p.type === TEMPLATES.TOC && <TocView pages={pages} data={p} onRecipeClick={handlePageClick} />}
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
            </div>
        </>
    );
};

export default Editor;
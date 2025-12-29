import React, { useState, useEffect } from 'react';
import * as idb from 'idb-keyval';
import { toast } from 'sonner';
import { PageData, PDF_LUIZA_DATA, INITIAL_DATA } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { usePageManagement } from './usePageManagement'; // Importar o hook de gerenciamento de páginas

interface Theme {
    bg: string;
    text: string;
    accent: string;
}

interface UseAppPersistenceResult {
    pages: PageData[];
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
    activePage: PageData | undefined;
    addPage: (type: TEMPLATES) => void;
    updatePage: (newData: Partial<PageData>) => void;
    handleDeletePage: () => void;
    handlePageClick: (pageId: string) => void;
    dragItem: number | null;
    dragOverItem: number | null;
    handleDragStart: (index: number) => void;
    onDragEnter: (index: number) => void; // Renomeado para onDragEnter para consistência
    handleSort: () => void;
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    isSaving: boolean;
    unsavedChanges: boolean;
    exportProject: () => void;
    importProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loadPdfData: () => void;
    showThemeEditor: boolean; // Adicionado
    setShowThemeEditor: React.Dispatch<React.SetStateAction<boolean>>; // Adicionado
    handlePrint: () => Promise<void>; // Adicionado
}

export const useAppPersistence = (): UseAppPersistenceResult => {
    // Theme state
    const [theme, setTheme] = useState<Theme>({
        "bg": "#FFF0F5",
        "text": "#2D2D2D",
        "accent": "#FF2D75"
    });
    const [showThemeEditor, setShowThemeEditor] = useState(false); // Movido para cá

    // Persistence states
    const [isSaving, setIsSaving] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const DB_KEY = 'luiza_studio_db_v1';

    // Integrate usePageManagement
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
        handleDragEnter, // Usando o nome original do usePageManagement
        handleSort,
    } = usePageManagement({ initialPages: [], initialSelectedId: null }); // Pass initial empty states, as persistence will load them

    // Initial data load effect
    useEffect(() => {
        const initDB = async () => {
            try {
                const savedData = await idb.get(DB_KEY);
                if (savedData) {
                    if (savedData.pages) {
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
                        await idb.set(DB_KEY, { pages: parsed, theme });
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
    }, []); // Run only once on mount

    // Save changes effect
    useEffect(() => {
        // Only save if pages array has been initialized (not empty initial state)
        // or if it's explicitly empty (e.g., all pages deleted)
        if (pages.length > 0 || (pages.length === 0 && selectedId === null)) { 
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
    }, [pages, theme]); // Depend on pages and theme changes

    // Update CSS Variables effect
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-bg', theme.bg);
        root.style.setProperty('--color-text', theme.text);
        root.style.setProperty('--color-accent', theme.accent);
        root.style.setProperty('--color-accent-light', theme.accent + '20');
    }, [theme]);

    // Unsaved changes warning effect
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

    const handlePrint = async () => { // Movido para cá
        document.fonts.ready.then(() => {
            toast.info("⚠️ DICA PARA PDF DIGITAL:\n1. Margens: 'Nenhuma'\n2. Ative: 'Gráficos de plano de fundo'\n3. Salvar como PDF", { duration: 8000 }); 
            window.print(); 
        });
    };

    return {
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
        onDragEnter: handleDragEnter, // Mapeando para o nome da interface
        handleSort,
        theme,
        setTheme,
        isSaving,
        unsavedChanges,
        exportProject,
        importProject,
        loadPdfData,
        showThemeEditor,
        setShowThemeEditor,
        handlePrint,
    };
};
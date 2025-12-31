import React, { useState, useEffect } from 'react';
import * as idb from 'idb-keyval';
import { toast } from 'sonner';
import { PageData, PDF_LUIZA_DATA, INITIAL_DATA } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';
import { usePageManagement } from './usePageManagement'; // Importar o hook de gerenciamento de páginas
import { buildTocItems, splitTocIntoParts, TOC_MAX_UNITS_PER_PAGE } from '@/utils/toc';
import { generatePdf } from '@/utils/pdf'; // Importar generatePdf

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
    const [initialized, setInitialized] = useState(false);

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
                        setPages(PDF_LUIZA_DATA as any);
                        setSelectedId((PDF_LUIZA_DATA as any)[0].id);
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar DB", err);
                toast.error("Erro ao carregar dados salvos. Carregando dados padrão.");
                setPages(PDF_LUIZA_DATA as any);
            } finally {
                setInitialized(true);
            }
        };
        initDB();
    }, []); // Run only once on mount

    const ensureTocPages = (currentPages: PageData[]): PageData[] => {
        const existingTocById = new Map<string, PageData>();
        currentPages.filter(p => p.type === TEMPLATES.TOC).forEach(p => existingTocById.set(p.id, p));

        const withoutToc = currentPages.filter(p => p.type !== TEMPLATES.TOC);

        const tocItems = buildTocItems(withoutToc);
        const parts = splitTocIntoParts(tocItems, TOC_MAX_UNITS_PER_PAGE);
        const requiredCount = parts.length;

        const tocPages: PageData[] = Array.from({ length: requiredCount }).map((_, idx) => {
            const id = `p_toc_${idx + 1}`;
            const existing = existingTocById.get(id);

            const base = {
                id,
                type: TEMPLATES.TOC,
                ...JSON.parse(JSON.stringify(INITIAL_DATA[TEMPLATES.TOC])),
                ...(existing ? { title: existing.title, fontScale: (existing as any).fontScale } : {}),
                part: idx + 1,
            } as PageData;

            if (!base.title) base.title = idx === 0 ? 'Sumário' : 'Sumário (continuação)';
            return base;
        });

        const insertIndex = Math.max(
            0,
            withoutToc.findIndex(p => p.type === TEMPLATES.SECTION || p.type === TEMPLATES.RECIPE)
        );

        const safeInsertIndex = insertIndex === -1 ? withoutToc.length : insertIndex;

        const next = [
            ...withoutToc.slice(0, safeInsertIndex),
            ...tocPages,
            ...withoutToc.slice(safeInsertIndex),
        ];

        const sameShape =
            next.length === currentPages.length &&
            next.every((p, i) => currentPages[i]?.id === p.id && currentPages[i]?.type === p.type);

        return sameShape ? currentPages : next;
    };

    // Sync TOC pages (keeps 2–3 pages automatically as content grows)
    useEffect(() => {
        if (!initialized) return;
        const next = ensureTocPages(pages);
        if (next !== pages) setPages(next);
    }, [initialized, pages, setPages]);

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

    const handlePrint = async () => {
        const previewElement = document.getElementById('preview-container');
        if (previewElement) {
            toast.loading("Gerando PDF, aguarde...", { id: 'pdf-gen' });
            try {
                await generatePdf(previewElement, 'ebook_luiza.pdf');
                toast.success("PDF gerado com sucesso!", { id: 'pdf-gen' });
            } catch (error) {
                console.error("Erro ao gerar PDF:", error);
                toast.error("Erro ao gerar PDF. Tente novamente.", { id: 'pdf-gen' });
            }
        } else {
            toast.error("Não foi possível encontrar o conteúdo para gerar o PDF.");
        }
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
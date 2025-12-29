import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { TEMPLATES } from '@/lib/constants';
import { PageData, INITIAL_DATA, PDF_LUIZA_DATA, TocPageData } from '@/data/initialData';

const MAX_TOC_ITEMS_PER_PAGE = 15;

interface UsePageManagementProps {
    initialPages?: PageData[];
    initialSelectedId?: string | null;
}

export const usePageManagement = (props?: UsePageManagementProps) => {
    const [pages, setPages] = useState<PageData[]>(props?.initialPages || []);
    const [selectedId, setSelectedId] = useState<string | null>(props?.initialSelectedId || null);
    const [dragItem, setDragItem] = useState<number | null>(null);
    const [dragOverItem, setDragOverItem] = useState<number | null>(null);

    // Memoiza as páginas de conteúdo (não-sumário) para otimizar o useEffect do sumário
    const contentPages = useMemo(() => pages.filter(p => p.type !== TEMPLATES.TOC), [pages]);

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

    const addPage = (type: TEMPLATES) => { 
        const newId = `p_${Date.now()}`; 
        const pageData = { id: newId, type, ...JSON.parse(JSON.stringify(INITIAL_DATA[type])) }; 
        setPages([...pages, pageData]); 
        setSelectedId(newId); 
        toast.success(`Página de ${type} adicionada!`);
    };

    const updatePage = (newData: Partial<PageData>) => { 
        setPages(pages.map(p => p.id === selectedId ? { ...p, ...newData } as PageData : p));
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

    const handleDeletePage = () => {
        if (selectedId && confirm("Tem certeza que deseja excluir esta página?")) {
            setPages(pages.filter(p => p.id !== selectedId));
            setSelectedId(null);
            toast.success("Página excluída com sucesso!");
        }
    };

    const handlePageClick = (pageId: string) => {
        setSelectedId(pageId);
        const previewElement = document.getElementById(`preview-${pageId}`);
        if (previewElement) {
            previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const activePage = useMemo(() => pages.find(p => p.id === selectedId), [pages, selectedId]);

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
        handleDragEnter,
        handleSort,
    };
};
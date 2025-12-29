import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { TEMPLATES, MAX_TOC_ITEMS_PER_PAGE } from '@/lib/constants'; // Importando MAX_TOC_ITEMS_PER_PAGE
import { MAX_TOC_PAGES } from '@/lib/constants';
import { PageData, INITIAL_DATA, PDF_LUIZA_DATA, TocPageData } from '@/data/initialData';

// Removido: const MAX_TOC_ITEMS_PER_PAGE = 15;

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
        // Sem efeito para gerar ou inserir páginas de sumário (TOC)
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
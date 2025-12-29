import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { TEMPLATES, MAX_TOC_ITEMS_PER_PAGE, MAX_TOC_PAGES } from '@/lib/constants';
import { PageData, INITIAL_DATA, PDF_LUIZA_DATA, TocPageData } from '@/data/initialData';

interface UsePageManagementProps {
    initialPages?: PageData[];
    initialSelectedId?: string | null;
}

// Gerar IDs determinísticos para páginas TOC
const getTocPageId = (pageNumber: number) => `toc-page-${pageNumber}`;

export const usePageManagement = (props?: UsePageManagementProps) => {
    const [pages, setPages] = useState<PageData[]>(props?.initialPages || []);
    const [selectedId, setSelectedId] = useState<string | null>(props?.initialSelectedId || null);
    const [dragItem, setDragItem] = useState<number | null>(null);
    const [dragOverItem, setDragOverItem] = useState<number | null>(null);

    // Memoiza itens relevantes para o TOC (apenas receitas)
    const contentPages = useMemo(() => pages.filter(p => p.type === TEMPLATES.RECIPE), [pages]);

    // Efeito para gerenciar a paginação do sumário (otimizado)
    useEffect(() => {
        const existingTocPages = pages.filter(p => p.type === TEMPLATES.TOC);
        const requiredTocPagesCount = contentPages.length > 0 ? Math.min(2, MAX_TOC_PAGES) : 1;

        // Criar IDs determinísticos
        const expectedTocIds = Array.from({ length: requiredTocPagesCount }, (_, i) => getTocPageId(i + 1));
        const existingTocIds = existingTocPages.map(p => p.id).sort();

        // Verificar se precisamos recriar as páginas TOC
        const needsRecreation = 
            existingTocPages.length !== requiredTocPagesCount ||
            JSON.stringify(existingTocIds) !== JSON.stringify(expectedTocIds);

        if (!needsRecreation) {
            return; // Tudo OK, não precisa fazer nada
        }

        // Criar novas páginas TOC
        let newTocPages: PageData[] = [];
        for (let i = 0; i < requiredTocPagesCount; i++) {
            const tocPageNumber = i + 1;
            const tocPageId = getTocPageId(tocPageNumber);
            const existingTocPage = existingTocPages.find(p => p.id === tocPageId);
            
            if (existingTocPage) {
                newTocPages.push({ ...existingTocPage, tocPageNumber });
            } else {
                newTocPages.push({ 
                    id: tocPageId, 
                    type: TEMPLATES.TOC, 
                    ...JSON.parse(JSON.stringify(INITIAL_DATA[TEMPLATES.TOC])), 
                    tocPageNumber 
                });
            }
        }

        // Encontrar posição de inserção correta
        let tocInsertIndex = pages.findIndex(p => p.type === TEMPLATES.TOC);
        if (tocInsertIndex === -1) {
            // Inserir após Cover/Intro, mas antes de Legend
            tocInsertIndex = pages.findIndex(p => p.type === TEMPLATES.INTRO);
            if (tocInsertIndex !== -1) tocInsertIndex++;
            else {
                tocInsertIndex = pages.findIndex(p => p.type === TEMPLATES.COVER);
                if (tocInsertIndex !== -1) tocInsertIndex++;
                else tocInsertIndex = 0;
            }
        }

        // Remover páginas TOC antigas e inserir as novas
        const pagesWithoutOldTocs = pages.filter(p => p.type !== TEMPLATES.TOC);
        const finalPages: PageData[] = [
            ...pagesWithoutOldTocs.slice(0, tocInsertIndex),
            ...newTocPages,
            ...pagesWithoutOldTocs.slice(tocInsertIndex),
        ];

        setPages(finalPages);

    }, [contentPages.length]); // Depende apenas do número de receitas, não de todo o array

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
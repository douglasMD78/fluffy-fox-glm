import html2pdf from 'html2pdf.js';

export const generatePdf = async (element: HTMLElement, filename: string = 'document.pdf') => {
    const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Clonar o elemento para não afetar o DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Remover elementos não imprimíveis
    clonedElement.querySelectorAll('.no-print').forEach(el => el.remove());
    clonedElement.querySelectorAll('.no-print-footer').forEach(el => el.remove());

    // Melhorar quebras de coluna para PDF
    const tocElements = clonedElement.querySelectorAll('[class*="columns-"]');
    tocElements.forEach((tocEl: any) => {
        // Forçar regras de quebra para impressão
        tocEl.style.pageBreakInside = 'avoid';
        tocEl.style.breakInside = 'avoid';
        
        // Aplicar em blocos internos
        const blocks = tocEl.querySelectorAll('[style*="break-inside"]');
        blocks.forEach((block: any) => {
            block.style.pageBreakInside = 'avoid';
            block.style.breakInside = 'avoid';
            block.style.columnBreakInside = 'avoid';
        });
    });

    // Criar container temporário para renderização
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.height = 'auto';
    tempDiv.style.overflow = 'hidden';
    tempDiv.appendChild(clonedElement);
    document.body.appendChild(tempDiv);

    try {
        // Aguardar renderização completa
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar se o conteúdo excede a altura de uma página A4
        const elementHeight = clonedElement.scrollHeight;
        const a4HeightPx = 1123; // Aproximadamente 297mm em pixels a 96dpi
        
        if (elementHeight > a4HeightPx) {
            console.warn(`Contúdo excede altura A4: ${elementHeight}px > ${a4HeightPx}px`);
        }

        await html2pdf().set(opt).from(clonedElement).save();
    } finally {
        // Limpar
        if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
        }
    }
};
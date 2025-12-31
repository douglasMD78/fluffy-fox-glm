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
        jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }, // Alterado de 'a4' para 'a5'
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
    tempDiv.style.position = 'fixed'; // Usar fixed para garantir que apareça
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '100vw';
    tempDiv.style.height = '100vh';
    tempDiv.style.zIndex = '99999'; // Garantir que esteja acima de tudo
    tempDiv.style.backgroundColor = 'rgba(255,255,255,0.9)'; // Fundo semi-transparente
    tempDiv.style.overflow = 'auto';
    tempDiv.style.display = 'flex';
    tempDiv.style.alignItems = 'center';
    tempDiv.style.justifyContent = 'center';
    tempDiv.appendChild(clonedElement);
    document.body.appendChild(tempDiv);

    console.log("Conteúdo HTML para PDF:", clonedElement.outerHTML);

    try {
        // Removido o setTimeout, html2pdf.js deve gerenciar sua própria renderização
        await html2pdf().set(opt).from(clonedElement).save();
    } finally {
        // Limpar
        if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
        }
    }
};
import html2pdf from 'html2pdf.js';

export const generatePdf = async (element: HTMLElement, filename: string = 'document.pdf') => {
    const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number], // Top, Left, Bottom, Right - Corrigido para tipo específico
        filename: filename,
        image: { type: 'jpeg', quality: 0.9 }, // Ajustado de 0.98 para 0.9
        html2canvas: { 
            scale: 2, // Increase scale for better quality
            useCORS: true, // Enable CORS for images
            logging: false, // Disable logging
            letterRendering: true, // Improve text rendering
            allowTaint: true, // Allow images from other origins to taint the canvas
            backgroundColor: '#ffffff', // Explicitly set background color for html2canvas
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Control page breaks
    };

    // Clone the element to remove non-printable parts without affecting the live DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.querySelectorAll('.no-print').forEach(el => el.remove());
    clonedElement.querySelectorAll('.no-print-footer').forEach(el => el.remove());

    // Append the cloned element to a temporary hidden div to ensure all styles are computed
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm'; // Ensure A4 width for calculation
    tempDiv.style.height = '297mm'; // Ensure A4 height for calculation
    tempDiv.appendChild(clonedElement);
    document.body.appendChild(tempDiv);

    try {
        // Add a small delay to ensure all styles are computed and applied to the cloned element
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

        await html2pdf().set(opt).from(clonedElement).save();
    } finally {
        // Clean up the temporary div
        document.body.removeChild(tempDiv);
    }
};
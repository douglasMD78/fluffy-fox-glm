import { GlobalWorkerOptions, getDocument, version as pdfjsVersion } from "pdfjs-dist";

// Configurar o worker do pdf.js a partir do CDN compatível com a versão instalada
const workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;
GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extrai o texto de todas as páginas de um arquivo PDF (File ou ArrayBuffer).
 * Retorna um array com o texto por página e o texto concatenado completo.
 */
export async function extractPdfText(input: File | ArrayBuffer) {
  const data = input instanceof File ? await input.arrayBuffer() : input;
  const loadingTask = getDocument({ data });
  const pdf: any = await loadingTask.promise;

  const pagesText: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str ?? "");
    const text = strings.join(" ");
    pagesText.push(text);
  }

  const fullText = pagesText.join("\n\n--- PAGE BREAK ---\n\n");

  return {
    pagesText,
    fullText,
    numPages: pdf.numPages,
  };
}
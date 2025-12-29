import React, { useState } from "react";
import { extractPdfText } from "@/utils/pdfExtractor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

const ExtractorPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [pagesText, setPagesText] = useState<string[]>([]);
  const [fullText, setFullText] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f || null);
    setPagesText([]);
    setFullText("");
    setStatus(f ? `Arquivo selecionado: ${f.name}` : "");
  };

  const handleExtract = async () => {
    if (!file) {
      setStatus("Selecione um PDF primeiro.");
      return;
    }
    setStatus("Extraindo texto do PDF, aguarde...");
    const { pagesText, fullText } = await extractPdfText(file);
    setPagesText(pagesText);
    setFullText(fullText);
    setStatus(`Extração concluída. Páginas: ${pagesText.length}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center gap-3">
            <FileText className="text-gray-700" />
            <CardTitle>Extrator de PDF (texto)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Input type="file" accept="application/pdf" onChange={onFileChange} />
              <Button onClick={handleExtract}>Extrair texto</Button>
            </div>
            {status && <p className="text-sm text-gray-600">{status}</p>}
            {fullText && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Texto completo</h3>
                <Textarea value={fullText} readOnly className="min-h-[240px]" />
              </div>
            )}
            {pagesText.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Texto por página</h3>
                <div className="space-y-4">
                  {pagesText.map((t, i) => (
                    <div key={i} className="border rounded-md p-3">
                      <div className="text-sm text-gray-500 mb-2">Página {i + 1}</div>
                      <Textarea value={t} readOnly className="min-h-[180px]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!fullText && (
              <p className="text-sm text-gray-500">
                Dica: após extrair, copie o texto e eu comparo com as receitas do app
                para gerar um relatório das diferenças.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtractorPage;
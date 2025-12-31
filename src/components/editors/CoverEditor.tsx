import React from 'react';
import { CoverPageData } from '@/data/initialData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface CoverEditorProps {
    activePage: CoverPageData;
    updatePage: (newData: Partial<CoverPageData>) => void;
}

export const CoverEditor: React.FC<CoverEditorProps> = ({ activePage, updatePage }) => {
    const cs = (activePage as any).coverStyle || {};
    const mergeStyle = (patch: Record<string, any>) => {
      updatePage({ coverStyle: { ...cs, ...patch } as any });
    };

    return (
        <div className="space-y-6">
            {/* Conteúdo */}
            <div className="space-y-3">
              <Label className="text-xs">Título</Label>
              <Input placeholder="Título" value={activePage.title || ''} onChange={e => updatePage({ title: e.target.value })} />
              <Label className="text-xs">Subtítulo</Label>
              <Input placeholder="Subtítulo" value={activePage.subtitle || ''} onChange={e => updatePage({ subtitle: e.target.value })} />
              <Label className="text-xs">Edição</Label>
              <Input placeholder="Edição" value={activePage.edition || ''} onChange={e => updatePage({ edition: e.target.value })} />
              <Label className="text-xs">Autor</Label>
              <Input placeholder="Autor" value={activePage.author || ''} onChange={e => updatePage({ author: e.target.value })} />
            </div>

            {/* Alinhamento e visibilidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Alinhamento</Label>
                <Select value={cs.alignment || 'center'} onValueChange={(v) => mergeStyle({ alignment: v })}>
                  <SelectTrigger><SelectValue placeholder="Alinhamento" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Mostrar ícone</Label>
                <Switch checked={cs.showIcon !== false} onCheckedChange={(val) => mergeStyle({ showIcon: val })} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Mostrar divisor</Label>
                <Switch checked={cs.showDivider !== false} onCheckedChange={(val) => mergeStyle({ showDivider: val })} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Título em itálico</Label>
                <Switch checked={!!cs.titleItalic} onCheckedChange={(val) => mergeStyle({ titleItalic: val })} />
              </div>
            </div>

            {/* Tamanhos e espaçamentos */}
            <div className="space-y-4">
              <Label className="text-xs">Tamanho do Título: {cs.titleFontSize || 50}px</Label>
              <Slider value={[cs.titleFontSize || 50]} onValueChange={(v) => mergeStyle({ titleFontSize: v[0] })} min={24} max={72} step={1} />
              <Label className="text-xs">Tamanho do Subtítulo: {cs.subtitleFontSize || 18}px</Label>
              <Slider value={[cs.subtitleFontSize || 18]} onValueChange={(v) => mergeStyle({ subtitleFontSize: v[0] })} min={12} max={36} step={1} />
              <Label className="text-xs">Espaço entre Título e Subtítulo: {cs.gapTitleSubtitlePx || 8}px</Label>
              <Slider value={[cs.gapTitleSubtitlePx || 8]} onValueChange={(v) => mergeStyle({ gapTitleSubtitlePx: v[0] })} min={0} max={40} step={1} />
              <Label className="text-xs">Largura do divisor: {cs.dividerWidthPx || 48}px</Label>
              <Slider value={[cs.dividerWidthPx || 48]} onValueChange={(v) => mergeStyle({ dividerWidthPx: v[0] })} min={8} max={160} step={2} />
              <Label className="text-xs">Deslocamento vertical do bloco: {cs.contentOffsetY || 0}px</Label>
              <Slider value={[cs.contentOffsetY || 0]} onValueChange={(v) => mergeStyle({ contentOffsetY: v[0] })} min={-80} max={120} step={1} />
            </div>

            {/* Espaçamento entre letras */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Letter spacing (Título): {cs.titleLetterSpacingEm || 0}em</Label>
                <Slider value={[cs.titleLetterSpacingEm || 0]} onValueChange={(v) => mergeStyle({ titleLetterSpacingEm: v[0] })} min={0} max={0.6} step={0.02} />
              </div>
              <div>
                <Label className="text-xs">Letter spacing (Subtítulo): {cs.subtitleLetterSpacingEm || 0.5}em</Label>
                <Slider value={[cs.subtitleLetterSpacingEm || 0.5]} onValueChange={(v) => mergeStyle({ subtitleLetterSpacingEm: v[0] })} min={0} max={0.6} step={0.02} />
              </div>
              <div>
                <Label className="text-xs">Letter spacing (Edição): {cs.editionLetterSpacingEm || 0.4}em</Label>
                <Slider value={[cs.editionLetterSpacingEm || 0.4]} onValueChange={(v) => mergeStyle({ editionLetterSpacingEm: v[0] })} min={0} max={0.6} step={0.02} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Subtítulo em caixa alta</Label>
                <Switch checked={!!cs.subtitleUppercase} onCheckedChange={(val) => mergeStyle({ subtitleUppercase: val })} />
              </div>
            </div>

            {/* Cores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Cor de fundo</Label>
                <Input type="color" value={cs.colors?.background || '#ffffff'} onChange={(e) => mergeStyle({ colors: { ...cs.colors, background: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cor do Título/Subtítulo</Label>
                <Input type="color" value={cs.colors?.title || '#1e3a8a'} onChange={(e) => mergeStyle({ colors: { ...cs.colors, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cor do Divisor</Label>
                <Input type="color" value={cs.colors?.divider || '#64748b'} onChange={(e) => mergeStyle({ colors: { ...cs.colors, divider: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cor do Autor</Label>
                <Input type="color" value={cs.colors?.authorText || '#1e3a8a'} onChange={(e) => mergeStyle({ colors: { ...cs.colors, authorText: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Borda do Badge do Autor</Label>
                <Input type="color" value={cs.colors?.authorBorder || '#1e3a8a'} onChange={(e) => mergeStyle({ colors: { ...cs.colors, authorBorder: e.target.value } })} />
              </div>
            </div>
        </div>
    );
};
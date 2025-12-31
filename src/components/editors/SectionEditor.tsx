import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface SectionEditorProps {
  activePage: SectionPageData;
  updatePage: (newData: Partial<SectionPageData>) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ activePage, updatePage }) => {
  const set = (key: keyof SectionPageData) => (value: any) => updatePage({ [key]: value });

  return (
    <div className="space-y-6">
      {/* Texto com quebras manuais */}
      <div className="space-y-3">
        <Label className="text-xs">Título (use Enter para quebrar linhas)</Label>
        <Textarea
          placeholder="NOME DA SEÇÃO"
          className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none"
          value={activePage.title || ''}
          onChange={(e) => set('title')(e.target.value)}
        />
        <Label className="text-xs">Subtítulo (use Enter para quebrar linhas)</Label>
        <Textarea
          placeholder="Subtítulo Manuscrito"
          className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none"
          value={activePage.subtitle || ''}
          onChange={(e) => set('subtitle')(e.target.value)}
        />
      </div>

      {/* Alinhamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Alinhamento do título</Label>
          <Select
            value={String(activePage.titleAlign || 'center')}
            onValueChange={(v) => set('titleAlign')(v as any)}
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Alinhamento do subtítulo</Label>
          <Select
            value={String(activePage.subtitleAlign || 'center')}
            onValueChange={(v) => set('subtitleAlign')(v as any)}
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posicionamento */}
      <div className="space-y-4">
        <Label className="text-xs">Posição do título (X/Y)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <Slider value={[Number(activePage.titleOffsetX || 0)]} min={-200} max={200} step={1} onValueChange={(v) => set('titleOffsetX')(v[0])} />
            <div className="text-xs text-muted-foreground">X: {activePage.titleOffsetX || 0}px</div>
          </div>
          <div className="space-y-2">
            <Slider value={[Number(activePage.titleOffsetY || 0)]} min={-200} max={200} step={1} onValueChange={(v) => set('titleOffsetY')(v[0])} />
            <div className="text-xs text-muted-foreground">Y: {activePage.titleOffsetY || 0}px</div>
          </div>
        </div>

        <Label className="text-xs">Posição do subtítulo (X/Y)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <Slider value={[Number(activePage.subtitleOffsetX || 0)]} min={-200} max={200} step={1} onValueChange={(v) => set('subtitleOffsetX')(v[0])} />
            <div className="text-xs text-muted-foreground">X: {activePage.subtitleOffsetX || 0}px</div>
          </div>
          <div className="space-y-2">
            <Slider value={[Number(activePage.subtitleOffsetY || 0)]} min={-200} max={200} step={1} onValueChange={(v) => set('subtitleOffsetY')(v[0])} />
            <div className="text-xs text-muted-foreground">Y: {activePage.subtitleOffsetY || 0}px</div>
          </div>
        </div>
      </div>

      {/* Tipografia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs">Tamanho do título</Label>
          <Slider value={[Number(activePage.titleFontSize || 34)]} min={24} max={72} step={1} onValueChange={(v) => set('titleFontSize')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.titleFontSize || 34}px</div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Tamanho do subtítulo</Label>
          <Slider value={[Number(activePage.subtitleFontSize || 30)]} min={18} max={60} step={1} onValueChange={(v) => set('subtitleFontSize')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.subtitleFontSize || 30}px</div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Espaçamento do título (tracking)</Label>
          <Slider value={[Number(activePage.titleTracking ?? 0.12)]} min={0} max={0.4} step={0.01} onValueChange={(v) => set('titleTracking')(Number(v[0]))} />
          <div className="text-xs text-muted-foreground">{(activePage.titleTracking ?? 0.12).toFixed(2)} em</div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Largura máx. do título</Label>
          <Slider value={[Number(activePage.titleMaxWidthPct || 88)]} min={50} max={100} step={1} onValueChange={(v) => set('titleMaxWidthPct')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.titleMaxWidthPct || 88}%</div>
        </div>
      </div>

      {/* Efeitos e transformações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <Label className="text-xs">Rotação do subtítulo</Label>
          <Slider value={[Number(activePage.subtitleRotate || 0)]} min={-20} max={20} step={1} onValueChange={(v) => set('subtitleRotate')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.subtitleRotate || 0}°</div>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch checked={Boolean(activePage.titleUppercase)} onCheckedChange={(val) => set('titleUppercase')(val)} />
          <Label className="text-xs">Título em CAIXA ALTA</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={Boolean(activePage.subtitleItalic)} onCheckedChange={(val) => set('subtitleItalic')(val)} />
          <Label className="text-xs">Subtítulo em itálico</Label>
        </div>
      </div>

      {/* Ajuste do quadro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs">Offset horizontal do quadro</Label>
          <Slider value={[Number(activePage.frameOffsetX || 0)]} min={-40} max={40} step={1} onValueChange={(v) => set('frameOffsetX')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.frameOffsetX || 0}px</div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Offset vertical do quadro</Label>
          <Slider value={[Number(activePage.frameOffsetY || 0)]} min={-40} max={40} step={1} onValueChange={(v) => set('frameOffsetY')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.frameOffsetY || 0}px</div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs">Padding interno do quadro</Label>
          <Slider value={[Number(activePage.contentPadding || 40)]} min={16} max={80} step={1} onValueChange={(v) => set('contentPadding')(v[0])} />
          <div className="text-xs text-muted-foreground">{activePage.contentPadding || 40}px</div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const presets = {
    classic: {
      titleAlign: 'center',
      subtitleAlign: 'center',
      titleOffsetX: 0,
      titleOffsetY: 0,
      subtitleOffsetX: 0,
      subtitleOffsetY: 6,
      titleFontSize: 34,
      subtitleFontSize: 30,
      subtitleRotate: -2,
      titleTracking: 0.12,
      titleUppercase: true,
      titleMaxWidthPct: 84,
      frameOffsetX: -6,
      frameOffsetY: 0,
      contentPadding: 44,
      subtitleItalic: true,
      roseEnabled: true,
      roseGlowIntensity: 30,
      roseBadge: 'heart',
      roseMentionEnabled: true,
    },
    elegant: {
      titleAlign: 'center',
      subtitleAlign: 'center',
      titleOffsetX: 0,
      titleOffsetY: -4,
      subtitleOffsetX: 0,
      subtitleOffsetY: 8,
      titleFontSize: 36,
      subtitleFontSize: 28,
      subtitleRotate: -1,
      titleTracking: 0.15,
      titleUppercase: true,
      titleMaxWidthPct: 80,
      frameOffsetX: -4,
      frameOffsetY: -2,
      contentPadding: 48,
      subtitleItalic: true,
      roseEnabled: true,
      roseGlowIntensity: 25,
      roseBadge: 'heart',
      roseMentionEnabled: true,
    },
    modern: {
      titleAlign: 'center',
      subtitleAlign: 'center',
      titleOffsetX: 0,
      titleOffsetY: 2,
      subtitleOffsetX: 0,
      subtitleOffsetY: 4,
      titleFontSize: 32,
      subtitleFontSize: 26,
      subtitleRotate: 0,
      titleTracking: 0.08,
      titleUppercase: true,
      titleMaxWidthPct: 90,
      frameOffsetX: 0,
      frameOffsetY: 0,
      contentPadding: 40,
      subtitleItalic: false,
      roseEnabled: false,
      roseGlowIntensity: 0,
      roseBadge: 'none',
      roseMentionEnabled: false,
    },
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    updatePage(presets[presetName]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Estilo da Capa</Label>
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={() => applyPreset('classic')}
            className="justify-start h-auto p-4 text-left"
          >
            <div>
              <div className="font-medium">Clássico Rosé</div>
              <div className="text-xs text-muted-foreground">Estilo tradicional com coração e detalhes rosé</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => applyPreset('elegant')}
            className="justify-start h-auto p-4 text-left"
          >
            <div>
              <div className="font-medium">Elegante</div>
              <div className="text-xs text-muted-foreground">Mais refinado com tipografia destacada</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => applyPreset('modern')}
            className="justify-start h-auto p-4 text-left"
          >
            <div>
              <div className="font-medium">Moderno</div>
              <div className="text-xs text-muted-foreground">Limpo e minimalista sem detalhes rosé</div>
            </div>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Texto da Capa</Label>
        <div className="space-y-3">
          <input
            placeholder="Título da Seção"
            className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-navy focus:border-accent outline-none"
            value={activePage.title || ''}
            onChange={(e) => updatePage({ title: e.target.value })}
          />
          <input
            placeholder="Subtítulo"
            className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-navy focus:border-accent outline-none"
            value={activePage.subtitle || ''}
            onChange={(e) => updatePage({ subtitle: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Opções Rápidas</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Ativar tema rosé</Label>
            <Switch 
              checked={Boolean(activePage.roseEnabled)} 
              onCheckedChange={(val) => updatePage({ roseEnabled: val })} 
            />
          </div>
          
          {activePage.roseEnabled && (
            <div className="space-y-2">
              <Label className="text-xs">Tipo de emblema</Label>
              <Select
                value={String(activePage.roseBadge || 'heart')}
                onValueChange={(v) => updatePage({ roseBadge: v as any })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heart">Coração</SelectItem>
                  <SelectItem value="sparkles">Brilhinhos</SelectItem>
                  <SelectItem value="none">Sem emblema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label className="text-xs">Mostrar menção à capa</Label>
            <Switch 
              checked={Boolean(activePage.roseMentionEnabled)} 
              onCheckedChange={(val) => updatePage({ roseMentionEnabled: val })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
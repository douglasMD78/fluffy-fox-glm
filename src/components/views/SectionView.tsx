import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { CoverPageData } from '@/data/initialData';
import { Heart } from 'lucide-react';

interface SectionViewProps {
  data: SectionPageData;
  coverData?: CoverPageData;
}

export const SectionView: React.FC<SectionViewProps> = ({ data, coverData }) => {
  const {
    title,
    subtitle,
    titleAlign = 'center',
    subtitleAlign = 'center',
    titleOffsetX = 0,
    titleOffsetY = 0,
    subtitleOffsetX = 0,
    subtitleOffsetY = 0,
    titleFontSize = 34,
    subtitleFontSize = 30,
    subtitleRotate = -1,
    titleTracking = 0.12,
    titleUppercase = true,
    titleMaxWidthPct = 88,
    frameOffsetX = -8,
    frameOffsetY = 0,
    contentPadding = 40,
    subtitleItalic = false,
  } = data;

  const textAlignStyle = (align: string): React.CSSProperties => {
    if (align === 'left') return { textAlign: 'left' };
    if (align === 'right') return { textAlign: 'right' };
    return { textAlign: 'center' };
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/60 h-full relative font-sans">
      {/* Glow rosado sutil no fundo para toque feminino */}
      <div className="absolute -top-10 -left-10 w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-[35%] h-[35%] bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Background decorativo sutil mantido */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Container principal com conteúdo centralizado dentro do quadro */}
      <div
        className="relative z-10 border-4 border-double border-cream rounded-[2rem] w-[80%] max-w-[520px] h-[78%] m-4 shadow-lg overflow-visible grid grid-rows-[auto_1fr_auto] justify-items-center box-border"
        style={{ left: `${frameOffsetX}px`, top: `${frameOffsetY}px`, padding: `${contentPadding}px` }}
      >
        {/* Menção ao conteúdo da capa (título, subtítulo, edição e autor) */}
        {coverData && (
          <div className="absolute top-3 right-4 flex items-center gap-2 text-rose-700/70">
            <Heart size={12} className="text-pink-500" />
            <span className="text-[9px] tracking-[0.25em] uppercase whitespace-nowrap">
              {coverData.title}{coverData.subtitle ? ` ${coverData.subtitle}` : ''} • {coverData.edition} • {coverData.author}
            </span>
          </div>
        )}

        {/* Emblema rosado delicado no canto */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-pink-100/70 border border-pink-300/60 rounded-full shadow-sm flex items-center justify-center">
          <Heart className="text-pink-500" size={14} />
        </div>

        {/* Borda interna suave em rosa para delicadeza */}
        <div className="absolute inset-3 rounded-[1.75rem] border border-pink-200/40 pointer-events-none"></div>

        {/* Header elegante */}
        <div className="mb-4 row-start-1">
          <span className="inline-block text-[10px] font-light text-accent/40 uppercase tracking-[0.3em] mb-3">
            Capítulo de Receitas
          </span>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
          </div>
        </div>

        {/* Bloco central com controles manuais */}
        <div className="row-start-2 relative w-full">
          {/* Título com controles */}
          <h1
            className="font-playfair font-light text-navy mb-4 leading-tight break-normal whitespace-pre select-none"
            style={{
              ...textAlignStyle(titleAlign),
              fontSize: `${titleFontSize}px`,
              letterSpacing: `${titleTracking}em`,
              textTransform: titleUppercase ? 'uppercase' : 'none',
              maxWidth: `${titleMaxWidthPct}%`,
              transform: `translate(${titleOffsetX}px, ${titleOffsetY}px)`,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {title}
          </h1>

          {/* Subtítulo com posicionamento manual */}
          <div
            className="relative select-none"
            style={{
              transform: `translate(${subtitleOffsetX}px, ${subtitleOffsetY}px)`,
              ...textAlignStyle(subtitleAlign),
            }}
          >
            <p
              className={`font-hand ${subtitleItalic ? 'italic' : ''} mb-6 mx-auto leading-tight break-normal whitespace-pre`}
              style={{
                fontSize: `${subtitleFontSize}px`,
                color: 'var(--color-accent, #a67c52)',
                transform: `rotate(${subtitleRotate}deg)`,
                maxWidth: '80%',
              }}
            >
              {subtitle}
            </p>
            {/* Elemento decorativo sutil abaixo do subtítulo */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
                <span className="w-1 h-1 bg-accent/40 rounded-full"></span>
                <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer elegante dentro do quadro */}
        <div className="row-start-3 mt-6 pt-4 border-t border-accent/10 w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
              Receitas selecionadas
            </span>
            <div className="w-1 h-1 bg-accent/30 rounded-full"></div>
            <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
              Para seu dia a dia
            </span>
          </div>
        </div>
      </div>

      {/* Elementos decorativos fora do quadro */}
      <div className="absolute top-8 right-8 opacity-8">
        <div className="w-12 h-12 border-2 border-accent/20 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-accent/10 rounded-full"></div>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 opacity-8">
        <div className="w-10 h-10 border-2 border-accent/15 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-accent/8 rounded-full"></div>
        </div>
      </div>

      {/* Elementos flutuantes sutis */}
      <div className="absolute top-1/4 left-1/4 opacity-3">
        <div className="w-6 h-6 border border-accent/10 rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-3">
        <div className="w-4 h-4 border border-accent/8 rounded-full"></div>
      </div>
    </div>
  );
};
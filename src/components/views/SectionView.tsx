import React from 'react';
import { SectionPageData } from '@/data/initialData';

interface SectionViewProps {
  data: SectionPageData;
}

export const SectionView: React.FC<SectionViewProps> = ({ data }) => {
  const {
    title,
    subtitle,
    // defaults seguros
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
      {/* Background decorativo sutil mantido */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Container principal com conteúdo centralizado dentro do quadro */}
      <div
        className="relative z-10 border-4 border-double border-cream rounded-[2rem] w-[80%] max-w-[520px] h-[78%] m-4 shadow-lg overflow-hidden grid grid-rows-[auto_1fr_auto] justify-items-center box-border"
        style={{ left: `${frameOffsetX}px`, top: `${frameOffsetY}px`, padding: `${contentPadding}px` }}
      >
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
          {/* Título */}
          <h1
            className="font-playfair font-light text-navy uppercase mb-4 leading-tight break-words mx-auto select-none"
            style={{
              ...textAlignStyle(titleAlign),
              fontSize: `${titleFontSize}px`,
              letterSpacing: `${titleTracking}em`,
              textTransform: titleUppercase ? 'uppercase' : 'none',
              maxWidth: `${titleMaxWidthPct}%`,
              transform: `translate(${titleOffsetX}px, ${titleOffsetY}px)`,
              textWrap: 'balance',
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
              className={`font-hand ${subtitleItalic ? 'italic' : ''} mb-6 mx-auto leading-tight`}
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
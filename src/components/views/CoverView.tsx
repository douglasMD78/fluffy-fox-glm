import React from 'react';
import { CoverPageData } from '@/data/initialData';
import { IconBase } from '@/components/icons';

interface CoverViewProps {
    data: CoverPageData;
}

export const CoverView: React.FC<CoverViewProps> = ({ data }) => {
    const cs = (data as any).coverStyle || {};
    const alignClass =
      cs.alignment === 'left'
        ? 'items-start text-left'
        : cs.alignment === 'right'
        ? 'items-end text-right'
        : 'items-center text-center';
    const bgColor = cs.colors?.background || 'var(--color-bg)';
    const titleColor = cs.colors?.title || 'var(--color-cover-title-text)';
    const dividerColor = cs.colors?.divider || 'var(--color-cover-divider-bg)';
    const authorTextColor = cs.colors?.authorText || 'var(--color-cover-title-text)';
    const authorBorderColor = cs.colors?.authorBorder || 'var(--color-cover-title-text)';
    const editionLS = typeof cs.editionLetterSpacingEm === 'number' ? `${cs.editionLetterSpacingEm}em` : undefined;
    const titleLS = typeof cs.titleLetterSpacingEm === 'number' ? `${cs.titleLetterSpacingEm}em` : undefined;
    const subtitleLS = typeof cs.subtitleLetterSpacingEm === 'number' ? `${cs.subtitleLetterSpacingEm}em` : undefined;
    const subtitleText = cs.subtitleUppercase ? String(data.subtitle || '').toUpperCase() : data.subtitle;

    return (
        <div className={`flex-1 flex flex-col justify-between py-10 text-navy bg-cream h-full relative overflow-hidden font-sans print:bg-cream ${alignClass}`} style={{ backgroundColor: bgColor }}>
            <div className="text-center pt-12 relative z-10 opacity-80">
                {cs.showIcon !== false && (
                  <div className={`text-rose-900 mb-2 flex ${cs.alignment === 'left' ? 'justify-start' : cs.alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
                    <IconBase size={32} className="fill-current text-rose-900"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></IconBase>
                  </div>
                )}
                <p className="text-rose-900 text-xs font-bold uppercase" style={{ letterSpacing: editionLS }}>{data.edition}</p>
            </div>

            <div className="relative z-10 px-4" style={{ transform: `translateY(${cs.contentOffsetY || 0}px)` }}>
                <h1
                  className={`font-playfair leading-none mb-4 ${cs.titleItalic ? 'italic' : ''}`}
                  style={{ color: titleColor, fontSize: `${cs.titleFontSize || 50}px`, letterSpacing: titleLS }}
                >
                  {data.title}
                </h1>
                {cs.showDivider !== false && (
                  <div
                    className={`${cs.alignment === 'left' ? '' : cs.alignment === 'right' ? 'ml-auto' : 'mx-auto'} h-px opacity-50 mb-2`}
                    style={{ backgroundColor: dividerColor, width: `${cs.dividerWidthPx || 48}px` }}
                  />
                )}
                <h2
                  className="font-lato font-light scale-90 leading-none"
                  style={{ color: titleColor, fontSize: `${cs.subtitleFontSize || 18}px`, letterSpacing: subtitleLS, marginTop: `${cs.gapTitleSubtitlePx || 8}px`, textTransform: cs.subtitleUppercase ? 'uppercase' as any : 'none' }}
                >
                  {subtitleText}
                </h2>
            </div>

            <div className={`px-6 py-3 rounded-full bg-white/40 backdrop-blur-sm mb-12 shadow-sm relative z-10 print:bg-white border border-opacity-20 ${cs.alignment === 'left' ? 'self-start' : cs.alignment === 'right' ? 'self-end' : 'self-center'}`} style={{ borderColor: authorBorderColor }}>
                <span className="text-xs font-medium uppercase" style={{ color: authorTextColor, letterSpacing: subtitleLS }}>{data.author}</span>
            </div>
        </div>
    );
};
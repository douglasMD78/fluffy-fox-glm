import { TEMPLATES } from '@/lib/constants';

interface Theme {
    bg: string;
    text: string;
    accent: string;
    surface?: string; 
}

export const getPageBackgroundColor = (pageType: TEMPLATES, theme: Theme): string => {
    if (pageType === TEMPLATES.COVER) return theme.bg;
    if (pageType === TEMPLATES.SHOPPING) return theme.surface || '#F9F9F9'; 
    if (pageType === TEMPLATES.LEGEND) return theme.bg; 
    return 'white';
};
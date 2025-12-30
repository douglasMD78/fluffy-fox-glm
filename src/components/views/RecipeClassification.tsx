import React from 'react';
import { 
  Coffee, 
  Cookie, 
  Sandwich, 
  Soup, 
  Cake, 
  Yogurt,
  ChefHat,
  Salad
} from 'lucide-react';
import { getTagStyle } from '@/lib/constants';

interface RecipeClassificationProps {
  tags: string;
  compact?: boolean;
}

// Mapeamento de tags para ícones do Lucide
const TAG_ICONS = {
  'CM': { icon: Coffee, label: 'Café da Manhã' },
  'LM': { icon: Cookie, label: 'Lanche da Manhã' },
  'A': { icon: Sandwich, label: 'Almoço' },
  'LT': { icon: Cookie, label: 'Lanche da Tarde' },
  'J': { icon: ChefHat, label: 'Jantar' },
  'S': { icon: Cake, label: 'Sobremesa' },
  'AC': { icon: Salad, label: 'Acompanhamento' },
  'B': { icon: Yogurt, label: 'Base' }
};

export const RecipeClassification: React.FC<RecipeClassificationProps> = ({ 
  tags, 
  compact = false 
}) => {
  if (!tags) return null;
  
  const codes = tags.split(',').map(c => c.trim().filter(Boolean);
  
  if (codes.length === 0) return null;

  const iconSize = compact ? 12 : 16;
  const containerClass = compact 
    ? "flex gap-1 items-center" 
    : "flex flex-wrap gap-2 items-center";

  return (
    <div className={containerClass}>
      {codes.map((code) => {
        const tagStyle = getTagStyle(code);
        const iconData = TAG_ICONS[code as keyof typeof TAG_ICONS];
        
        if (!iconData) return null;
        
        const IconComponent = iconData.icon;
        
        return (
          <div
            key={code}
            className={`${tagStyle.color} ${tagStyle.text} flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-all hover:scale-105`}
            title={iconData.label}
          >
            <IconComponent size={iconSize} />
            {!compact && <span className="text-[10px] font-bold uppercase">{code}</span>}
          </div>
        );
      })}
    </div>
  );
};
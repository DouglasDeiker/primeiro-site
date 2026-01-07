
import React from 'react';
import { Home, Grid, Heart, PlusCircle, ShoppingBag } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearchClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home, action: () => onNavigate('home') },
    { id: 'categories', label: 'Busca', icon: Grid, action: () => onNavigate('categories') },
    { id: 'sell', label: 'Anunciar', icon: PlusCircle, action: () => onNavigate('sell'), highlight: true },
    { id: 'favorites', label: 'Salvos', icon: Heart, action: () => onNavigate('favorites') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-2 pb-safe z-50 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.06)] h-[72px]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full relative ${
              isActive ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {/* Indicador de Estado Ativo (Pílula de Fundo) */}
            {isActive && !item.highlight && (
              <span className="absolute inset-0 m-auto w-12 h-12 bg-brand-lightPurple/50 rounded-2xl -z-10 animate-in fade-in zoom-in duration-300"></span>
            )}

            {/* Ícone com escala e feedback visual */}
            <div className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''} ${item.highlight ? 'text-brand-orange' : ''}`}>
              <Icon 
                className={`w-6 h-6 ${isActive && !item.highlight ? 'fill-brand-purple/10' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Pontinho ou traço superior para o estado ativo */}
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full"></span>
              )}
            </div>

            {/* Label refinada */}
            <span className={`text-[10px] font-black uppercase tracking-tighter transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

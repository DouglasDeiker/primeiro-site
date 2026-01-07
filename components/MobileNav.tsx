
import React from 'react';
import { Home, Grid, Heart } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearchClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home, action: () => onNavigate('home') },
    { id: 'categories', label: 'Busca', icon: Grid, action: () => onNavigate('categories') },
    { id: 'favorites', label: 'Salvos', icon: Heart, action: () => onNavigate('favorites') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-gray-100 px-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-stretch h-20 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center transition-all duration-300 flex-1 relative ${
                isActive ? 'text-brand-purple' : 'text-gray-400'
              }`}
            >
              {/* Indicador de Linha Superior (Opcional, mas ajuda no foco) */}
              <div className={`absolute top-0 w-12 h-1 rounded-b-full transition-all duration-500 ${
                isActive ? 'bg-brand-purple opacity-100 scale-x-100' : 'bg-transparent opacity-0 scale-x-0'
              }`} />

              <div className="relative py-1">
                {/* Pílula de Fundo Dinâmica */}
                <div className={`absolute inset-0 m-auto w-14 h-10 rounded-2xl transition-all duration-500 -z-10 ${
                  isActive 
                    ? 'bg-brand-lightPurple/60 opacity-100 scale-100 shadow-sm' 
                    : 'bg-transparent opacity-0 scale-75'
                }`} />

                {/* Ícone com escala e feedback visual */}
                <div className={`relative transition-all duration-300 transform ${isActive ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
                  <Icon 
                    className={`transition-all duration-300 ${isActive ? 'w-7 h-7 fill-brand-purple/10' : 'w-6 h-6'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Ponto de destaque no estado ativo */}
                  <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-brand-orange scale-100' : 'bg-transparent scale-0'
                  }`} />
                </div>
              </div>

              {/* Label refinada e legível */}
              <span className={`text-[11px] font-black uppercase tracking-widest mt-1.5 transition-all duration-300 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

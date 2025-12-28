
import React from 'react';
import { Home, Grid, Tag, Heart, PlusCircle, User } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearchClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate, onSearchClick }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home, action: () => onNavigate('home') },
    { id: 'categories', label: 'Busca', icon: Grid, action: () => onNavigate('categories') },
    { id: 'favorites', label: 'Salvos', icon: Heart, action: () => onNavigate('favorites') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-50 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${
              isActive ? 'text-brand-purple' : 'text-gray-400'
            }`}
          >
            <div className={`transition-all ${isActive ? 'scale-110' : ''}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'fill-brand-purple opacity-20' : ''}`} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

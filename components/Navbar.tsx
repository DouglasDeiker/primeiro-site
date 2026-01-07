
import React from 'react';
import { Search, ShoppingBag, LogOut, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearchClick: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  onSearchClick,
  user,
  onLogout
}) => {
  const getLinkClass = (pageName: string) => {
    const isActive = currentPage === pageName;
    return `cursor-pointer font-bold transition py-2 border-b-2 text-sm uppercase tracking-wider ${
      isActive 
        ? 'text-brand-purple border-brand-orange' 
        : 'text-gray-600 hover:text-brand-purple border-transparent'
    }`;
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5511999812223', '_blank');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group gap-2 md:gap-3" 
            onClick={() => onNavigate('home')}
          >
            {/* Logo Icon Container */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-purple rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-brand-purple via-brand-purple to-brand-orange p-2.5 rounded-2xl shadow-[0_4px_15px_rgba(124,58,237,0.3)] transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>

            {/* Logo Text */}
            <div className="flex flex-col md:flex-row md:items-baseline leading-none md:leading-normal">
              <span className="font-black text-xl md:text-2xl text-brand-purple tracking-tighter transition-colors">Barganha</span>
              <span className="font-black text-xl md:text-2xl text-brand-orange tracking-tighter md:ml-1 transition-colors">Mogi</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <button onClick={() => onNavigate('home')} className={getLinkClass('home')}>Início</button>
            <button onClick={() => onNavigate('categories')} className={getLinkClass('categories')}>Categorias</button>
            <button onClick={() => onNavigate('favorites')} className={getLinkClass('favorites')}>Favoritos</button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button 
              onClick={handleWhatsAppClick}
              className="p-2.5 text-gray-400 hover:text-green-500 transition-all active:scale-90"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <button className="p-2.5 text-gray-400 hover:text-brand-purple transition-colors hidden md:block" onClick={onSearchClick}>
              <Search className="h-5 w-5" />
            </button>

            {user && (
              <div className="flex items-center gap-3 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-gray-100">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Visitante</p>
                </div>
                <button onClick={onLogout} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm border border-gray-100" title="Sair">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

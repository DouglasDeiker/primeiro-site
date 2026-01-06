
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
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group gap-2" 
            onClick={() => onNavigate('home')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-purple rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-brand-purple to-brand-orange p-2 rounded-xl shadow-md transform group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-row items-baseline">
              <span className="font-black text-2xl text-brand-purple tracking-tighter">Barganha</span>
              <span className="font-black text-2xl text-brand-orange tracking-tighter ml-1">Mogi</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onNavigate('home')} className={getLinkClass('home')}>Início</button>
            <button onClick={() => onNavigate('categories')} className={getLinkClass('categories')}>Categorias</button>
            <button onClick={() => onNavigate('favorites')} className={getLinkClass('favorites')}>Favoritos</button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
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
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-100">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Vendedor</p>
                </div>
                <button onClick={onLogout} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all" title="Sair">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

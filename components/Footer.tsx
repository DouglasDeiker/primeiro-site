
import React from 'react';
import { Facebook, Instagram, ShoppingBag } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Sobre */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-gradient-to-br from-brand-purple to-brand-orange p-1.5 rounded-lg shadow-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-row items-baseline">
                <span className="font-black text-xl text-brand-purple tracking-tighter">Barganha</span>
                <span className="font-black text-xl text-brand-orange tracking-tighter ml-1">Mogi</span>
              </div>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              O marketplace favorito de Mogi das Cruzes. Conectamos você às melhores ofertas de itens novos e seminovos com segurança e praticidade.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Navegação</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-brand-purple transition-colors font-semibold">Início</button></li>
              <li><button onClick={() => onNavigate('offers')} className="text-gray-500 hover:text-brand-purple transition-colors font-semibold">Ofertas</button></li>
              <li><button onClick={() => onNavigate('help')} className="text-gray-500 hover:text-brand-purple transition-colors font-semibold">Ajuda</button></li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-brand-purple hover:text-white transition-all shadow-sm">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-brand-orange hover:text-white transition-all shadow-sm">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            &copy; 2026 Barganha Mogi. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-gray-400 text-sm font-bold">
            <span>Site desenvolvido por</span>
            <span className="text-brand-purple">Douglas Deiker</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { Hero } from '../components/Hero';
import { Search, MessageSquare, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProductDetails?: (product: Product) => void;
  heroImages?: string[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, heroImages }) => {
  return (
    <>
      <div onClick={() => onNavigate('offers')} className="cursor-pointer">
         <Hero images={heroImages} />
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16">
             <span className="text-brand-orange font-bold tracking-wider uppercase text-sm">Prático e Direto</span>
             <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Como comprar aqui?</h2>
             <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">Simplicidade e segurança em cada item selecionado.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-brand-purple mb-6 shadow-xl shadow-brand-purple/10 border border-brand-lightPurple transform transition hover:scale-110 duration-300">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Explore o Catálogo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Navegue por nossas ofertas exclusivas de itens novos e seminovos de alta qualidade.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-brand-orange mb-6 shadow-xl shadow-brand-orange/10 border border-brand-lightOrange transform transition hover:scale-110 duration-300">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Combine via WhatsApp</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gostou de algo? Clique em negociar e fale diretamente comigo. Tiro suas dúvidas na hora.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-green-600 mb-6 shadow-xl shadow-green-500/10 border border-green-100 transform transition hover:scale-110 duration-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Retire seu Item</h3>
                <p className="text-gray-600 leading-relaxed">
                  Combinamos o melhor local para retirada em Mogi das Cruzes ou agendamos sua entrega.
                </p>
              </div>
           </div>
           
           <div className="mt-16 text-center">
             <button 
               onClick={() => onNavigate('offers')}
               className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/30 transition-all hover:scale-105"
             >
               Ver Todos os Itens
             </button>
           </div>
        </div>
      </section>
    </>
  );
};

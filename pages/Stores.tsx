import React from 'react';
import { STORES } from '../constants';
import { MapPin, Star } from 'lucide-react';

interface StoresProps {
    onNavigateToStore: (storeName: string) => void;
}

export const Stores: React.FC<StoresProps> = ({ onNavigateToStore }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-brand-darkPurple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white">Lojas Parceiras</h1>
            <p className="mt-4 text-xl text-brand-lightPurple">Conheça quem faz o comércio de Mogi acontecer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STORES.map(store => (
            <div key={store.id} className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-brand-orange/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/10 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors">{store.name}</h3>
                        <div className="bg-brand-orange text-white font-bold px-3 py-1 rounded-lg text-sm shadow-lg flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current" /> {store.rating}
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 mb-6 bg-black/20 inline-block px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4 mr-1 text-brand-orange" />
                        {store.location}
                    </div>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed border-l-2 border-brand-purple/50 pl-4">
                        "{store.description}"
                    </p>
                </div>
                
                <button 
                    onClick={() => onNavigateToStore(store.name)} 
                    className="w-full py-4 rounded-xl bg-white/5 hover:bg-brand-orange text-white font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-transparent"
                >
                Ver Produtos da Loja
                </button>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};
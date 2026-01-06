
import React from 'react';
import { 
  Armchair, Laptop, Shirt, Dumbbell, Palette, Music, 
  Car, Baby, Book, ShoppingBag, ArrowRight, Home, 
  Sparkles, Wrench, History, Microwave, Box 
} from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory, categories }) => {
  // Helper para ícones
  const getCategoryIcon = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('móvel') || normalized.includes('casa')) return <Armchair className="w-8 h-8" />;
    if (normalized.includes('eletrônico') || normalized.includes('tech')) return <Laptop className="w-8 h-8" />;
    if (normalized.includes('eletrodom')) return <Microwave className="w-8 h-8" />;
    if (normalized.includes('ferramenta')) return <Wrench className="w-8 h-8" />;
    if (normalized.includes('antiguidade') || normalized.includes('velho')) return <History className="w-8 h-8" />;
    if (normalized.includes('roupa') || normalized.includes('moda')) return <Shirt className="w-8 h-8" />;
    if (normalized.includes('esporte') || normalized.includes('fitness')) return <Dumbbell className="w-8 h-8" />;
    if (normalized.includes('decora') || normalized.includes('arte')) return <Palette className="w-8 h-8" />;
    if (normalized.includes('instru') || normalized.includes('música')) return <Music className="w-8 h-8" />;
    if (normalized.includes('auto') || normalized.includes('carro')) return <Car className="w-8 h-8" />;
    if (normalized.includes('infantil') || normalized.includes('bebê')) return <Baby className="w-8 h-8" />;
    if (normalized.includes('livro') || normalized.includes('leitura')) return <Book className="w-8 h-8" />;
    if (normalized.includes('variado') || normalized.includes('outros')) return <Box className="w-8 h-8" />;
    return <ShoppingBag className="w-8 h-8" />;
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-lightPurple text-brand-purple rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> Exploração
          </div>
          <h2 className="text-4xl font-black text-gray-900 leading-tight">Navegue por Categorias</h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">Tudo o que você procura em Mogi das Cruzes, organizado para facilitar sua busca.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
           {/* Card Especial: Todos */}
           <button 
              onClick={() => onSelectCategory('Todos')}
              className="group relative bg-brand-purple p-8 rounded-[2rem] shadow-xl shadow-brand-purple/20 hover:shadow-2xl hover:shadow-brand-purple/30 transition-all duration-500 overflow-hidden text-left flex flex-col justify-between h-56 transform hover:-translate-y-2"
           >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
             <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-white backdrop-blur-md group-hover:scale-110 transition-transform">
               <Home className="w-8 h-8" />
             </div>
             <div className="relative z-10 flex justify-between items-end">
               <div>
                 <p className="text-brand-lightPurple text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Catálogo Completo</p>
                 <span className="font-black text-2xl text-white leading-none">Ver Tudo</span>
               </div>
               <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
             </div>
           </button>

           {/* Cards Dinâmicos */}
           {categories.map((cat) => (
             <button 
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-brand-purple/10 border border-gray-100 transition-all duration-500 group text-left flex flex-col justify-between h-56 transform hover:-translate-y-2"
             >
               <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-brand-orange group-hover:text-white group-hover:rotate-6 transition-all shadow-inner">
                 {getCategoryIcon(cat)}
               </div>
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-brand-orange transition-colors">Departamento</p>
                   <span className="font-black text-2xl text-gray-900 group-hover:text-brand-purple transition-colors leading-none">{cat}</span>
                 </div>
                 <ArrowRight className="w-6 h-6 text-gray-200 group-hover:text-brand-orange group-hover:translate-x-2 transition-all" />
               </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

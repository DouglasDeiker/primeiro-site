
import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { 
  Search, MessageSquare, ShoppingBag, Sparkles, ArrowRight,
  Armchair, Laptop, Microwave, Wrench, History, Shirt, 
  Dumbbell, Palette, Music, Car, Baby, Book, Box
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProductDetails: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  favorites: number[];
  heroImages?: string[];
  products: Product[];
  categories: string[];
}

export const Home: React.FC<HomeProps> = ({ 
  onNavigate, 
  onViewProductDetails, 
  onToggleFavorite,
  favorites,
  heroImages, 
  products, 
  categories 
}) => {
  
  const getCategoryIcon = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('móvel') || normalized.includes('casa')) return <Armchair className="w-5 h-5" />;
    if (normalized.includes('eletrônico') || normalized.includes('tech')) return <Laptop className="w-5 h-5" />;
    if (normalized.includes('eletrodom')) return <Microwave className="w-5 h-5" />;
    if (normalized.includes('ferramenta')) return <Wrench className="w-5 h-5" />;
    if (normalized.includes('antiguidade')) return <History className="w-5 h-5" />;
    if (normalized.includes('roupa') || normalized.includes('moda')) return <Shirt className="w-5 h-5" />;
    if (normalized.includes('esporte') || normalized.includes('fitness')) return <Dumbbell className="w-5 h-5" />;
    if (normalized.includes('decora') || normalized.includes('arte')) return <Palette className="w-5 h-5" />;
    if (normalized.includes('instru') || normalized.includes('música')) return <Music className="w-5 h-5" />;
    if (normalized.includes('auto') || normalized.includes('carro')) return <Car className="w-5 h-5" />;
    if (normalized.includes('infantil') || normalized.includes('bebê')) return <Baby className="w-5 h-5" />;
    if (normalized.includes('livro') || normalized.includes('leitura')) return <Book className="w-5 h-5" />;
    if (normalized.includes('variado') || normalized.includes('outros')) return <Box className="w-5 h-5" />;
    return <ShoppingBag className="w-5 h-5" />;
  };

  const handleNegotiateClick = (product: Product) => {
    const message = `Olá! Vi o produto *${product.title}* no site *Barganha Mogi* e gostaria de negociar.`;
    const phoneNumber = "5511999812223"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-0">
      <Hero images={heroImages} />

      {/* Seção de Categorias - 2x2 no Mobile */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-orange" /> Explorar Categorias
            </h2>
            <button onClick={() => onNavigate('categories')} className="text-brand-purple text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
              Ver Todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <button 
                key={cat}
                onClick={() => onNavigate('categories')}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-purple hover:bg-brand-lightPurple/20 transition-all group"
              >
                <div className="p-3 rounded-xl bg-white shadow-sm text-gray-400 group-hover:text-brand-purple group-hover:scale-110 transition-all mb-3">
                  {getCategoryIcon(cat)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600 group-hover:text-brand-purple text-center">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vitrine de Produtos - 2 colunas no Mobile */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Destaques para Você</h2>
              <p className="text-gray-500 text-sm font-medium">Os itens mais recentes adicionados em Mogi.</p>
            </div>
            <button 
              onClick={() => onNavigate('offers')}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-brand-purple hover:text-brand-purple transition-all shadow-sm"
            >
              Ver Catálogo Completo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onNegotiate={handleNegotiateClick}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={onViewProductDetails}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aguardando novos anúncios...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <span className="text-brand-orange font-bold tracking-wider uppercase text-xs">Prático e Direto</span>
             <h2 className="text-3xl font-black text-gray-900 mt-2">Como comprar aqui?</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 bg-brand-lightPurple text-brand-purple rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1. Explore</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Navegue pelas ofertas de itens novos e seminovos de alta qualidade.</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 bg-brand-lightOrange text-brand-orange rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">2. Combine</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Gostou de algo? Clique em negociar e fale diretamente com o vendedor.</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">3. Retire</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Combinamos o melhor local para retirada segura em Mogi das Cruzes.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};


import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, ArrowRight } from 'lucide-react';

interface FavoritesProps {
  products: Product[];
  favorites: number[]; // Mudado para number
  onToggleFavorite: (productId: number) => void; // Mudado para number
  onNavigate: (page: string) => void;
  onViewDetails: (product: Product) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ 
  products, 
  favorites, 
  onToggleFavorite, 
  onNavigate,
  onViewDetails
}) => {
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleNegotiateClick = (product: Product) => {
    const message = `Olá! Vi o produto *${product.title}* nos meus favoritos do site *Barganha Mogi* e gostaria de negociar.`;
    const phoneNumber = "5511999812223"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" />
            Meus Favoritos
          </h1>
          <p className="mt-2 text-gray-500">Produtos que você demonstrou interesse.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onNegotiate={handleNegotiateClick}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(product.id)}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Sua lista está vazia</h3>
            <p className="text-gray-500 mt-2">Favorite os produtos que você mais gostou para vê-los aqui.</p>
            <button 
              onClick={() => onNavigate('offers')}
              className="mt-6 px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-darkPurple transition flex items-center mx-auto"
            >
              Explorar Ofertas
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

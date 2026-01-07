
import React, { useState } from 'react';
import { Tag, MessageCircle, Heart, ChevronLeft, ChevronRight, Info, ImageOff, ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onNegotiate: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNegotiate, 
  isFavorite = false, 
  onToggleFavorite,
  onViewDetails
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filtragem ultra-defensiva para evitar o erro .trim() is not a function
  const images = React.useMemo(() => {
    if (!product || !Array.isArray(product.images)) return [];
    return product.images.filter(img => 
      img && 
      typeof img === 'string' && 
      typeof img.trim === 'function' && 
      img.trim() !== ''
    );
  }, [product?.images]);
  
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(false); // Reset loader for next image
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(false); // Reset loader for prev image
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleNegotiateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNegotiate(product);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
        {hasImages ? (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-8 h-8 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={images[currentImageIndex]} 
              alt={product.title} 
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 p-8 text-center">
            <ImageOff className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sem Foto</span>
          </div>
        )}
        
        {hasMultipleImages && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-brand-purple hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-brand-purple hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10">
              <ImageIcon className="w-3 h-3" />
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        <button onClick={handleFavoriteClick} className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-20 ${isFavorite ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'}`}>
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center z-10">
          <Tag className="w-3 h-3 mr-1 text-brand-purple" />
          {product.status}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider mb-2 self-start">{product.category}</span>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-brand-purple transition-colors">{product.title}</h3>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <span className="text-xl font-extrabold text-gray-900">R$ {product.price.toFixed(2)}</span>
            <div className="text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs font-bold">
              Ver Detalhes <Info className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          <button onClick={handleNegotiateClick} className="w-full bg-brand-orange hover:bg-brand-darkOrange text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-brand-orange/20 active:scale-[0.98]">
            <MessageCircle className="w-5 h-5 mr-2" />
            Negociar
          </button>
        </div>
      </div>
    </div>
  );
};

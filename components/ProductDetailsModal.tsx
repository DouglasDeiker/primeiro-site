
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Tag, Info, ChevronLeft, ChevronRight, Share2, ImageOff, CheckCircle2, ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsLoaded(false);
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const rawImages = Array.isArray(product.images) ? product.images : [];
  const images = rawImages.filter(img => typeof img === 'string' && img.trim() !== '');
  
  const hasImages = images.length > 0;
  
  const handleNegotiate = () => {
    const message = `Olá! Tenho interesse no produto *${product.title}* (R$ ${product.price.toFixed(2)}) que vi no *Barganha Mogi*. Poderia me dar mais informações?`;
    const phoneNumber = "5511999812223"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareProduct = async () => {
    const shareUrl = window.location.origin + '?id=' + product.id;
    const shareData = {
      title: `Barganha Mogi - ${product.title}`,
      text: `Confira este produto no Barganha Mogi: ${product.title}`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    }
  };

  const nextImage = () => {
    setIsLoaded(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setIsLoaded(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
      <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-300">
        {/* Botão de Fechar Superior */}
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/90 hover:bg-white text-gray-900 rounded-2xl shadow-xl transition-all active:scale-90 border border-gray-100">
          <X className="w-6 h-6" />
        </button>

        {/* Lado Esquerdo: Visualizador de Imagens */}
        <div className="w-full lg:w-[60%] flex flex-col bg-gray-100">
          {/* Imagem Principal Ativa */}
          <div className="relative flex-grow min-h-[350px] md:min-h-[500px] flex items-center justify-center bg-gray-200 overflow-hidden">
            {hasImages ? (
              <>
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                    <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.title} 
                  onLoad={() => setIsLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`} 
                />
                
                {/* Controles de Navegação Grandes */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-brand-purple hover:text-white p-4 rounded-2xl shadow-2xl transition-all backdrop-blur-md active:scale-90">
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-brand-purple hover:text-white p-4 rounded-2xl shadow-2xl transition-all backdrop-blur-md active:scale-90">
                      <ChevronRight className="w-8 h-8" />
                    </button>
                    <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-24 h-24 mb-4 opacity-20" />
                <span className="font-black uppercase tracking-[0.2em] text-xs opacity-40">Nenhuma foto disponível</span>
              </div>
            )}
          </div>

          {/* Galeria de Miniaturas (Agora maiores e no mesmo estilo) */}
          {images.length > 1 && (
            <div className="p-6 bg-white flex gap-4 overflow-x-auto scrollbar-hide border-t border-gray-100">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if(idx !== currentImageIndex) {
                      setIsLoaded(false);
                      setCurrentImageIndex(idx);
                    }
                  }}
                  className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 transition-all duration-300 relative group ${
                    idx === currentImageIndex 
                      ? 'border-brand-purple shadow-xl scale-105 z-10' 
                      : 'border-transparent opacity-60 hover:opacity-100 grayscale-[0.5] hover:grayscale-0'
                  }`}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover" 
                    alt={`Miniatura ${idx + 1}`} 
                  />
                  {idx === currentImageIndex && (
                    <div className="absolute inset-0 bg-brand-purple/10 flex items-center justify-center">
                       <CheckCircle2 className="w-6 h-6 text-brand-purple bg-white rounded-full p-0.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Direito: Informações e Ações */}
        <div className="w-full lg:w-[40%] p-8 md:p-12 overflow-y-auto flex flex-col bg-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-lightPurple text-brand-purple text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-purple/10">
                {product.category}
              </span>
              <span className="bg-orange-50 text-brand-orange text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-orange/10 flex items-center">
                <Tag className="w-3 h-3 mr-1.5" />
                {product.status}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">{product.title}</h2>
            
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-brand-purple/5 p-4 rounded-3xl border border-brand-purple/10">
                <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest mb-1 opacity-70">Preço Sugerido</p>
                <span className="text-4xl font-black text-brand-purple">R$ {product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                <Info className="w-4 h-4 mr-2 text-brand-purple" /> Detalhes do Item
              </h4>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium bg-gray-50/50 p-6 rounded-3xl border border-gray-100 italic">
                "{product.description}"
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <button 
              onClick={handleNegotiate} 
              className="w-full bg-brand-orange hover:bg-brand-darkOrange text-white font-black py-6 px-8 rounded-3xl shadow-2xl shadow-brand-orange/30 flex items-center justify-center text-xl transition-all active:scale-95 uppercase tracking-widest"
            >
              <MessageCircle className="w-7 h-7 mr-3" /> Chamar no Whats
            </button>
            
            <button 
              onClick={handleShareProduct} 
              className={`w-full flex items-center justify-center gap-3 py-5 px-8 rounded-3xl font-black transition-all border-2 active:scale-95 uppercase tracking-widest text-sm ${
                copied 
                ? 'bg-green-50 border-green-200 text-green-600' 
                : 'bg-white border-gray-100 text-gray-400 hover:text-brand-purple hover:border-brand-purple hover:bg-brand-lightPurple/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

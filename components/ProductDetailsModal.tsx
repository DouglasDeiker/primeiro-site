
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Tag, Info, ChevronLeft, ChevronRight, Share2, ImageOff, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Resetar o índice da imagem quando abrir um novo produto
  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  // Garantir que product.images seja um array e que cada item seja uma string válida
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

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/90 rounded-full shadow-lg text-gray-800 hover:bg-gray-200 transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Área da Imagem e Galeria */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-50 border-r border-gray-100">
          <div className="flex-grow relative min-h-[320px] md:min-h-[450px] flex items-center justify-center overflow-hidden bg-gray-200">
            {hasImages ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.title} 
                  className="w-full h-full object-contain md:object-cover transition-all duration-500" 
                />
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-brand-purple hover:text-white transition-all"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-brand-purple hover:text-white transition-all"><ChevronRight className="w-6 h-6" /></button>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300">
                <ImageOff className="w-20 h-20 mb-4 opacity-20" />
                <span className="font-black uppercase tracking-widest opacity-40">Sem imagem</span>
              </div>
            )}
          </div>

          {/* Galeria de Miniaturas (Thumbnails) */}
          {images.length > 1 && (
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3 overflow-x-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex 
                      ? 'border-brand-purple scale-105 shadow-md' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Miniatura ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo Detalhado */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-brand-lightPurple text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {product.status}
              </span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{product.title}</h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-brand-purple">R$ {product.price.toFixed(2)}</span>
              <span className="text-gray-400 text-sm font-bold uppercase">À Vista</span>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center"><Info className="w-4 h-4 mr-2" /> Descrição do Produto</h4>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleNegotiate} 
              className="flex-[2] bg-brand-orange hover:bg-brand-darkOrange text-white font-bold py-5 px-8 rounded-2xl shadow-xl flex items-center justify-center text-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-6 h-6 mr-3" /> Negociar no WhatsApp
            </button>
            
            <button 
              onClick={handleShareProduct} 
              className={`flex-1 flex items-center justify-center gap-2 py-5 px-6 rounded-2xl font-bold transition-all border-2 active:scale-95 ${
                copied 
                ? 'bg-green-50 border-green-200 text-green-600' 
                : 'bg-white border-gray-100 text-gray-500 hover:text-brand-purple hover:border-brand-purple'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-6 h-6" />
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

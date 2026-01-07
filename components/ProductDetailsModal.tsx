
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Tag, Info, Share2, ImageOff, CheckCircle2, ImageIcon, ZoomIn, Maximize2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setFullscreenImage(null);
    }
  }, [isOpen, product?.id]);

  // Fechar zoom ou modal com a tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fullscreenImage, onClose]);

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

  return (
    <>
      {/* Lightbox / Zoom da Imagem (Tamanho Real) */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-8 right-8 z-[210] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={fullscreenImage} 
            alt="Visualização ampliada" 
            className="max-w-[95%] max-h-[95%] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold uppercase tracking-widest">
            Clique fora para fechar ou pressione ESC
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
        <div className="absolute inset-0 bg-dark-900/95 backdrop-blur-xl" onClick={onClose} />
        
        <div className="relative bg-white w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-300">
          
          {/* Botão de Fechar Superior (Fixo no Modal) */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-[110] p-3 bg-white/90 hover:bg-white text-gray-900 rounded-2xl shadow-xl transition-all active:scale-90 border border-gray-100"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lado Esquerdo: Feed de Imagens */}
          <div className="w-full lg:w-[60%] overflow-y-auto bg-gray-50 border-r border-gray-100 scrollbar-hide">
            {hasImages ? (
              <div className="flex flex-col gap-2 p-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative group overflow-hidden rounded-2xl bg-gray-200 cursor-zoom-in"
                    onClick={() => setFullscreenImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.title} - Foto ${idx + 1}`} 
                      className="w-full h-auto object-contain bg-gray-100 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    
                    {/* Overlay de Dica de Zoom */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                          <Maximize2 className="w-6 h-6 text-brand-purple" />
                       </div>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      FOTO {idx + 1} DE {images.length} • CLIQUE PARA AMPLIAR
                    </div>
                  </div>
                ))}
                
                {/* Rodapé de final do feed */}
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 opacity-40">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fim das fotos</span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-24 h-24 mb-4 opacity-10" />
                <span className="font-black uppercase tracking-[0.2em] text-xs opacity-40">Nenhuma foto disponível</span>
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
                <div className="bg-brand-purple/5 p-5 rounded-3xl border border-brand-purple/10 w-full sm:w-auto">
                  <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest mb-1 opacity-70">Preço Sugerido</p>
                  <span className="text-4xl font-black text-brand-purple">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <Info className="w-4 h-4 mr-2 text-brand-purple" /> Descrição do Produto
                </h4>
                <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-brand-purple/10 font-serif leading-none">“</span>
                  {product.description}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 space-y-4">
              <button 
                onClick={handleNegotiate} 
                className="w-full bg-brand-orange hover:bg-brand-darkOrange text-white font-black py-6 px-8 rounded-[1.5rem] shadow-2xl shadow-brand-orange/30 flex items-center justify-center text-xl transition-all active:scale-95 uppercase tracking-widest"
              >
                <MessageCircle className="w-7 h-7 mr-3" /> Chamar no Whats
              </button>
              
              <button 
                onClick={handleShareProduct} 
                className={`w-full flex items-center justify-center gap-3 py-5 px-8 rounded-[1.5rem] font-black transition-all border-2 active:scale-95 uppercase tracking-widest text-sm ${
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
                    <span>Compartilhar Link</span>
                  </>
                )}
              </button>
              
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Referência do Item: #{product.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

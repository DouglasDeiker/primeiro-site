
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Zap, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface HeroProps {
  images?: string[];
}

export const Hero: React.FC<HeroProps> = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtragem defensiva para evitar o erro .trim() is not a function
  const slideImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter(img => 
      img && 
      typeof img === 'string' && 
      typeof img.trim === 'function' && 
      img.trim() !== ''
    );
  }, [images]);

  const nextImage = useCallback(() => {
    if (slideImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const prevImage = useCallback(() => {
    if (slideImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  }, [slideImages.length]);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage, slideImages.length]);

  return (
    <div className="relative bg-brand-darkPurple overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-brand-orange opacity-10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between h-full gap-12 text-center md:text-left">
        <div className="max-w-2xl z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-bold mb-6 border border-brand-orange/20">
            < Zap className="w-4 h-4 mr-2 fill-current" />
            Ofertas Exclusivas em Mogi
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
            Os melhores produtos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">direto para você.</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 mb-8 max-w-xl leading-relaxed mx-auto md:mx-0">
            O Barganha Mogi seleciona as melhores oportunidades da região. Negocie com nosso team e garanta sua compra com segurança e agilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <div className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-brand-orange hover:bg-brand-darkOrange shadow-lg shadow-brand-orange/30 transition-all">
              Ver Ofertas do Dia
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-md lg:max-w-lg group">
           <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple to-brand-orange rounded-3xl opacity-20 blur-2xl transform rotate-6 scale-105"></div>
           
           <div className="relative rounded-3xl shadow-2xl border-4 border-white/10 overflow-hidden h-[450px] bg-gray-900 flex items-center justify-center">
             {slideImages.length > 0 ? (
               slideImages.map((img, index) => (
                 <img 
                   key={`${img}-${index}`}
                   src={img} 
                   alt={`Slide ${index}`} 
                   loading={index === 0 ? "eager" : "lazy"}
                   className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                     index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                   }`}
                 />
               ))
             ) : (
               <div className="flex flex-col items-center justify-center text-white/20 p-12">
                 <div className="mb-4">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                      <path d="M 85 50 A 35 35 0 0 1 15 50" stroke="#f97316" strokeWidth="8" strokeLinecap="round" fill="none"/>
                      <path d="M 15 50 A 35 35 0 0 1 85 50" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" fill="none"/>
                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                 </div>
                 <span className="font-black uppercase tracking-[0.2em] text-sm">Barganha Mogi</span>
                 <p className="text-[10px] mt-2 opacity-50 uppercase tracking-widest">Aguardando Fotos</p>
               </div>
             )}

             {slideImages.length > 1 && (
               <>
                 <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                     className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all active:scale-90"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                     className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all active:scale-90"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>
                 </div>

                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                   {slideImages.map((_, idx) => (
                     <button 
                       key={idx}
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                       className={`h-1.5 rounded-full transition-all duration-300 ${
                         idx === currentIndex ? 'bg-brand-orange w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                       }`}
                     />
                   ))}
                 </div>
               </>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};


import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Search, Filter, ShoppingBag, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';

interface OffersProps {
  products: Product[];
  categories: string[];
  initialCategory: string;
  favorites: number[];
  onToggleFavorite: (productId: number) => void;
  onViewDetails: (product: Product) => void;
  searchFocusTrigger?: number;
}

const ITEMS_PER_PAGE = 12;

export const Offers: React.FC<OffersProps> = ({ 
  products, 
  categories,
  initialCategory, 
  favorites, 
  onToggleFavorite,
  onViewDetails,
  searchFocusTrigger
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Sincroniza categoria inicial vinda de outras páginas
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  // Foca no input de busca quando acionado pela Navbar
  useEffect(() => {
    if (searchFocusTrigger && searchFocusTrigger > 0) {
      setSearchQuery(''); 
      setSelectedCategory('Todos');
      setCurrentPage(1);
      
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchFocusTrigger]);

  // Resetar para página 1 ao filtrar ou buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filtra os produtos com base na busca e categoria
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cálculo da paginação
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, startIndex]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Rolagem suave para o início da lista ao trocar de página
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNegotiateClick = (product: Product) => {
    const message = `Olá! Vi o produto *${product.title}* no site *Barganha Mogi* e gostaria de negociar. Como podemos combinar?`;
    const phoneNumber = "5511999812223"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSearchQuery('');
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12" ref={gridTopRef}>
        {/* Cabeçalho de Filtros */}
        <section className="bg-white border-b border-gray-200 py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col xl:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Ofertas e Anúncios</h1>
                <p className="mt-2 text-gray-500">Explore as melhores oportunidades em Mogi das Cruzes.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto bg-gray-50 p-2 rounded-2xl border border-gray-200">
                <div className="relative flex-grow min-w-[280px]">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="O que você está procurando?" 
                    className="pl-11 pr-4 py-3 border-none bg-white rounded-xl focus:ring-2 focus:ring-brand-purple w-full transition-all shadow-sm outline-none font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="relative flex-grow sm:flex-initial min-w-[200px]">
                  <div className="flex items-center h-full bg-white rounded-xl px-3 shadow-sm border border-transparent focus-within:border-brand-purple transition-all">
                    <Filter className="w-5 h-5 text-gray-400 mr-2" />
                    <select 
                      className="bg-transparent border-none text-gray-700 font-bold focus:ring-0 cursor-pointer w-full py-3 outline-none appearance-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="Todos">Todas Categorias</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resumo da Busca e Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProducts.length > 0 && (
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                <ListOrdered className="w-4 h-4 text-brand-purple" />
                <span>Mostrando {startIndex + 1}-{endIndex} de {filteredProducts.length} itens encontrados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Página {currentPage} de {totalPages || 1}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onNegotiate={handleNegotiateClick}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => onToggleFavorite(product.id)}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 shadow-inner">
                <ShoppingBag className="mx-auto w-20 h-20 text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-900">Ops! Nada por aqui.</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">Não encontramos produtos para sua busca ou categoria selecionada.</p>
                <button onClick={clearFilters} className="mt-8 px-8 py-4 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all active:scale-95">Limpar Filtros</button>
              </div>
            )}
          </div>

          {/* Navegação de Paginação */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-50' 
                      : 'bg-white text-brand-purple border-gray-200 hover:border-brand-purple hover:bg-brand-purple hover:text-white active:scale-90 shadow-sm'
                  }`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    
                    // Lógica para mostrar apenas algumas páginas próximas e extremas
                    const isNearCurrent = Math.abs(currentPage - pageNum) <= 1;
                    const isEdge = pageNum === 1 || pageNum === totalPages;
                    const isEllipsis = Math.abs(currentPage - pageNum) === 2;

                    if (isNearCurrent || isEdge) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-11 h-11 rounded-xl font-black text-sm transition-all flex items-center justify-center ${
                            currentPage === pageNum
                              ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30 scale-110'
                              : 'text-gray-400 hover:bg-gray-50 hover:text-brand-purple'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (isEllipsis) {
                      return <span key={pageNum} className="w-8 text-center text-gray-300 font-black">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-50' 
                      : 'bg-white text-brand-purple border-gray-200 hover:border-brand-purple hover:bg-brand-purple hover:text-white active:scale-90 shadow-sm'
                  }`}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="bg-brand-lightPurple/40 px-4 py-2 rounded-full border border-brand-purple/10">
                 <p className="text-[10px] text-brand-purple font-black uppercase tracking-[0.2em]">
                   Final do Catálogo • {filteredProducts.length} Itens
                 </p>
              </div>
            </div>
          )}
        </section>
    </div>
  );
};

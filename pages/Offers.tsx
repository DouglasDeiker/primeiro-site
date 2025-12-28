
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Search, Filter, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

interface OffersProps {
  products: Product[];
  categories: string[];
  initialCategory: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
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

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
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
        <section className="bg-white border-b border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col xl:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Ofertas e Anúncios</h1>
                <p className="mt-2 text-gray-500">Encontre os melhores preços de Mogi aqui.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto bg-gray-50 p-2 rounded-2xl border border-gray-200">
                <div className="relative flex-grow min-w-[240px]">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Buscar produtos..." 
                    className="pl-11 pr-4 py-3 border-none bg-white rounded-xl focus:ring-2 focus:ring-brand-purple w-full transition-all shadow-sm outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="relative flex-grow sm:flex-initial min-w-[180px]">
                  <div className="flex items-center h-full bg-white rounded-xl px-3 border-l-4 border-transparent focus-within:border-brand-purple transition-all shadow-sm">
                    <Filter className="w-5 h-5 text-gray-500 mr-2" />
                    <select 
                      className="bg-transparent border-none text-gray-700 font-medium focus:ring-0 cursor-pointer w-full py-3 outline-none"
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onNegotiate={handleNegotiateClick}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                <ShoppingBag className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">Nenhum produto encontrado</h3>
                <p className="text-gray-500 mt-2">Tente buscar por outro termo ou mude os filtros aplicados.</p>
                <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-brand-purple text-white rounded-full font-medium hover:bg-brand-darkPurple transition">Limpar filtros</button>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-purple hover:text-brand-purple active:scale-90 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const isNearCurrent = Math.abs(currentPage - pageNum) <= 2;
                    const isEdge = pageNum === 1 || pageNum === totalPages;

                    if (isNearCurrent || isEdge) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-brand-purple text-white shadow-lg'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-brand-purple'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (Math.abs(currentPage - pageNum) === 3) {
                      return <span key={pageNum} className="px-2 text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-purple hover:text-brand-purple active:scale-90 shadow-sm'
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Página <span className="text-gray-900">{currentPage}</span> de <span className="text-gray-900">{totalPages}</span> — {filteredProducts.length} itens encontrados
              </p>
            </div>
          )}
        </section>
    </div>
  );
};

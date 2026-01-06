
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Offers } from './pages/Offers';
import { Favorites } from './pages/Favorites';
import { HelpCenter } from './pages/HelpCenter';
import { Terms } from './pages/Terms';
import { Sell } from './pages/Sell';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Loader2, Database, RefreshCcw, AlertCircle } from 'lucide-react';
import { Product, User, Category, ItemStatus } from './types';
import { CATEGORIES } from './constants';
import { supabase, isDatabaseConfigured } from './lib/supabase';

const formatSupabaseError = (err: any): string => {
  if (!err) return "Erro desconhecido.";
  if (typeof err === 'string') return err;
  return `Erro ${err.code || ''}: ${err.message || ''}`.trim();
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbError, setDbError] = useState<{ message: string; code?: string } | null>(null);
  const [searchIntentTrigger, setSearchIntentTrigger] = useState<number>(0);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [fullCategories, setFullCategories] = useState<Category[]>([]);
  const [dbCategoriesNames, setDbCategoriesNames] = useState<string[]>(CATEGORIES);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    // Monitor de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Usuário',
          email: session.user.email || '',
          whatsapp: session.user.user_metadata?.whatsapp || '',
          role: 'cliente'
        });
      } else {
        setUser(null);
      }
    });

    const fetchData = async () => {
      if (!isDatabaseConfigured) {
        setIsInitializing(false);
        return;
      }
      
      try {
        // 1. Buscar Produtos
        const { data: productsData, error: pError } = await supabase
          .from('products')
          .select('*, app_categories(name)')
          .eq('active', true)
          .order('id', { ascending: false });

        if (pError) {
          console.error("Erro ao buscar produtos:", pError);
          // Só trava o app se for erro de tabela inexistente (42P01)
          if (pError.code === '42P01') {
             setDbError({ message: "Tabela 'products' não encontrada.", code: pError.code });
             setIsInitializing(false);
             return;
          }
        }

        // Sanitização segura de dados
        const mappedProducts: Product[] = (productsData || []).map(p => {
          let safeImages: string[] = [];
          if (Array.isArray(p.images)) {
            safeImages = p.images.filter(img => typeof img === 'string');
          } else if (typeof p.images === 'string') {
            safeImages = [p.images];
          }

          return {
            ...p,
            title: String(p.title || 'Sem título'),
            description: String(p.description || ''),
            price: Number(p.price || 0),
            images: safeImages,
            category: p.app_categories?.name || 'Variados',
            status: (p.status as ItemStatus) || ItemStatus.GOOD
          };
        });

        setProducts(mappedProducts);

        // 2. Buscar Categorias e Hero Slides
        const [catsRes, slidesRes] = await Promise.all([
          supabase.from('app_categories').select('id, name').order('name', { ascending: true }),
          supabase.from('hero_slides').select('image_url').eq('active', true).order('display_order')
        ]);

        if (catsRes.data) {
          setFullCategories(catsRes.data);
          setDbCategoriesNames(catsRes.data.map(c => c.name));
        }
        
        const manualSlides = (slidesRes.data || [])
          .map(s => s.image_url)
          .filter(url => typeof url === 'string' && url.length > 5);

        const productPreviews = mappedProducts
          .map(p => p.images?.[0])
          .filter((img): img is string => typeof img === 'string' && img.length > 5);

        setHeroImages(manualSlides.length > 0 ? manualSlides : productPreviews.slice(0, 5));

      } catch (err: any) {
        console.error("Erro inesperado no carregamento:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchData();

    // Favoritos do LocalStorage
    try {
      const savedFavs = localStorage.getItem('barganha_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavorites(parsed.filter(id => typeof id === 'number'));
      }
    } catch (e) {
      console.warn("Erro ao ler favoritos do cache", e);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('barganha_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') setFilterCategory('Todos');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleNavigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={handleNavigate} heroImages={heroImages} />;
      case 'categories': return <Categories categories={dbCategoriesNames} onSelectCategory={(cat) => { setFilterCategory(cat); handleNavigate('offers'); }} />;
      case 'offers': return <Offers products={products} categories={dbCategoriesNames} initialCategory={filterCategory} favorites={favorites} onToggleFavorite={handleToggleFavorite} onViewDetails={(p) => { setDetailProduct(p); setIsDetailModalOpen(true); }} searchFocusTrigger={searchIntentTrigger} />;
      case 'favorites': return <Favorites products={products} favorites={favorites} onToggleFavorite={handleToggleFavorite} onNavigate={handleNavigate} onViewDetails={(p) => { setDetailProduct(p); setIsDetailModalOpen(true); }} />;
      case 'sell': return <Sell categories={fullCategories} onAddProduct={(p) => { setProducts([p, ...products]); handleNavigate('offers'); }} onNavigate={handleNavigate} />;
      case 'login': return <Login onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('home')} />;
      case 'register': return <Register onNavigate={handleNavigate} onRegisterSuccess={() => handleNavigate('home')} />;
      case 'help': return <HelpCenter onNavigate={handleNavigate} />;
      case 'terms': return <Terms onNavigate={handleNavigate} />;
      default: return <Home onNavigate={handleNavigate} heroImages={heroImages} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-brand-darkPurple flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-2xl w-full">
          <Database className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4">Ajuste Necessário</h2>
          <div className="bg-red-50 p-6 rounded-2xl mb-8 border border-red-100 text-left">
            <p className="text-gray-700 text-sm">O site não conseguiu localizar as tabelas no seu Supabase. Certifique-se de ter rodado o script SQL corretamente.</p>
          </div>
          <button onClick={() => window.location.reload()} className="bg-brand-purple text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition-transform active:scale-95">
            <RefreshCcw className="w-5 h-5" /> Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pb-20 md:pb-0 relative">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { setFilterCategory('Todos'); handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} user={user} onLogout={handleLogout} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <ProductDetailsModal isOpen={isDetailModalOpen} product={detailProduct} onClose={() => setIsDetailModalOpen(false)} />
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { setFilterCategory('Todos'); handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} />
    </div>
  );
};

export default App;

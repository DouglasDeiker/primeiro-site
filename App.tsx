
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
import { Loader2, Database, RefreshCcw } from 'lucide-react';
import { Product, User, Category } from './types';
import { CATEGORIES } from './constants';
import { supabase, isDatabaseConfigured } from './lib/supabase';

const formatSupabaseError = (err: any): string => {
  if (!err) return "Erro desconhecido.";
  if (typeof err === 'string') return err;
  return `${err.message || ''} ${err.details || ''} ${err.hint || ''}`.trim() || JSON.stringify(err);
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [searchIntentTrigger, setSearchIntentTrigger] = useState<number>(0);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [fullCategories, setFullCategories] = useState<Category[]>([]);
  const [dbCategoriesNames, setDbCategoriesNames] = useState<string[]>(CATEGORIES);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
        // Busca produtos com tratamento de erro específico
        const { data: productsData, error: pError } = await supabase
          .from('products')
          .select('*, app_categories(name)')
          .eq('active', true)
          .order('id', { ascending: false });

        if (pError) {
          console.error("Erro ao buscar produtos:", pError);
          // Se for erro de tabela inexistente (42P01), mostramos um aviso amigável
          if (pError.code === '42P01') {
            setDbError("A tabela de produtos ainda não foi criada no Supabase. Por favor, execute o script SQL de configuração.");
          } else {
            setDbError(formatSupabaseError(pError));
          }
          return;
        }

        const mappedProducts: Product[] = (productsData || []).map(p => ({
          ...p,
          category: p.app_categories?.name || 'Variados'
        }));

        setProducts(mappedProducts);

        // Busca categorias e slides em paralelo
        const [cats, slides] = await Promise.all([
          supabase.from('app_categories').select('id, name').order('name'),
          supabase.from('hero_slides').select('image_url').eq('active', true).order('display_order')
        ]);

        if (cats.data && cats.data.length > 0) {
          setFullCategories(cats.data);
          setDbCategoriesNames(cats.data.map(c => c.name));
        }
        
        const manualSlides = slides.data?.map(s => s.image_url) || [];
        const productPreviews = mappedProducts.map(p => p.images?.[0]).filter(Boolean) as string[];
        setHeroImages(manualSlides.length > 0 ? manualSlides : productPreviews.slice(0, 5));

      } catch (err) {
        console.error("Erro crítico de inicialização:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchData();

    const savedFavs = localStorage.getItem('barganha_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('barganha_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNavigate = (page: string) => {
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
      case 'categories': return <Categories onSelectCategory={(cat) => { handleNavigate('offers'); }} categories={dbCategoriesNames} />;
      case 'offers': return <Offers products={products} categories={dbCategoriesNames} initialCategory="Todos" favorites={favorites} onToggleFavorite={handleToggleFavorite} onViewDetails={(p) => { setDetailProduct(p); setIsDetailModalOpen(true); }} searchFocusTrigger={searchIntentTrigger} />;
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
          <h2 className="text-2xl font-black mb-4">Configuração Pendente</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {dbError}
            <br /><br />
            <span className="text-sm font-bold bg-gray-100 p-2 rounded block">
              Acesse o SQL Editor do Supabase e rode o script de criação das tabelas.
            </span>
          </p>
          <button onClick={() => window.location.reload()} className="bg-brand-purple text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto">
            <RefreshCcw className="w-5 h-5" /> Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pb-20 md:pb-0 relative">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} user={user} onLogout={handleLogout} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <ProductDetailsModal isOpen={isDetailModalOpen} product={detailProduct} onClose={() => setIsDetailModalOpen(false)} />
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} />
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Offers } from './pages/Offers';
import { Favorites } from './pages/Favorites';
import { HelpCenter } from './pages/HelpCenter';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product, User, Category, ItemStatus } from './types';
import { CATEGORIES } from './constants';
import { supabase, isDatabaseConfigured } from './lib/supabase';

const formatSupabaseError = (err: any): string => {
  if (!err) return "Erro desconhecido.";
  if (typeof err === 'string') return err;
  const message = err.message || err.details || JSON.stringify(err);
  const code = err.code ? `[${err.code}] ` : "";
  return `${code}${message}`;
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
        const { data: productsData, error: pError } = await supabase
          .from('products')
          .select('*, app_categories(name)')
          .eq('active', true)
          .order('id', { ascending: false });

        if (pError) {
          console.error("Erro ao buscar produtos:", formatSupabaseError(pError));
          if (pError.code === '42P01') {
             setDbError({ message: "Tabela 'products' não encontrada. Verifique seu banco de dados.", code: pError.code });
             setIsInitializing(false);
             return;
          }
        }

        const mappedProducts: Product[] = (productsData || []).map(p => {
          let safeImages: string[] = [];
          
          if (Array.isArray(p.images)) {
            safeImages = p.images.filter(img => typeof img === 'string' && img.length > 5);
          } else if (typeof p.images === 'string') {
            try {
              const parsed = JSON.parse(p.images);
              safeImages = Array.isArray(parsed) ? parsed : [p.images];
            } catch {
              safeImages = p.images.length > 5 ? [p.images] : [];
            }
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
          .filter((img): img is string => !!img);

        setHeroImages(manualSlides.length > 0 ? manualSlides : productPreviews.slice(0, 5));

      } catch (err: any) {
        console.error("Erro inesperado:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchData();

    try {
      const savedFavs = localStorage.getItem('barganha_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavorites(parsed.filter(id => typeof id === 'number'));
      }
    } catch (e) {
      console.warn("Erro favoritos cache", e);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const isAdding = !prev.includes(productId);
      const updated = isAdding ? [...prev, productId] : prev.filter(id => id !== productId);
      localStorage.setItem('barganha_favorites', JSON.stringify(updated));

      if (isAdding) {
        const product = products.find(p => p.id === productId);
        if (product) {
          const clientName = user?.name || 'Um cliente';
          const message = `Olá! Eu (${clientName}) acabei de favoritar o seu produto *${product.title}* no site *Barganha Mogi*! ❤️ Ele ainda está disponível?`;
          const phoneNumber = "5511999812223"; 
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }
      }

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pb-20 md:pb-0 relative">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { setFilterCategory('Todos'); handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        {(() => {
          switch (currentPage) {
            case 'home': return <Home onNavigate={handleNavigate} heroImages={heroImages} />;
            case 'categories': return <Categories categories={dbCategoriesNames} onSelectCategory={(cat) => { setFilterCategory(cat); handleNavigate('offers'); }} />;
            case 'offers': return <Offers products={products} categories={dbCategoriesNames} initialCategory={filterCategory} favorites={favorites} onToggleFavorite={handleToggleFavorite} onViewDetails={(p) => { setDetailProduct(p); setIsDetailModalOpen(true); }} searchFocusTrigger={searchIntentTrigger} />;
            case 'favorites': return <Favorites products={products} favorites={favorites} onToggleFavorite={handleToggleFavorite} onNavigate={handleNavigate} onViewDetails={(p) => { setDetailProduct(p); setIsDetailModalOpen(true); }} />;
            case 'login': return <Login onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('home')} />;
            case 'register': return <Register onNavigate={handleNavigate} onRegisterSuccess={() => handleNavigate('home')} />;
            case 'help': return <HelpCenter onNavigate={handleNavigate} />;
            case 'terms': return <Terms onNavigate={handleNavigate} />;
            default: return <Home onNavigate={handleNavigate} heroImages={heroImages} />;
          }
        })()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <ProductDetailsModal 
        isOpen={isDetailModalOpen} 
        product={detailProduct} 
        onClose={() => setIsDetailModalOpen(false)} 
        isFavorite={detailProduct ? favorites.includes(detailProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} onSearchClick={() => { setFilterCategory('Todos'); handleNavigate('offers'); setSearchIntentTrigger(t => t + 1); }} />
    </div>
  );
};

export default App;

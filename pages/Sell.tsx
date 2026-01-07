
import React, { useState, useRef, useEffect } from 'react';
import { ItemStatus, Product, Category } from '../types';
import { Camera, Plus, Trash2, AlertTriangle, Loader2, CheckCircle2, User, Phone, Tag, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SellProps {
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export const Sell: React.FC<SellProps> = ({ categories, onAddProduct, onNavigate }) => {
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerWhatsapp: '',
    title: '',
    description: '',
    price: '',
    categoryId: '', 
    condition: ItemStatus.NEW
  });

  const [images, setImages] = useState<( { preview: string; file: File } | null )[]>(Array(6).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Refs para os inputs de arquivo
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          sellerName: user.user_metadata?.name || '',
          sellerWhatsapp: user.user_metadata?.whatsapp || '',
          categoryId: categories.length > 0 ? categories[0].id.toString() : ''
        }));
      }
    };
    checkUser();
  }, [categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { alert("Imagem muito pesada (máx 10MB)."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = { preview: reader.result as string, file: file };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUser) return setError("Faça login para vender.");

    const validImageObjects = images.filter((img): img is { preview: string; file: File } => img !== null);
    if (!formData.title || !formData.price || !formData.categoryId) return setError("Preencha todos os campos obrigatórios.");
    if (validImageObjects.length === 0) return setError("Adicione pelo menos uma foto.");

    setIsSubmitting(true);

    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < validImageObjects.length; i++) {
        const item = validImageObjects[i];
        const fileName = `${currentUser.id}/${Date.now()}-${i}.${item.file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, item.file);
        if (uploadError) throw new Error(`Erro na foto ${i+1}: ${uploadError.message}`);
        imageUrls.push(supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl);
      }

      const { data, error: dbError } = await supabase.from('products').insert([{
        title: formData.title,
        description: `${formData.description}\n\nVendedor: ${formData.sellerName}\nWhats: ${formData.sellerWhatsapp}`,
        price: parseFloat(formData.price),
        images: imageUrls,
        category_id: parseInt(formData.categoryId), 
        status: formData.condition,
        active: true,
        storeId: 'personal_1',
        userId: currentUser.id
      }]).select();

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        const selectedCat = categories.find(c => c.id === parseInt(formData.categoryId));
        onAddProduct({ ...data[0], category: selectedCat?.name || 'Geral' } as Product);
        onNavigate('offers');
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Erro ao publicar.");
      setIsSubmitting(false);
    }
  };

  if (success) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"><CheckCircle2 className="w-16 h-16" /></div>
      <h2 className="text-3xl font-black text-gray-900 mb-2">Anúncio Publicado!</h2>
      <p className="text-gray-500">Seu item já está disponível no catálogo.</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-darkPurple p-10 text-white relative">
            <h1 className="text-3xl font-black mb-2">Vender um Item</h1>
            <p className="text-brand-lightPurple opacity-90">Anuncie e venda rápido. Agora você pode adicionar até 6 fotos!</p>
          </div>

          {!currentUser ? (
            <div className="p-12 text-center space-y-6">
               <AlertTriangle className="w-16 h-16 text-brand-orange mx-auto" />
               <p className="text-gray-600 font-bold">Você precisa estar logado para anunciar um produto.</p>
               <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-brand-purple text-white font-bold rounded-2xl">Fazer Login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {error && <div className="bg-red-50 p-4 rounded-2xl text-red-700 font-bold flex gap-2 items-center"><AlertTriangle className="w-5 h-5" /> {error}</div>}
              
              <section className="bg-brand-lightPurple/20 p-6 rounded-3xl space-y-6">
                <h3 className="text-lg font-black text-brand-purple flex items-center gap-2">
                  <User className="w-5 h-5" /> Informações do Vendedor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border-transparent text-gray-500 font-bold" value={formData.sellerName} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border-transparent text-gray-500 font-bold" value={formData.sellerWhatsapp} />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-orange" /> Detalhes do Produto
                </h3>
                <div className="space-y-4">
                  <input name="title" required placeholder="Título do anúncio (ex: iPhone 13 Pro Max 256GB)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-bold text-gray-800" value={formData.title} onChange={handleInputChange} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input name="price" type="number" step="0.01" required placeholder="Preço (R$)" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-bold" value={formData.price} onChange={handleInputChange} />
                    </div>
                    <select name="categoryId" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-bold text-gray-700" value={formData.categoryId} onChange={handleInputChange}>
                      <option value="">Selecione a Categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <select name="condition" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-bold text-gray-700" value={formData.condition} onChange={handleInputChange}>
                    {Object.values(ItemStatus).map(status => <option key={status} value={status}>{status}</option>)}
                  </select>

                  <textarea name="description" rows={4} placeholder="Descreva seu item (estado de conservação, tempo de uso, etc)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none font-medium text-gray-700 resize-none" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-brand-purple" /> Fotos do Produto (Até 6)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand-purple transition-colors">
                      {img ? (
                        <>
                          <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => fileInputRefs.current[index]?.click()} className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-brand-purple">
                          <Plus className="w-8 h-8" />
                          <span className="text-[10px] font-bold uppercase">Adicionar</span>
                        </button>
                      )}
                      {/* FIX: Callback ref returning void explicitly to satisfy React 19/TS requirements */}
                      <input 
                        type="file" 
                        ref={(el) => { fileInputRefs.current[index] = el; }} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(index, e)} 
                      />
                    </div>
                  ))}
                </div>
              </section>

              <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-orange hover:bg-brand-darkOrange text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center uppercase tracking-widest active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Anúncio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

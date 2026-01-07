
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
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
      if (file.size > 5 * 1024 * 1024) { 
        alert("Imagem muito pesada (máx 5MB)."); 
        return; 
      }
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
    
    if (!formData.title || !formData.price || !formData.categoryId) {
      return setError("Preencha todos os campos obrigatórios.");
    }
    if (validImageObjects.length === 0) {
      return setError("Adicione pelo menos uma foto do seu produto.");
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const imageUrls: string[] = [];
      
      // Upload de cada imagem sequencialmente para manter ordem e controle
      for (let i = 0; i < validImageObjects.length; i++) {
        setUploadProgress(i + 1);
        const item = validImageObjects[i];
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}-${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, item.file);

        if (uploadError) throw new Error(`Erro no upload da foto ${i+1}: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrl);
      }

      // Inserção no Banco de Dados
      const { data, error: dbError } = await supabase.from('products').insert([{
        title: formData.title,
        description: `${formData.description}\n\nVendedor: ${formData.sellerName}\nWhats: ${formData.sellerWhatsapp}`,
        price: parseFloat(formData.price),
        images: imageUrls, // Envia o array de URLs
        category_id: parseInt(formData.categoryId), 
        status: formData.condition,
        active: true,
        storeId: 'personal_1',
        userId: currentUser.id
      }]).select('*, app_categories(name)');

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        const productData = data[0];
        onAddProduct({
          ...productData,
          category: productData.app_categories?.name || 'Geral'
        } as Product);
        onNavigate('offers');
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Erro ao publicar anúncio. Verifique sua conexão.");
      setIsSubmitting(false);
    }
  };

  if (success) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
        <CheckCircle2 className="w-16 h-16" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2">Sucesso!</h2>
      <p className="text-gray-500">Seu anúncio com {images.filter(img => img).length} fotos foi publicado.</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-darkPurple p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <h1 className="text-3xl font-black mb-2 relative z-10">Anunciar Produto</h1>
            <p className="text-brand-lightPurple opacity-90 relative z-10 font-medium">Mostre todos os detalhes. Você pode enviar até 6 fotos!</p>
          </div>

          {!currentUser ? (
            <div className="p-12 text-center space-y-6">
               <div className="w-20 h-20 bg-brand-lightPurple/50 text-brand-purple rounded-3xl flex items-center justify-center mx-auto">
                 <User className="w-10 h-10" />
               </div>
               <div className="max-w-xs mx-auto">
                 <h3 className="text-xl font-black text-gray-900 mb-2">Quase lá!</h3>
                 <p className="text-gray-500 font-medium mb-8">Você precisa estar logado para criar anúncios e gerenciar suas vendas.</p>
               </div>
               <button onClick={() => onNavigate('login')} className="px-10 py-4 bg-brand-purple text-white font-black rounded-2xl shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all">Fazer Login Agora</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {error && (
                <div className="bg-red-50 p-5 rounded-2xl text-red-700 font-bold flex gap-3 items-center border border-red-100 animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-6 h-6 shrink-0" /> 
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <section className="bg-brand-lightPurple/20 p-8 rounded-[2rem] space-y-6 border border-brand-purple/5">
                <h3 className="text-sm font-black text-brand-purple flex items-center gap-2 uppercase tracking-widest">
                  <User className="w-4 h-4" /> Perfil do Vendedor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-100 text-gray-400 font-bold cursor-not-allowed" value={formData.sellerName} />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-100 text-gray-400 font-bold cursor-not-allowed" value={formData.sellerWhatsapp} />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <Tag className="w-4 h-4 text-brand-orange" /> O que você está vendendo?
                </h3>
                <div className="space-y-4">
                  <input name="title" required placeholder="Título (ex: Sofá 3 lugares cinza semi-novo)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple focus:bg-white outline-none font-bold text-gray-800 transition-all" value={formData.title} onChange={handleInputChange} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</div>
                      <input name="price" type="number" step="0.01" required placeholder="Preço" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple focus:bg-white outline-none font-bold transition-all" value={formData.price} onChange={handleInputChange} />
                    </div>
                    <div className="relative">
                      <select name="categoryId" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple focus:bg-white outline-none font-bold text-gray-700 appearance-none transition-all" value={formData.categoryId} onChange={handleInputChange}>
                        <option value="">Selecione a Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <Plus className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <select name="condition" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple focus:bg-white outline-none font-bold text-gray-700 appearance-none transition-all" value={formData.condition} onChange={handleInputChange}>
                    {Object.values(ItemStatus).map(status => <option key={status} value={status}>{status}</option>)}
                  </select>

                  <textarea name="description" rows={4} placeholder="Conte mais sobre o item (conservação, tempo de uso...)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple focus:bg-white outline-none font-medium text-gray-700 resize-none transition-all" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h3 className="text-sm font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <Camera className="w-4 h-4 text-brand-purple" /> Galeria de Fotos
                  </h3>
                  <span className="text-[10px] font-black text-brand-purple uppercase opacity-60">Mínimo 1 foto</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className={`relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-dashed transition-all duration-300 ${img ? 'border-brand-purple' : 'border-gray-200 bg-gray-50 hover:border-brand-purple/50'}`}>
                      {img ? (
                        <>
                          <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button type="button" onClick={() => removeImage(index)} className="p-2.5 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 transition-transform">
                               <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </>
                      ) : (
                        <button type="button" onClick={() => fileInputRefs.current[index]?.click()} className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-brand-purple group">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter">Foto {index + 1}</span>
                        </button>
                      )}
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

              <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-brand-orange hover:bg-brand-darkOrange text-white font-black rounded-[1.5rem] shadow-xl shadow-brand-orange/20 transition-all flex items-center justify-center uppercase tracking-widest active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Enviando foto {uploadProgress} de {images.filter(i => i).length}...</span>
                  </div>
                ) : (
                  "Publicar Anúncio Agora"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

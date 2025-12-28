
import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { ItemStatus, Product } from '../types';
import { Camera, Plus, Trash2, AlertTriangle, Loader2, CheckCircle2, User, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SellProps {
  onAddProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export const Sell: React.FC<SellProps> = ({ onAddProduct, onNavigate }) => {
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerWhatsapp: '',
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    condition: ItemStatus.NEW
  });

  const [images, setImages] = useState<( { preview: string; file: File } | null )[]>([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Você precisa estar logado para publicar um anúncio.");
      } else {
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          sellerName: user.user_metadata?.name || '',
          sellerWhatsapp: user.user_metadata?.whatsapp || ''
        }));
      }
    };
    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Imagem muito pesada (máx 10MB).");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = {
          preview: reader.result as string,
          file: file
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError("Você precisa estar logado para vender.");
      return;
    }

    const validImageObjects = images.filter(img => img !== null) as { preview: string; file: File }[];
    
    if (!formData.title || !formData.price || !formData.description || !formData.sellerName || !formData.sellerWhatsapp) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (validImageObjects.length === 0) {
      setError("Seu anúncio precisa de pelo menos uma foto original.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const imageUrls: string[] = [];

      for (let i = 0; i < validImageObjects.length; i++) {
        const item = validImageObjects[i];
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}-${i}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, item.file);

        if (uploadError) throw new Error("Falha no upload das fotos.");

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
        setUploadProgress(10 + ((i + 1) / validImageObjects.length) * 40);
      }

      const newProductData = {
        title: formData.title,
        description: `${formData.description}\n\nVendedor: ${formData.sellerName}\nWhats: ${formData.sellerWhatsapp}`,
        price: parseFloat(formData.price),
        images: imageUrls,
        category: formData.category,
        status: formData.condition,
        active: true,
        storeId: 'personal_1',
        userId: currentUser.id
      };

      const { data, error: dbError } = await supabase
        .from('products')
        .insert([newProductData])
        .select();

      if (dbError) throw dbError;

      setUploadProgress(100);
      setSuccess(true);
      
      setTimeout(() => {
        onAddProduct(data[0] as Product);
        onNavigate('offers');
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Erro ao salvar o anúncio. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Anúncio Publicado!</h2>
        <p className="text-gray-500">Sua oferta já está disponível para todos em Mogi.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-darkPurple p-10 text-white relative">
            <h1 className="text-3xl font-black mb-2">Vender um Item</h1>
            <p className="text-brand-lightPurple opacity-90">Anuncie e venda rápido em Mogi.</p>
            <Camera className="absolute -right-4 -bottom-4 w-40 h-40 opacity-5" />
          </div>

          {!currentUser ? (
            <div className="p-12 text-center space-y-6">
               <AlertTriangle className="w-16 h-16 text-brand-orange mx-auto" />
               <h2 className="text-2xl font-black text-gray-900">Acesso Restrito</h2>
               <p className="text-gray-500">Você precisa estar logado para publicar anúncios e garantir a segurança da nossa comunidade.</p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-brand-purple text-white font-bold rounded-2xl">Fazer Login</button>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center text-red-700 font-bold">
                  <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                  {error}
                </div>
              )}

              <section className="bg-brand-lightPurple/20 p-6 rounded-3xl border border-brand-purple/10 space-y-6">
                <h3 className="text-lg font-black text-brand-purple flex items-center gap-2">
                  <User className="w-5 h-5" /> Informações de Venda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Anunciante</label>
                    <input disabled className="w-full px-5 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 outline-none" value={formData.sellerName} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de Contato</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 outline-none" value={formData.sellerWhatsapp} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-brand-orange rounded-full"></div>
                  Fotos do Produto (Máx 3)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="relative aspect-square">
                      <input type="file" ref={fileInputRefs[idx]} onChange={(e) => handleFileChange(idx, e)} accept="image/*" className="hidden" />
                      {images[idx] ? (
                        <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-brand-purple/20 relative shadow-md">
                          <img src={images[idx]!.preview} className="w-full h-full object-cover" alt="Preview" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition shadow-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileInputRefs[idx].current?.click()} className="w-full h-full rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-brand-purple hover:bg-brand-lightPurple/20 transition-all group">
                          <Plus className="w-8 h-8 text-brand-purple group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adicionar Foto</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Título do Anúncio *</label>
                    <input name="title" required placeholder="Ex: Bicicleta Aro 29" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none" value={formData.title} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preço (R$) *</label>
                    <input type="number" name="price" required placeholder="0,00" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none" value={formData.price} onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Categoria *</label>
                    <select name="category" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none" value={formData.category} onChange={handleInputChange}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Estado de Conservação *</label>
                    <select name="condition" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none" value={formData.condition} onChange={handleInputChange}>
                      {Object.values(ItemStatus).map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Descrição do Produto *</label>
                  <textarea name="description" required rows={4} placeholder="Conte detalhes..." className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand-purple outline-none resize-none" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </section>

              <div className="space-y-4">
                <button type="submit" disabled={isSubmitting} className={`w-full py-6 rounded-3xl font-black text-white shadow-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-brand-purple/50 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-darkOrange'}`}>
                  {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Enviando...</> : "Publicar Anúncio"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

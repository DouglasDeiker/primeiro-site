
import React, { useState, useRef, useEffect } from 'react';
import { ItemStatus, Product, Category } from '../types';
import { Camera, Plus, Trash2, AlertTriangle, Loader2, CheckCircle2, User, Phone } from 'lucide-react';
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

  const [images, setImages] = useState<( { preview: string; file: File } | null )[]>([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          sellerName: user.user_metadata?.name || '',
          sellerWhatsapp: user.user_metadata?.whatsapp || '',
          categoryId: categories.length > 0 ? categories[0].id : ''
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUser) return setError("Faça login para vender.");

    const validImageObjects = images.filter(img => img !== null) as { preview: string; file: File }[];
    if (!formData.title || !formData.price || !formData.categoryId) return setError("Preencha todos os campos.");
    if (validImageObjects.length === 0) return setError("Adicione pelo menos uma foto.");

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < validImageObjects.length; i++) {
        const item = validImageObjects[i];
        const fileName = `${currentUser.id}/${Date.now()}-${i}.${item.file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, item.file);
        if (uploadError) throw new Error(`Erro na foto ${i+1}: ${uploadError.message}`);
        imageUrls.push(supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl);
        setUploadProgress(10 + ((i + 1) / validImageObjects.length) * 40);
      }

      // IMPORTANTE: Aqui enviamos o categoryId (UUID) para a coluna 'category' do banco
      const { data, error: dbError } = await supabase.from('products').insert([{
        title: formData.title,
        description: `${formData.description}\n\nVendedor: ${formData.sellerName}\nWhats: ${formData.sellerWhatsapp}`,
        price: parseFloat(formData.price),
        images: imageUrls,
        category: formData.categoryId, // O banco espera UUID aqui
        status: formData.condition,
        active: true,
        storeId: 'personal_1',
        userId: currentUser.id
      }]).select();

      if (dbError) throw dbError;

      setUploadProgress(100);
      setSuccess(true);
      setTimeout(() => {
        const selectedCat = categories.find(c => c.id === formData.categoryId);
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
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-darkPurple p-10 text-white relative">
            <h1 className="text-3xl font-black mb-2">Vender um Item</h1>
            <p className="text-brand-lightPurple opacity-90">Anuncie e venda rápido.</p>
          </div>

          {!currentUser ? (
            <div className="p-12 text-center space-y-6">
               <AlertTriangle className="w-16 h-16 text-brand-orange mx-auto" />
               <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-brand-purple text-white font-bold rounded-2xl">Fazer Login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {error && <div className="bg-red-50 p-4 rounded-2xl text-red-700 font-bold flex gap-2"><AlertTriangle /> {error}</div>}
              
              <section className="bg-brand-lightPurple/20 p-6 rounded-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input disabled className="w-full px-5 py-4 rounded-2xl bg-gray-100 border text-gray-500" value={formData.sellerName} />
                  <input disabled className="w-full px-5 py-4 rounded-2xl bg-gray-100 border text-gray-500" value={formData.sellerWhatsapp} />
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="relative aspect-square">
                    <input type="file" ref={fileInputRefs[idx]} onChange={(e) => handleFileChange(idx, e)} accept="image/*" className="hidden" />
                    {images[idx] ? (
                      <div className="w-full h-full rounded-3xl overflow-hidden border relative">
                        <img src={images[idx]!.preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRefs[idx].current?.click()} className="w-full h-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-brand-lightPurple/20 transition-all"><Plus /> <span>Foto</span></button>
                    )}
                  </div>
                ))}
              </section>

              <section className="space-y-6">
                <input name="title" required placeholder="Título do Anúncio" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" value={formData.title} onChange={handleInputChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="number" name="price" required placeholder="Preço (R$)" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" value={formData.price} onChange={handleInputChange} />
                  <select name="categoryId" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none" value={formData.categoryId} onChange={handleInputChange}>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <textarea name="description" required rows={4} placeholder="Descrição..." className="w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none resize-none" value={formData.description} onChange={handleInputChange}></textarea>
              </section>

              <button type="submit" disabled={isSubmitting} className="w-full py-6 rounded-3xl font-black text-white bg-brand-orange hover:bg-brand-darkOrange shadow-xl flex items-center justify-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Publicar Anúncio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

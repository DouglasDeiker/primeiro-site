
import React, { useState } from 'react';
import { LogIn, Mail, Lock, ArrowLeft, Loader2, AlertCircle, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (data.user) {
        const loggedUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'Usuário',
          email: data.user.email || '',
          whatsapp: data.user.user_metadata?.whatsapp || '',
          role: 'cliente',
          photoUrl: data.user.user_metadata?.photoUrl
        };
        onLoginSuccess(loggedUser);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all text-gray-900 font-semibold placeholder:font-normal placeholder:text-gray-400";

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mb-6">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-brand-purple font-bold hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar para o Início
        </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-brand-darkPurple p-10 text-white relative">
          <h1 className="text-3xl font-black mb-2">Entrar</h1>
          <p className="text-brand-lightPurple opacity-80">Bom ver você de volta!</p>
          <LogIn className="absolute right-8 bottom-8 w-12 h-12 opacity-10" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2 border border-red-100 animate-pulse">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="Seu e-mail" 
                className={inputClasses} 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Sua senha" 
                className={inputClasses} 
                value={formData.password} 
                onChange={handleInputChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-purple transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-5 bg-brand-purple hover:bg-brand-darkPurple text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center uppercase tracking-widest active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Acessar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
};

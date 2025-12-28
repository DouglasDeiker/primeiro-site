
import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Phone, User as UserIcon, Loader2, AlertCircle, ChevronLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onNavigate: (page: string) => void;
  onRegisterSuccess: (user: User) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    if (formData.whatsapp.length < 10) {
      setError("Por favor, insira um WhatsApp válido com DDD.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            whatsapp: formData.whatsapp
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        if (data.session) {
          const newUser: User = {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            role: 'cliente'
          };
          onRegisterSuccess(newUser);
        } else {
          setNeedsConfirmation(true);
        }
      }
    } catch (err: any) {
      setError(err.message === 'User already registered' ? 'Este e-mail já está cadastrado.' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Verifique seu E-mail</h2>
          <p className="text-gray-500 mb-8">Enviamos um link de confirmação para <b>{formData.email}</b>. Clique nele para ativar sua conta e começar a vender.</p>
          <button onClick={() => onNavigate('login')} className="w-full py-4 bg-brand-purple text-white font-bold rounded-2xl">Ir para Login</button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-black mb-2">Cadastrar</h1>
          <p className="text-brand-lightPurple opacity-80">Crie sua conta no Barganha Mogi.</p>
          <UserPlus className="absolute right-8 bottom-8 w-12 h-12 opacity-10" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="name" 
                required 
                placeholder="Nome Completo" 
                className={inputClasses} 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="Seu melhor e-mail" 
                className={inputClasses} 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="whatsapp" 
                type="tel" 
                required 
                placeholder="WhatsApp (DDD + Número)" 
                className={inputClasses} 
                value={formData.whatsapp} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple w-5 h-5 transition-colors" />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Senha (mín. 6 caracteres)" 
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
            className="w-full py-5 bg-brand-orange hover:bg-brand-darkOrange text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center uppercase tracking-widest active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Criar Minha Conta"}
          </button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => onNavigate('login')} 
              className="text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors"
            >
              Já tem uma conta? <span className="text-brand-purple">Faça Login aqui</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

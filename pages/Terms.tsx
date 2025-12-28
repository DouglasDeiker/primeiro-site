import React from 'react';
import { ScrollText, ShieldCheck, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface TermsProps {
  onNavigate: (page: string) => void;
}

export const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-brand-purple font-bold mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Início
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-brand-darkPurple p-8 md:p-12 text-white">
            <h1 className="text-3xl font-extrabold mb-2 flex items-center">
              <ScrollText className="w-8 h-8 mr-3 text-brand-orange" />
              Termos de Uso
            </h1>
            <p className="text-brand-lightPurple opacity-80">Regras e diretrizes do Barganha Mogi.</p>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            <section className="space-y-4">
              <div className="flex items-center text-brand-purple mb-4">
                <ShieldCheck className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">1. Nossa Missão</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                O Barganha Mogi é uma plataforma de classificados local focada em Mogi das Cruzes. Nosso objetivo é facilitar a economia circular e o comércio justo entre os moradores da região.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center text-brand-orange mb-4">
                <UserCheck className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">2. Responsabilidade</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A plataforma atua como intermediária de informações. Toda negociação de preço, forma de pagamento e entrega é de responsabilidade mútua entre o comprador e o vendedor (equipe Barganha Mogi).
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center text-red-500 mb-4">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">3. Segurança</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Recomendamos sempre que a troca de produtos e pagamentos ocorra em locais públicos e seguros. Nunca envie pagamentos antecipados sem ter certeza da procedência do negócio.
              </p>
            </section>

            <div className="border-t border-gray-100 pt-10 text-sm text-gray-400">
              <p>Última atualização: Outubro de 2023. O uso continuado da plataforma implica na aceitação destes termos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
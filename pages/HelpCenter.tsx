
import React from 'react';
import { HelpCircle, MessageCircle, ShieldCheck, ShoppingBag, ArrowLeft, Lightbulb } from 'lucide-react';

interface HelpCenterProps {
  onNavigate: (page: string) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const faqs = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-brand-purple" />,
      question: "Como faço para comprar?",
      answer: "Navegue pelas nossas ofertas, escolha o produto que deseja e clique no botão 'Negociar'. Você será redirecionado para o WhatsApp do nosso time para finalizar a compra."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-brand-orange" />,
      question: "Posso negociar o valor?",
      answer: "Sim! Como o próprio nome diz, adoramos uma barganha. Fale com nosso time pelo WhatsApp e veja as condições disponíveis para o produto do seu interesse."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      question: "É seguro comprar aqui?",
      answer: "O Barganha Mogi é focado na região de Mogi das Cruzes. Facilitamos o contato direto e a entrega em pontos conhecidos, garantindo que você veja o produto antes de finalizar o pagamento."
    }
  ];

  const handleSuggestion = () => {
    const message = "Olá! Tenho uma sugestão de melhoria para o site Barganha Mogi: ";
    const phoneNumber = "5511999812223"; 
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

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
          <div className="bg-brand-darkPurple p-8 md:p-12 text-white relative">
            <h1 className="text-3xl font-extrabold mb-2 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-brand-orange" />
              Central de Ajuda
            </h1>
            <p className="text-brand-lightPurple opacity-80">Tudo o que você precisa saber para fazer um bom negócio em Mogi.</p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-purple/20 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    {faq.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-lightPurple/30 border border-brand-purple/10 p-8 rounded-2xl text-center">
                <h3 className="font-bold text-brand-purple text-xl mb-2">Dúvidas?</h3>
                <p className="text-gray-600 mb-6">Fale com nosso time de suporte.</p>
                <a 
                  href="https://wa.me/5511999812223" 
                  target="_blank" 
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
                >
                  Suporte
                </a>
              </div>

              <div className="bg-orange-50 border border-brand-orange/10 p-8 rounded-2xl text-center">
                <h3 className="font-bold text-brand-orange text-xl mb-2 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 mr-2" /> Sugestões?
                </h3>
                <p className="text-gray-600 mb-6">Ajude o Barganha Mogi a crescer.</p>
                <button 
                  onClick={handleSuggestion}
                  className="inline-flex items-center bg-brand-orange hover:bg-brand-darkOrange text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
                >
                  Enviar Sugestão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

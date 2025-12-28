
import React from 'react';
import { BookOpen, Code, Smartphone, Palette, MessageCircle, List, ArrowLeft, Search } from 'lucide-react';

interface DocumentationProps {
  onNavigate: (page: string) => void;
}

export const Documentation: React.FC<DocumentationProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: "1. Como mudar o WhatsApp?",
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      file: "App.tsx, Offers.tsx, Sell.tsx, HelpCenter.tsx",
      explanation: "Procure pelo número '5511999812223'. O '55' é o Brasil, o '11' é o DDD e o restante é o número. Altere em todos os arquivos onde ele aparece para que os botões funcionem com o seu celular.",
    },
    {
      title: "2. Como mudar o Nome e as Cores?",
      icon: <Palette className="w-6 h-6 text-brand-purple" />,
      file: "index.html e App.tsx",
      explanation: "No arquivo 'index.html', procure por 'brand-purple' (roxo) ou 'brand-orange' (laranja) para mudar as cores. Para o nome, procure por 'Barganha' e 'Mogi' no App.tsx e na Navbar.tsx.",
    },
    {
      title: "3. Como adicionar Categorias?",
      icon: <List className="w-6 h-6 text-blue-500" />,
      file: "constants.ts",
      explanation: "Procure a lista 'CATEGORIES'. Basta adicionar o nome da nova categoria entre aspas e separado por vírgula. Exemplo: 'Moda', 'Pets'.",
    },
    {
      title: "4. Como funciona o botão de Busca (Lupa)?",
      icon: <Search className="w-6 h-6 text-brand-purple" />,
      file: "App.tsx e Offers.tsx",
      explanation: "Ao clicar na lupa da Navbar, o App.tsx dispara um 'searchFocusTrigger'. A página de Ofertas percebe essa mudança e usa uma 'ref' (referência) para colocar o cursor automaticamente dentro da caixa de texto.",
    },
    {
      title: "5. Como o site troca de página?",
      icon: <Smartphone className="w-6 h-6 text-brand-orange" />,
      file: "App.tsx",
      explanation: "O site usa um 'Interruptor' chamado 'currentPage'. Quando você clica num botão, ele avisa esse interruptor para mostrar a página 'home', 'offers' ou 'sell'.",
    }
  ];

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-brand-purple font-bold mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Site
        </button>

        <header className="mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-brand-purple p-3 rounded-2xl text-white">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">Guia de Manutenção</h1>
          </div>
          <p className="text-gray-500 text-lg">Este guia foi criado para que você entenda como o site funciona por baixo dos panos, mesmo sem saber programar.</p>
        </header>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                {section.icon}
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="flex items-center gap-2 mb-4 bg-white self-start px-3 py-1 rounded-full border border-gray-100 w-fit">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-500">Arquivo: {section.file}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{section.explanation}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-brand-darkPurple rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-4">Dica de Ouro:</h3>
          <p className="opacity-80">Sempre que for fazer uma alteração, mude apenas o que está entre as aspas (" "). Se apagar um símbolo como vírgula (,) ou chaves ({}), o site pode parar de funcionar!</p>
        </div>
      </div>
    </div>
  );
};

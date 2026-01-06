
import { Product, Store } from './types';

// LISTA DE CATEGORIAS (Fallback e Exibição)
export const CATEGORIES = [
  'Móveis', 
  'Eletrônicos', 
  'Eletrodomésticos',
  'Ferramentas',
  'Antiguidades',
  'Roupas', 
  'Esporte', 
  'Decoração', 
  'Instrumentos',
  'Automotivo',
  'Infantil',
  'Livros',
  'Variados'
];

// LISTA DE LOJAS PARCEIRAS
export const STORES: Store[] = [
  {
    id: 'personal_1',
    name: 'Barganha Mogi Oficial',
    location: 'Centro, Mogi das Cruzes',
    description: 'As melhores ofertas selecionadas pela nossa equipe diretamente para você.',
    rating: 5.0
  }
];

export const PRODUCTS: Product[] = [];

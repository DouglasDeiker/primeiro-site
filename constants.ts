
import { Product, Store } from './types';

// LISTA DE CATEGORIAS (Fallback e Exibição)
export const CATEGORIES = [
  'Antiguidades',
  'Automotivo',
  'Decoração',
  'Eletrodomésticos',
  'Eletrônicos', 
  'Esporte', 
  'Ferramentas',
  'Infantil',
  'Instrumentos',
  'Livros',
  'Móveis', 
  'Roupas', 
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

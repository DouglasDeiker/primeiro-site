
import { Product, Store } from './types';

// LISTA DE CATEGORIAS
export const CATEGORIES = [
  'Móveis', 
  'Eletrônicos', 
  'Roupas', 
  'Esporte', 
  'Decoração', 
  'Instrumentos',
  'Automotivo',
  'Infantil',
  'Livros'
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

/**
 * PRODUTOS INICIAIS
 * Removidos para carregar exclusivamente do Supabase.
 */
export const PRODUCTS: Product[] = [];

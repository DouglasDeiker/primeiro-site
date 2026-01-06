
/**
 * Definições de Tipos Globais
 */

export type UserRole = 'admin' | 'lojista' | 'cliente';

export interface User {
  id: string; // ID de usuário permanece string pois vem do Auth (UUID)
  name: string;
  email: string;
  role: UserRole;
  whatsapp: string;
  photoUrl?: string; 
}

export interface Category {
  id: number; 
  name: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
}

export enum ItemStatus {
  NEW = 'Novo',
  LIKE_NEW = 'Como Novo',
  GOOD = 'Bom Estado',
  FAIR = 'Marcas de Uso'
}

export interface Product {
  id: number;
  storeId: string;
  userId?: string; 
  title: string;
  description: string;
  price: number;
  images: string[]; // Sempre uma lista de strings
  category: string; // Nome para exibição (ex: "Eletrônicos")
  category_id?: number; 
  status: ItemStatus;
  createdAt: string;
  active: boolean; 
}

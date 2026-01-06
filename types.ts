
/**
 * Definições de Tipos Globais
 */

export type UserRole = 'admin' | 'lojista' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsapp: string;
  photoUrl?: string; 
}

export interface Category {
  id: string;
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
  id: string;
  storeId: string;
  userId?: string; 
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string; // Nome para exibição
  categoryId?: string; // ID (UUID) para o banco
  status: ItemStatus;
  createdAt: string;
  active: boolean; 
}

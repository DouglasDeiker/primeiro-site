
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO DO SUPABASE
 * -------------------------------------------------------------------------
 */

// URL do seu projeto Supabase
const URL_PROJETO: string = 'https://oeabzurdacfmzczwhpfa.supabase.co'; 

/**
 * CHAVE_ANON configurada com sucesso!
 */
export const CHAVE_ANON: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYWJ6dXJkYWNmbXpjendocGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4OTg0ODEsImV4cCI6MjA4MjQ3NDQ4MX0.cYg2M6wD8aIdlwXsdAZk2llv3SMsc0N8OhcQuzhV5c0'; 

// Inicialização do cliente Supabase
export const supabase = createClient(URL_PROJETO, CHAVE_ANON);

/**
 * isDatabaseConfigured: Verifica se a chave inserida tem o formato correto do Supabase.
 */
export const isDatabaseConfigured = 
  URL_PROJETO.includes('supabase.co') && 
  CHAVE_ANON.length > 50 &&
  CHAVE_ANON.startsWith('eyJ');

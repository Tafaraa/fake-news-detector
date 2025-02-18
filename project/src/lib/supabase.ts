import { createClient } from '@supabase/supabase-js';
import type { Article } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveArticle(article: Omit<Article, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getArticleHistory() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
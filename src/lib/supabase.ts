import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables - add to .env.local:
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10;

// Export a real client or a safe stub that never throws
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key-for-build');


// Database Types
export type Donor = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  created_at: string;
  total_donated: number;
  donation_count: number;
  status: 'active' | 'inactive';
};

export type Donation = {
  id: string;
  donor_id: string;
  amount: number;
  program: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  stripe_payment_id?: string;
  receipt_number: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  title: string;
  category: string;
  uploaded_by: string;
  created_at: string;
};

export type Article = {
  id: string;
  type: 'article' | 'news' | 'blog' | 'story';
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featured_image?: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
};

// Auth helpers
export const signUp = async (email: string, password: string, metadata: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Donor operations
export const getDonorProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data, error };
};

export const updateDonorProfile = async (userId: string, updates: Partial<Donor>) => {
  const { data, error } = await supabase
    .from('donors')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const getDonorDonations = async (donorId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', donorId)
    .order('date', { ascending: false });
  return { data, error };
};

// Admin operations
export const getAllDonors = async () => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const registerAdmin = async (
  secretCode: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  location?: string
) => {
  const { data, error } = await supabase.rpc('register_admin', { 
    secret_code: secretCode,
    p_first_name: firstName,
    p_last_name: lastName,
    p_phone: phone,
    p_location: location
  });
  return { data, error };
};

export const createDonor = async (donor: Omit<Donor, 'created_at'>) => {
  const { data, error } = await supabase
    .from('donors')
    .insert(donor)
    .select()
    .single();
  return { data, error };
};

export const deleteDonor = async (donorId: string) => {
  const { error } = await supabase
    .from('donors')
    .delete()
    .eq('id', donorId);
  return { error };
};

// Gallery operations
export const uploadImage = async (file: File, metadata: { title: string; alt: string; category: string }) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) return { data: null, error: uploadError };

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      url: publicUrl,
      ...metadata,
      uploaded_by: (await getCurrentUser()).user?.id
    })
    .select()
    .single();

  return { data, error };
};

export const getGalleryImages = async (category?: string) => {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  return { data, error };
};

export const deleteImage = async (imageId: string) => {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId);
  return { error };
};

// Article operations
export const createArticle = async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single();
  return { data, error };
};

export const updateArticle = async (articleId: string, updates: Partial<Article>) => {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', articleId)
    .select()
    .single();
  return { data, error };
};

export const getArticles = async (type?: string, status?: string) => {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (type) query = query.eq('type', type);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  return { data, error };
};

export const deleteArticle = async (articleId: string) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);
  return { error };
};

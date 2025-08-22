import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  emoji: string;
  intensity: number;
  notes?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  sentiment?: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_login?: string;
}

export interface MentalHealthResource {
  id: string;
  title: string;
  description: string;
  category: 'articles' | 'hotlines' | 'self-help' | 'emergency';
  content: string;
  url?: string;
  created_at: string;
}
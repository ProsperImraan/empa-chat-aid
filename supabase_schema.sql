-- Mental Health Chatbot Database Schema
-- This file contains the SQL commands to set up the database schema in Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Create mood_entries table
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  emoji TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mental_health_resources table
CREATE TABLE mental_health_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('articles', 'hotlines', 'self-help', 'emergency')),
  content TEXT,
  url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table (for admin panel access)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Mood entries policies
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood entries." 
ON mood_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries." 
ON mood_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries." 
ON mood_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries." 
ON mood_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Chat messages policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages." 
ON chat_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages." 
ON chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Mental health resources policies (public read, admin write)
ALTER TABLE mental_health_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone." 
ON mental_health_resources FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage resources." 
ON mental_health_resources FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

-- Admin users policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin users." 
ON admin_users FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

-- Functions

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update last_login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_login = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for better performance
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON mood_entries(created_at);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_sentiment ON chat_messages(sentiment);

-- Insert sample mental health resources
INSERT INTO mental_health_resources (title, description, category, content, url) VALUES
('National Suicide Prevention Lifeline', '24/7 crisis support for those in emotional distress', 'emergency', 'Call 988 for immediate help', 'https://suicidepreventionlifeline.org'),
('Crisis Text Line', 'Free, confidential crisis support via text', 'emergency', 'Text HOME to 741741', 'https://crisistextline.org'),
('Understanding Anxiety', 'Learn about anxiety symptoms and management', 'articles', 'Comprehensive guide to understanding and managing anxiety disorders...', 'https://example.com/anxiety-guide'),
('Mindfulness Meditation Guide', 'Introduction to mindfulness practices', 'self-help', 'Step-by-step guide to practicing mindfulness meditation...', 'https://example.com/mindfulness'),
('National Alliance on Mental Illness', 'Support groups and resources', 'hotlines', 'NAMI provides support and education for mental health', 'https://nami.org');

-- Views for analytics

-- User activity summary view
CREATE VIEW user_activity_summary AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at as joined_date,
  p.last_login,
  COUNT(DISTINCT me.id) as mood_entries_count,
  COUNT(DISTINCT cm.id) as chat_messages_count,
  MAX(me.created_at) as last_mood_entry,
  MAX(cm.created_at) as last_chat_message
FROM profiles p
LEFT JOIN mood_entries me ON p.id = me.user_id
LEFT JOIN chat_messages cm ON p.id = cm.user_id
GROUP BY p.id, p.email, p.full_name, p.created_at, p.last_login;

-- Mood trends view
CREATE VIEW mood_trends AS
SELECT 
  DATE(created_at) as date,
  mood,
  COUNT(*) as count,
  AVG(intensity) as avg_intensity
FROM mood_entries
GROUP BY DATE(created_at), mood
ORDER BY date DESC;

-- Sentiment analysis view
CREATE VIEW sentiment_analysis AS
SELECT 
  DATE(created_at) as date,
  sentiment,
  COUNT(*) as count
FROM chat_messages
WHERE sentiment IS NOT NULL
GROUP BY DATE(created_at), sentiment
ORDER BY date DESC;
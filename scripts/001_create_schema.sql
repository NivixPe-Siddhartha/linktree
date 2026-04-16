-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create link_clicks table for analytics
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_public" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Links policies
CREATE POLICY "links_select_public" ON public.links 
  FOR SELECT USING (true);

CREATE POLICY "links_insert_own" ON public.links 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "links_update_own" ON public.links 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "links_delete_own" ON public.links 
  FOR DELETE USING (auth.uid() = user_id);

-- Link clicks policies (anyone can insert for tracking, only owner can view)
CREATE POLICY "link_clicks_insert_public" ON public.link_clicks 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "link_clicks_select_own" ON public.link_clicks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = link_clicks.link_id 
      AND links.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(user_id, position);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON public.link_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS links_updated_at ON public.links;
CREATE TRIGGER links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

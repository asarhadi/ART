-- Fix infinite recursion in user_profiles RLS policies
-- This script completely removes all existing policies and creates simple, non-recursive ones

-- Drop all existing policies on user_profiles to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.user_profiles;

-- Drop the problematic function if it exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Create simple, non-recursive RLS policies
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile (for auto-creation)
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can do everything (for admin operations via service key)
-- This allows backend operations with service role key to bypass RLS
-- No policy needed - service role bypasses RLS by default

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace the function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user', -- Default role is 'user'
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

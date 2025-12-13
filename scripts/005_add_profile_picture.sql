-- Add profile_picture_url column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add comment
COMMENT ON COLUMN user_profiles.profile_picture_url IS 'URL to user profile picture stored in Vercel Blob';

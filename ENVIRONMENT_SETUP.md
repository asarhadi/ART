# Environment Variables Setup

## Required Supabase Environment Variables

For the admin portal and ticketing system to work properly, you need to add the following environment variables to your Vercel project:

### Client-Side Variables (Required for Browser)

Add these in your Vercel project settings under **Environment Variables**:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Copy from your existing `SUPABASE_URL` variable
   - Or get it from: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Copy from your existing `SUPABASE_ANON_KEY` variable
   - Or get it from: Supabase Dashboard → Project Settings → API → anon/public key

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Click **Add New** button
5. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Environment: Select all (Production, Preview, Development)
6. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click **Save**
8. Redeploy your application for changes to take effect

### Why NEXT_PUBLIC_ Prefix?

Next.js requires the `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in the browser (client-side code). The admin login page runs in the browser, so it needs these prefixed variables.

### Fallback Behavior

The code will automatically fall back to non-prefixed variables (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) if the `NEXT_PUBLIC_` versions are not found, but this only works for server-side code. Client-side code (like the admin login page) **requires** the `NEXT_PUBLIC_` prefixed variables.

### Verification

After adding the variables and redeploying, you can verify they're working by:
1. Visiting the admin login page at `/admin/login`
2. The page should load without errors
3. You should be able to attempt login (after creating an admin user)

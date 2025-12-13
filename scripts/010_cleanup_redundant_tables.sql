-- Cleanup script to remove redundant and unused tables
-- This consolidates functionality and removes duplicates

-- Drop unused tables that overlap with ticket_replies and ticket_notes
DROP TABLE IF EXISTS public.admin_notes CASCADE;
DROP TABLE IF EXISTS public.ticket_comments CASCADE;

-- The technicians table is actually a view created in script 009, but if a table exists, drop it
DROP TABLE IF EXISTS public.technicians CASCADE;

-- Recreate the technicians view (in case it was dropped)
CREATE OR REPLACE VIEW public.technicians AS
SELECT 
  up.id,
  up.full_name,
  up.email,
  up.role
FROM public.user_profiles up
WHERE up.role IN ('admin', 'user')
ORDER BY up.full_name;

-- Grant access to the view
GRANT SELECT ON public.technicians TO authenticated, anon;

-- Add comment to document the cleanup
COMMENT ON VIEW public.technicians IS 'View of users who can be assigned to tickets. Replaces the redundant technicians table.';

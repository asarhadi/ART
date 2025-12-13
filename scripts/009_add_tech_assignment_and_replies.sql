-- Add tech_assigned_to column to tickets table
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS tech_assigned_to UUID REFERENCES auth.users(id);

-- Create index for tech assignment
CREATE INDEX IF NOT EXISTS idx_tickets_tech_assigned ON public.tickets(tech_assigned_to);

-- Create ticket_replies table for admin/tech responses
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal notes vs customer-facing replies
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_created_at ON public.ticket_replies(created_at DESC);

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Allow viewing replies for tickets
CREATE POLICY "Allow viewing ticket replies" ON public.ticket_replies
  FOR SELECT
  USING (true);

-- Allow authenticated users to add replies
CREATE POLICY "Allow adding ticket replies" ON public.ticket_replies
  FOR INSERT
  WITH CHECK (true);

-- Update trigger for ticket_replies
CREATE TRIGGER update_ticket_replies_updated_at
  BEFORE UPDATE ON public.ticket_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view to get technician list (users with admin or tech role)
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

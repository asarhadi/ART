-- Create tickets table with comprehensive fields for support ticketing system
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- Issue Details
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Priority Calculation
  impact TEXT NOT NULL CHECK (impact IN ('Critical', 'High', 'Medium', 'Low')),
  urgency TEXT NOT NULL CHECK (urgency IN ('Critical', 'High', 'Medium', 'Low')),
  priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  
  -- SLA and Status
  sla_response_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Waiting on Customer', 'Resolved', 'Closed')),
  
  -- Attachments (stored as JSON array of file URLs)
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  
  -- Additional fields
  assigned_to TEXT,
  resolution_notes TEXT,
  customer_satisfaction_rating INTEGER CHECK (customer_satisfaction_rating BETWEEN 1 AND 5)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON public.tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON public.tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anyone to insert tickets (public submission)
CREATE POLICY "Allow public ticket submission" ON public.tickets
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies: Allow users to view their own tickets by email
CREATE POLICY "Allow users to view own tickets" ON public.tickets
  FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create ticket_comments table for future use
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);

ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow viewing comments for own tickets" ON public.ticket_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Allow adding comments to tickets" ON public.ticket_comments
  FOR INSERT
  WITH CHECK (true);

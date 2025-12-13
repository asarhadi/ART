-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to view all tickets
CREATE POLICY "Admin users can view all tickets"
ON tickets FOR SELECT
TO authenticated
USING (true);

-- Create a policy that allows authenticated users to update tickets
CREATE POLICY "Admin users can update tickets"
ON tickets FOR UPDATE
TO authenticated
USING (true);

-- Create a policy that allows anyone to insert tickets (for public submission)
CREATE POLICY "Anyone can create tickets"
ON tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create admin_notes table for internal notes
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_notes
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view and create admin notes
CREATE POLICY "Admin users can view notes"
ON admin_notes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin users can create notes"
ON admin_notes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_admin_notes_ticket_id ON admin_notes(ticket_id);

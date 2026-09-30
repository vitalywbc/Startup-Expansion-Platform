-- Verynta launch migration. Run once in the Supabase SQL editor.
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS channel           text DEFAULT 'creative_valley',
  ADD COLUMN IF NOT EXISTS company_type      text DEFAULT 'startup',
  ADD COLUMN IF NOT EXISTS notes             text,
  ADD COLUMN IF NOT EXISTS paid              boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_at           timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS amount_paid       integer;  -- in cents, incl. any VAT

-- Every row that existed before launch came through Creative Valley.
UPDATE submissions SET channel = 'creative_valley' WHERE channel IS NULL;

-- The existing "Allow public inserts" policy stays as it is.
-- Payment status is written only by the server (service role key), which bypasses RLS.

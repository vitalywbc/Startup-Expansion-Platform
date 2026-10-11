ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS plan_paid              boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS plan_paid_at           timestamptz,
  ADD COLUMN IF NOT EXISTS plan_amount_paid       integer,
  ADD COLUMN IF NOT EXISTS plan_stripe_session_id text,
  ADD COLUMN IF NOT EXISTS credit_used            boolean DEFAULT false;

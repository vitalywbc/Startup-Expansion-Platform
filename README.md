# Startup Expansion Platform — Intake Form

Captures startup profile data, calculates a preliminary France-market readiness score, and stores submissions in Supabase with email notifications via Resend.

## Stack

- React (Vite) — no TypeScript
- Supabase — response storage
- Resend — admin email notification (via Vercel serverless function)
- Vercel — deployment

## Setup

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase anon/public key |
| `RESEND_API_KEY` | Server only | Resend API key (used in `/api/send-email`) |
| `ADMIN_EMAIL` | Server only | Email address for submission notifications |

Set all four in the Vercel dashboard for production.

## Supabase table SQL

Run this in the Supabase SQL editor:

```sql
CREATE TABLE submissions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),
  source           text,
  company_name     text,
  country          text,
  sector           text,
  employees        text,
  revenue          text,
  intl_revenue     text,
  expansion_exp    text,
  france_drivers   text[],
  gateway_countries text[],
  timeline         text,
  support_needed   text[],
  main_concern     text,
  france_connections text,
  contact_name     text,
  contact_email    text,
  contact_alt      text,
  score_market     integer,
  score_intl       integer,
  score_intent     integer,
  score_network    integer,
  score_readiness  integer
);

-- Allow inserts from the anon key (public form)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON submissions FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Source tagging

Append `?source=vivatech` (or any tag) to the URL. Stored automatically with every submission. Defaults to `direct` if absent.

## Deployment

1. Push to GitHub
2. Connect the repo in Vercel
3. Set environment variables in the Vercel dashboard
4. Deploy — `vercel.json` handles SPA routing

## Project structure

```
src/
  App.jsx            — form state, step navigation, submission
  index.css          — all styles, CSS variables for colour tokens
  lib/
    supabase.js      — Supabase client
    scoring.js       — five-dimension score calculation
    source.js        — URL source parameter extraction
  components/
    Header.jsx       — navy header with gold eyebrow
    ProgressBar.jsx  — step X of 4 with percentage bar
    StepOne.jsx      — company profile questions
    StepTwo.jsx      — international expansion questions
    StepThree.jsx    — support needs questions
    StepFour.jsx     — contact details
    SingleSelect.jsx — reusable radio-style selector
    MultiSelect.jsx  — reusable checkbox-style selector
    ResultScreen.jsx — score bars and CTA
api/
  send-email.js      — Vercel serverless function (Resend)
```

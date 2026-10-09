# Verynta launch checklist

The code serves two sites from one deployment:
- `*.vercel.app` → the original intake (Creative Valley), unchanged, tagged `channel = creative_valley`
- `expansion.verynta.com` → the Verynta site with the paid flow, tagged `channel = direct_paid`

Local testing of the Verynta site: `npm run dev`, then open `http://localhost:5173/?site=verynta`
(`?site=legacy` switches back). Payments need `vercel dev` or a deployment, because they use `/api`.

## 1. Supabase
Run `supabase/2026-10-verynta.sql` in the SQL editor.
Copy the **service_role** key (Project Settings → API) for step 3. It must never go into a `VITE_` variable.

## 2. Stripe (account in the name of Vitaliy Charushin EI), in TEST mode first
1. Settings → Tax: set the origin address (your professional address) and add the France registration. Turn Stripe Tax on.
2. Product catalogue → Add product "Readiness assessment — France":
   one-off price **39.00 EUR**, tax behaviour **Exclusive**, tax code **General – Services**.
   Copy the price ID (`price_…`).
3. Developers → API keys: copy the secret key (`sk_test_…`).
4. After the first deploy on expansion.verynta.com: Developers → Webhooks → Add endpoint
   `https://expansion.verynta.com/api/stripe-webhook`, event `checkout.session.completed`.
   Copy the signing secret (`whsec_…`).
5. Settings → Branding and public details: name "Verynta", statement descriptor "VERYNTA".

## 3. Vercel
1. Upgrade the project to Pro (commercial use).
2. Settings → Domains: add `expansion.verynta.com`; copy the DNS records into GoDaddy
   (first disconnect the GoDaddy website-builder site from the domain).
3. Settings → Environment Variables (Production), see `.env.example`:
   `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`,
   `EMAIL_FROM` (`Verynta <hello@verynta.com>`), `SITE_URL` (`https://expansion.verynta.com`),
   plus the existing `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`.
4. Redeploy after changing variables.

## 4. Resend
Domains → Add `verynta.com`, copy the DNS records into GoDaddy, wait for "Verified".
Create an API key and set `RESEND_API_KEY` in Vercel.

## 5. Legal pages
Fill every `[BRACKETED]` field in `src/verynta/pages/Legal.jsx` (address, SIRET, VAT number, consumer mediator, court city)
and have the texts checked before switching Stripe to live mode.

## 6. Test, then go live
Test card `4242 4242 4242 4242`, any future date, any CVC. Check: row gets `paid = true` in Supabase,
you get the "PAID" email, the buyer gets the confirmation, Stripe shows the invoice.
Then repeat steps 2.2–2.4 in live mode and replace the three Stripe variables in Vercel.

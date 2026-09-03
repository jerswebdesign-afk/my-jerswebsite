import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function. Stripe signature verification requires the
// exact raw request body, so automatic body parsing must be disabled here.
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Same URL fallback as api/_lib/vault.js - see the comment there.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // createClient() throws synchronously if the URL is missing, which would
  // crash every webhook delivery with a raw 500 instead of the clean error
  // response below. Stripe retries failed webhooks regardless, but this
  // keeps the failure diagnosable from logs instead of a platform crash page.
  console.error(
    '[stripe-webhook] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing. ' +
    'Set them in Vercel -> Project Settings -> Environment Variables (Production) and redeploy.'
  );
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseServiceRoleKey || 'placeholder-service-role-key'
);

// Stable Stripe Price IDs for each tier, taken from the existing Payment
// Links wired up in Pricing.jsx. Keyed by Price ID (not product name) so
// renaming a product in the Stripe dashboard can't silently break tier
// attribution.
const TIER_BY_PRICE_ID = {
  'price_1U9VA4B6zh3lahOqh6i6wVz2': 'The JER Method',
  'price_1U9VCWB6zh3lahOqeSoyvOMb': 'The Reselling Engine',
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'];
  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    return res.status(400).send('Could not read request body');
  }

  // 1. Verify the Stripe webhook signature.
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;

  // 2. Confirm the checkout completed successfully.
  if (session.payment_status !== 'paid' || session.status !== 'complete') {
    return res.status(200).json({ received: true, skipped: 'not paid/complete' });
  }

  // 3. Extract the customer's checkout email.
  const rawEmail = session.customer_details?.email || session.customer_email;
  if (!rawEmail) {
    console.error('checkout.session.completed had no email', session.id);
    return res.status(200).json({ received: true, skipped: 'no email' });
  }
  // Normalized the same way /api/get-downloads looks emails up, so a
  // purchase recorded here is always found later regardless of casing.
  const email = rawEmail.trim().toLowerCase();

  // 4. Determine the purchased product/tier from the stable Price ID first,
  // falling back to the Stripe Product name only if the price is unmapped.
  let product = 'Unknown';
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });
    const price = lineItems.data[0]?.price;
    if (price?.id && TIER_BY_PRICE_ID[price.id]) {
      product = TIER_BY_PRICE_ID[price.id];
    } else {
      console.warn(`Unmapped Stripe price ID "${price?.id}" for session ${session.id}; falling back to product name`);
      product = price?.product?.name || 'Unknown';
    }
  } catch (err) {
    console.error('Failed to retrieve line items for session', session.id, err.message);
  }

  // 5. Insert the purchase, 6. skipping silently if this event was already processed.
  try {
    const { error } = await supabase
      .from('purchases')
      .upsert(
        { email, product, stripe_event_id: event.id },
        { onConflict: 'stripe_event_id', ignoreDuplicates: true }
      );

    if (error) {
      console.error('Failed to insert purchase:', error);
      return res.status(500).json({ error: 'Failed to record purchase' });
    }
  } catch (err) {
    console.error('Failed to insert purchase (crashed):', err.message);
    return res.status(500).json({ error: 'Failed to record purchase' });
  }

  return res.status(200).json({ received: true });
}

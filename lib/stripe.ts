import Stripe from 'stripe';

/**
 * Lazy Stripe accessor.
 *
 * Stripe must NOT be instantiated at module scope: Next.js evaluates route
 * modules during the build's "Collecting page data" phase where runtime env
 * vars are absent, and `new Stripe(undefined)` throws
 * "Neither apiKey nor config.authenticator provided", failing the whole build.
 * Calling getStripe() inside a request handler defers instantiation to runtime.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
  }
  return _stripe;
}

export function hasStripe(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

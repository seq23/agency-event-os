# V2 Billing and Commercial Backlog

## Status

Billing, Stripe, subscriptions, sponsor package payments, and paid ticketing are deliberately moved to V2.

This backlog is documented now so the MVP can focus on the event operating product: venue, LiveKit rooms, production operations, replay, reports, and email after Resend setup.

## V2 Product Goals

- Agency subscriptions
- Event package billing
- Sponsor package billing
- Paid attendee tickets
- Promo codes
- Invoices
- Stripe Checkout
- Stripe Customer Portal
- Stripe webhooks
- Entitlement gates
- Billing audit logs
- Refund/cancellation policy
- Sponsor upsells
- Usage-based pricing options

## V2 Data Model

Recommended future tables:

- billing_customers
- billing_subscriptions
- billing_plans
- billing_event_packages
- billing_sponsor_packages
- billing_invoices
- billing_payment_events
- billing_entitlements
- billing_refunds
- billing_coupon_redemptions

## V2 Stripe Integration Plan

1. Create Stripe account.
2. Define products and prices.
3. Create checkout sessions for event packages.
4. Create customer portal sessions.
5. Add webhooks for subscription lifecycle.
6. Add entitlement gates around premium event features.
7. Add billing audit trail.
8. Add sponsor package upsells.
9. Add invoice/reporting views.

## Not Part of MVP

- No Stripe SDK
- No payment webhooks
- No paid attendee tickets
- No billing gates
- No payment-based sponsor upsells
- No customer portal

## MVP Rule

Do not block venue completion, LiveKit rooms, production operations, replay/reporting, or Resend email on billing.

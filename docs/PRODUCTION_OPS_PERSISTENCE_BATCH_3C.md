# Batch 3C — Approval, Production Inbox, and Change-Control Persistence

## Purpose

This batch creates the Supabase-ready persistence foundation for the producer workflows that determine whether an event is operationally safe.

## Persisted Domains

- Event Approval Queue via `approval_requests` and `approval_comments`
- Production Inbox via `production_inbox_items`
- Last-Minute Change Control via `last_minute_change_requests`
- Asset metadata via `assets`
- Audit trail via `audit_logs`

## Intentional Boundary

This batch does not upload files. Asset file storage waits for Supabase Storage. It also does not parse inbound email, send Resend reminders, or create real video rooms.

## Producer Actions Modeled

- approve approval request
- request changes
- lock approval item for show
- match/convert/archive inbox item
- approve/reject/push/rollback last-minute changes

## Migration

Run `db/migrations/0002_approval_inbox_change_persistence.sql` in Supabase before relying on production inbox or last-minute change persistence.

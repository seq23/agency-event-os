# Batch 3D — Supabase Storage and Asset Upload Foundation

## Purpose

Create the storage and asset metadata foundation before wiring real upload UI.

## Buckets

- event-assets
- speaker-assets
- sponsor-assets
- client-assets
- testing-artifacts
- replay-assets

## Rules

- Every upload creates asset metadata.
- Locked assets are never overwritten.
- New uploads create new versions.
- Signed URL helpers are provider boundaries.
- File type and size rules are enforced before upload.
- Review status feeds approval queue and readiness.

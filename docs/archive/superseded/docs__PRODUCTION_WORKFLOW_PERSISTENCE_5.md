<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Phase 5 — Production Workflow Persistence

## Purpose

Make the live production operating layer persistence-ready.

## Tables

- run_of_show_segments
- production_tasks
- event_milestones
- contractor_assignments
- vendor_assignments
- incident_logs
- testing_console_incidents
- white_label_backup_rooms

## Rules

- Run-of-show live changes must be audit logged.
- White-label backup room activation requires producer approval unless explicitly disabled.
- Incidents must be connected to event and optionally run-of-show segment.
- Testing console incidents should become operational records.

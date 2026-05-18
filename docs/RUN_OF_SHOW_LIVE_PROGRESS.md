# Run of Show Live Progress Layer

## Purpose

The Run of Show is the live operating spine of Agency Event OS.

For WPP-style production work, the run of show is not just a planning document. It is the source of truth for:

- client-approved event flow
- production cueing
- live segment status
- speaker/sponsor/asset timing
- crew coordination
- room readiness
- incident response
- post-event reconstruction

## Core Product Rule

Every event must prominently expose the current run-of-show state.

The production team should always know:

- what segment is live now
- what segment just completed
- what is next
- which room/stage is active
- who owns the next cue
- whether the show is on time, delayed, blocked, skipped, or changed live

## Surfaces

The Run of Show Live Progress Layer appears in:

1. Event overview
2. Run of Show page
3. Production Command Center
4. Crew portal
5. Client portal
6. Testing console

## Live Segment Statuses

- scheduled
- current
- completed
- delayed
- skipped
- extended
- shortened
- moved
- blocked
- cancelled

## Live Readiness Statuses

- not_ready
- needs_attention
- ready
- live
- done

## Production Controls

The production team eventually needs controls for:

- mark segment live
- mark segment complete
- delay segment
- skip segment
- extend segment
- shorten segment
- move next
- add emergency note
- trigger incident
- change responsible owner
- update cue
- update asset
- notify production team

Current controls are shell-only until Supabase persistence and audit logging are wired.

## Visibility Rules

### Agency / Producer

May see:

- producer notes
- technical cues
- backup plans
- emergency notes
- crew ownership
- incident notes

May control live segment state.

### Client

May see:

- polished public title
- public timing
- speaker/session info
- approved client-facing description

Must not see:

- internal producer notes
- technical cues
- backup plans
- emergency notes
- internal risk notes

### Crew / Contractors

May see:

- assigned segments
- relevant call times
- relevant technical cues
- shared production notes

Must not see:

- rates
- margins
- private client notes
- unrelated contractor information

### Speakers

May see:

- their own segment
- backstage/join timing
- tech-check status

### Sponsors

May see:

- their own sponsor mention timing
- booth/session timing
- lead/reporting status

## Persistence Requirements

When Supabase is wired, every live run-of-show update must write an audit log.

Audit events include:

- segment marked live
- segment completed
- segment delayed
- segment skipped
- segment extended
- emergency note added
- incident triggered
- cue updated
- asset updated
- team notified

## Testing Console Integration

The testing console should prioritize checks based on the run of show:

1. current segment room
2. next segment room
3. upcoming speaker/sponsor segments
4. any segment with delayed/blocked status

This ensures the technical director is testing the rooms that matter next, not randomly checking the system.

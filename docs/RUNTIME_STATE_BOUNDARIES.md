# Runtime State Boundaries

planned config ≠ live operational state

Repo config may define event identity, public routing, branding references, venue modules, planned agenda, planned run-of-show, access env key names, role redirects, communications templates, and video fallback policy.

Runtime storage must own access attempts, live run-of-show status, incidents, fallback switches, attendee registrations, analytics events, support requests, email sends, and audit logs.

A page or service may read repo config to know what should exist. It must not treat repo JSON as the only source of truth for live operational state.

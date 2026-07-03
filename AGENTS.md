# LexiCard Agent Notes

## Project Context

- LexiCard is an iPad handwriting + AI English vocabulary card PWA.
- Read `LexiCard_PRD.md`, `Log.md`, and `session_handoff.md` before planning, designing, or implementing meaningful changes.

## Session Startup

- At the beginning of every new session, automatically read the project startup script or agent notes, `Log.md`, and `LexiCard_PRD.md` to understand the current project context.
- Also read `session_handoff.md` when the task involves planning, design, development handoff, or continuing previous work.

## Development Phases

- Development phases in `LexiCard_PRD.md` should be broken down into smaller task items so each task can be handled as one focused session.
- Each session should have a clear task boundary, expected output, current status, and next step recorded in `Log.md` when meaningful progress or changes happen.

## Testing Workflow

- Every feature development session should include human-run unit testing for that feature.
- Record the tested feature, test scope, result, and remaining risks or follow-up items in `Log.md`.

## Iteration Logging

- `Log.md` is the single source of truth for project iteration records.
- After any substantial PRD change, product decision, feature development, technical decision, data model change, AI prompt change, important bug fix, or unfinished handoff, update `Log.md`.
- Each substantial log entry should include the date, summary, affected scope, current progress, and next steps.
- Small copy edits may be folded into the nearest related entry, but changes that affect product understanding or implementation direction need their own entry.

## Handoff Maintenance

- Keep `session_handoff.md` as a compact, current handoff summary, not a full change log.
- Update `session_handoff.md` after meaningful milestones, before ending a long session, when context usage is getting high, after major PRD or implementation changes, and whenever the next task or current blocker changes.
- A handoff update should capture the current objective, completed work, in-progress work, next steps, important decisions, open questions, known risks, and files touched.
- If time or quota is running low, prioritize a short `session_handoff.md` update over polishing nonessential documentation.

// Dev-only event bus so the global DevSeedPanel (mounted once in App.tsx,
// outside the router) can trigger actions that live in a specific page's
// local state (e.g. AddWordPage's AI 對話 demo) without prop drilling or a
// shared state library. Not used in production builds.
export const LOAD_COMPLEX_CONVERSATION_DEMO_EVENT = 'lexicard:dev-load-complex-conversation'
export const CLEAR_COMPLEX_CONVERSATION_DEMO_EVENT = 'lexicard:dev-clear-complex-conversation'

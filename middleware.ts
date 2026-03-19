// NOTE: Intentionally left minimal. Admin protection is handled
// in the server-side admin layout using NextAuth (Node runtime).
// This middleware no longer calls NextAuth so it can safely run
// in the Edge/proxy runtime without Node-only modules.

export function middleware() {
  return
}



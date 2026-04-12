import { auth } from '@/auth'

/**
 * Accepts either:
 *  - A valid admin session cookie (browser/admin panel)
 *  - x-api-key header matching N8N_API_KEY (n8n automation)
 */
export async function ensureAdminOrApiKey(request: Request): Promise<boolean> {
  // Check API key first (fast path for n8n)
  const apiKey = request.headers.get('x-api-key')
  if (apiKey && apiKey === process.env.N8N_API_KEY) return true

  // Fall back to session auth
  const session = await auth()
  if (session?.user && (session.user as any).role === 'admin') return true

  return false
}

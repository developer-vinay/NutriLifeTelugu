// Brevo (formerly Sendinblue) email helper
// Get your free API key at: https://app.brevo.com/settings/keys/api
// Free tier: 300 emails/day forever

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? ''
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'noreply@nutrilifemitra.com'
const FROM_NAME = 'NutriLifeMitra'
const SITE_URL = 'https://nutrilifemitra.vercel.app'

interface SendEmailOptions {
  to: string
  toName?: string
  subject: string
  htmlContent: string
}

export async function sendEmail({ to, toName, subject, htmlContent }: SendEmailOptions) {
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not set — skipping email send')
    return
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to, name: toName ?? to }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Brevo send error:', err)
    throw new Error('Email send failed')
  }
}

// ── Email templates ──────────────────────────────────────────────────────────

export function welcomeEmailHtml(email: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:560px;width:100%">
        <!-- Header -->
        <tr><td style="background:#1A5C38;padding:32px 40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">🌿 NutriLifeMitra</h1>
          <p style="color:#a7f3d0;margin:8px 0 0;font-size:14px">స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px">
          <h2 style="color:#1A5C38;margin:0 0 16px;font-size:20px">నమస్కారం! Welcome to NutriLifeMitra 🎉</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">
            Thank you for subscribing! You're now part of our growing community of health-conscious Telugu families.
          </p>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">
            Every week you'll receive our best recipes, diet tips, and health articles — in Telugu and English.
          </p>
          <!-- CTA buttons -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:12px">
                <a href="${SITE_URL}/recipes" style="display:inline-block;background:#1A5C38;color:#fff;text-decoration:none;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:600">Browse Recipes →</a>
              </td>
              <td>
                <a href="${SITE_URL}/diet-plans" style="display:inline-block;border:2px solid #1A5C38;color:#1A5C38;text-decoration:none;padding:10px 24px;border-radius:50px;font-size:14px;font-weight:600">Free Diet Plans →</a>
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            You subscribed with ${email}. 
            <a href="${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9ca3af">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function passwordResetEmailHtml(resetUrl: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:560px;width:100%">
        <tr><td style="background:#1A5C38;padding:32px 40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">🌿 NutriLifeMitra</h1>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <h2 style="color:#111827;margin:0 0 16px;font-size:20px">Reset your password</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">
            We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#1A5C38;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600">Reset Password →</a>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">
            If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="color:#9ca3af;font-size:12px;margin:0">NutriLifeMitra — ${SITE_URL}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function weeklyDigestHtml(posts: {title:string;slug:string;excerpt:string}[], recipes: {title:string;slug:string}[]) {
  const postItems = posts.map(p => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6">
      <a href="${SITE_URL}/blog/${p.slug}" style="color:#1A5C38;font-weight:600;text-decoration:none;font-size:15px">${p.title}</a>
      <p style="color:#6b7280;font-size:13px;margin:4px 0 0;line-height:1.5">${(p.excerpt ?? '').slice(0, 100)}…</p>
    </td></tr>`).join('')

  const recipeItems = recipes.map(r => `
    <tr><td style="padding:8px 0">
      <a href="${SITE_URL}/recipes/${r.slug}" style="color:#1A5C38;text-decoration:none;font-size:14px">🍽 ${r.title}</a>
    </td></tr>`).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:560px;width:100%">
        <tr><td style="background:#1A5C38;padding:28px 40px">
          <h1 style="color:#fff;margin:0;font-size:22px">🌿 This Week on NutriLifeMitra</h1>
          <p style="color:#a7f3d0;margin:6px 0 0;font-size:13px">Your weekly health & nutrition digest</p>
        </td></tr>
        <tr><td style="padding:32px 40px">
          ${posts.length ? `<h3 style="color:#111827;margin:0 0 8px;font-size:16px">Latest Articles</h3>
          <table width="100%" cellpadding="0" cellspacing="0">${postItems}</table>` : ''}
          ${recipes.length ? `<h3 style="color:#111827;margin:24px 0 8px;font-size:16px">New Recipes</h3>
          <table width="100%" cellpadding="0" cellspacing="0">${recipeItems}</table>` : ''}
          <div style="margin-top:28px">
            <a href="${SITE_URL}" style="display:inline-block;background:#1A5C38;color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:600">Visit NutriLifeMitra →</a>
          </div>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 40px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            <a href="${SITE_URL}/api/unsubscribe?email={{email}}" style="color:#9ca3af">Unsubscribe</a> · NutriLifeMitra
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

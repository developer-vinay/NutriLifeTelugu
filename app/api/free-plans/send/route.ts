import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { FreeMealPlan } from '@/models/FreeMealPlan'
import { sendEmail } from '@/lib/brevo'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { email, planId, language = 'en' } = await req.json()

    if (!email || !planId) {
      return NextResponse.json({ error: 'Email and planId are required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    await connectDB()
    const plan = await FreeMealPlan.findById(planId).lean() as any
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const title = language === 'te' ? (plan.titleTe || plan.titleEn)
      : language === 'hi' ? (plan.titleHi || plan.titleEn)
      : plan.titleEn

    const hasPdf = !!plan.pdfUrl
    
    // Use proxy route in production, direct link in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseUrl = process.env.NEXTAUTH_URL || 'https://nutrilifemitra.com'
    
    const pdfUrl = hasPdf 
      ? (isDevelopment ? plan.pdfUrl : `${baseUrl}/api/pdf/${planId}`)
      : null

    const subject = language === 'te'
      ? `మీ ఉచిత మీల్ ప్లాన్: ${title}`
      : language === 'hi'
      ? `आपका मुफ्त मील प्लान: ${title}`
      : `Your Free Meal Plan: ${title}`

    const htmlContent = freePlanEmailHtml({ email, title, pdfUrl, language })

    await sendEmail({ to: email, subject, htmlContent })

    return NextResponse.json({ ok: true, hasPdf })
  } catch (err: any) {
    console.error('Free plan email error:', err)
    return NextResponse.json({ error: err.message ?? 'Failed to send email' }, { status: 500 })
  }
}

function freePlanEmailHtml({ email, title, pdfUrl, language }: {
  email: string; title: string; pdfUrl?: string; language: string
}) {
  const isTE = language === 'te'
  const isHI = language === 'hi'

  const greeting = isTE ? 'నమస్కారం!' : isHI ? 'नमस्ते!' : 'Hello!'
  const thankYou = isTE
    ? `<b>${title}</b> డౌన్‌లోడ్ చేసినందుకు ధన్యవాదాలు!`
    : isHI
    ? `<b>${title}</b> डाउनलोड करने के लिए धन्यवाद!`
    : `Thank you for downloading <b>${title}</b>!`

  const downloadText = isTE ? 'PDF డౌన్‌లోడ్ చేయండి' : isHI ? 'PDF डाउनलोड करें' : 'Download Your PDF'
  const noFileText = isTE
    ? 'మీ ప్లాన్ త్వరలో అందుబాటులో ఉంటుంది. మేము మీకు తెలియజేస్తాము.'
    : isHI
    ? 'आपका प्लान जल्द उपलब्ध होगा। हम आपको सूचित करेंगे।'
    : 'Your plan will be available soon. We will notify you.'

  const footerText = isTE
    ? 'ఆరోగ్యంగా ఉండండి — NutriLifeMitra టీమ్'
    : isHI
    ? 'स्वस्थ रहें — NutriLifeMitra टीम'
    : 'Stay healthy — NutriLifeMitra Team'

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A5C38,#2d9e6b);padding:32px 32px 24px;text-align:center">
            <img src="https://nutrilifemitra.com/logo.png" alt="NutriLifeMitra" width="56" height="56" style="border-radius:50%;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto" />
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700">NutriLifeMitra</h1>
            <p style="color:#a7f3d0;font-size:13px;margin:4px 0 0">Your Free Meal Plan is Ready!</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="font-size:18px;font-weight:700;color:#1A5C38;margin:0 0 8px">${greeting}</p>
            <p style="font-size:15px;color:#374151;margin:0 0 24px;line-height:1.6">${thankYou}</p>

            ${pdfUrl ? `
            <div style="text-align:center;margin:24px 0">
              <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer"
                style="display:inline-block;background:linear-gradient(135deg,#1A5C38,#2d9e6b);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:700;box-shadow:0 4px 12px rgba(26,92,56,0.3)">
                📄 ${downloadText}
              </a>
            </div>
            <p style="font-size:12px;color:#6b7280;text-align:center;margin:8px 0 24px">
              ${isTE ? 'మొబైల్ లేదా కంప్యూటర్‌లో తెరవండి' : isHI ? 'मोबाइल या कंप्यूटर पर खोलें' : 'Open on mobile or computer'}
            </p>
            ` : `
            <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin:24px 0;text-align:center">
              <p style="color:#92400e;font-size:14px;margin:0">${noFileText}</p>
            </div>
            `}

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />

            <p style="font-size:13px;color:#6b7280;margin:0 0 8px">
              ${isTE ? 'మరిన్ని ఉచిత ప్లాన్స్ కోసం:' : isHI ? 'और मुफ्त प्लान के लिए:' : 'For more free plans:'}
            </p>
            <a href="https://nutrilifemitra.com/diet-plans" style="color:#1A5C38;font-size:13px;font-weight:600">
              nutrilifemitra.com/diet-plans →
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
            <p style="font-size:13px;color:#6b7280;margin:0">${footerText}</p>
            <p style="font-size:11px;color:#9ca3af;margin:8px 0 0">
              <a href="https://nutrilifemitra.com" style="color:#9ca3af">nutrilifemitra.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

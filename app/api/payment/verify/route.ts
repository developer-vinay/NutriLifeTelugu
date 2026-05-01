import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/models/Order'
import { User } from '@/models/User'
import { PremiumPlan } from '@/models/PremiumPlan'
import { sendEmail } from '@/lib/brevo'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

  // Verify signature
  const body = razorpayOrderId + '|' + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  // Mark order as paid
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId },
    { razorpayPaymentId, razorpaySignature, status: 'paid' },
    { new: true },
  )

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Add plan to user's purchasedPlans
  const userId = (session.user as any).id
  await User.findByIdAndUpdate(userId, {
    $addToSet: { purchasedPlans: order.planId },
  })

  // Send email with PDF (if plan has fileUrl)
  try {
    const plan = await PremiumPlan.findById(order.planId).lean()
    if (plan && plan.fileUrl) {
      const userEmail = session.user.email!
      const userName = session.user.name || 'Valued Customer'
      
      // Determine plan title based on language
      const planTitle = plan.titleEn || plan.title || 'Premium Diet Plan'
      
      // Use PDF proxy for mobile-friendly download
      const isDev = process.env.NODE_ENV === 'development'
      const baseUrl = isDev ? 'http://localhost:3000' : 'https://nutrilifemitra.com'
      const pdfDownloadUrl = `${baseUrl}/api/pdf/${plan._id}`
      
      const emailSubject = `Your Premium Plan: ${planTitle}`
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1A5C38 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 Thank You for Your Purchase!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hi <strong>${userName}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Thank you for purchasing <strong>${planTitle}</strong>! We're excited to be part of your health journey.
                      </p>
                      
                      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
                        <p style="margin: 0 0 10px; color: #1A5C38; font-size: 14px; font-weight: bold;">📋 Plan Details:</p>
                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                          <strong>Plan:</strong> ${planTitle}<br>
                          <strong>Duration:</strong> ${plan.durationWeeks} weeks<br>
                          <strong>Price:</strong> ${plan.currency}${plan.price}
                        </p>
                      </div>
                      
                      <p style="margin: 0 0 25px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Your personalized meal plan PDF is ready! Click the button below to download:
                      </p>
                      
                      <!-- Download Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 10px 0;">
                            <a href="${pdfDownloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #1A5C38 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(26, 92, 56, 0.3);">
                              📥 Download Your Plan
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                        You can also access your plan anytime from your profile page:
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 10px 0;">
                            <a href="${baseUrl}/profile?tab=plans" style="display: inline-block; background-color: #f3f4f6; color: #1A5C38; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 600; border: 2px solid #e5e7eb;">
                              View My Plans
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 15px; color: #333333; font-size: 14px; line-height: 1.6;">
                          <strong>💡 Tips for Success:</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                          <li>Print your meal plan and keep it in your kitchen</li>
                          <li>Prepare your shopping list in advance</li>
                          <li>Stay consistent and track your progress</li>
                          <li>Reach out if you have any questions</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                        Need help? Contact us at <a href="mailto:support@nutrilifemitra.com" style="color: #1A5C38; text-decoration: none;">support@nutrilifemitra.com</a>
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} NutriLife Mitra. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
      
      await sendEmail({
        to: userEmail,
        toName: userName,
        subject: emailSubject,
        htmlContent: emailHtml,
      })
      console.log(`✓ Premium plan email sent to ${userEmail}`)
    }
  } catch (emailError) {
    // Log error but don't fail the payment verification
    console.error('Failed to send premium plan email:', emailError)
  }

  return NextResponse.json({ success: true, planId: order.planId.toString() })
}

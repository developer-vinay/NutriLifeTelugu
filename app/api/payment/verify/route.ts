import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/models/Order'
import { User } from '@/models/User'

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

  return NextResponse.json({ success: true, planId: order.planId.toString() })
}

import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import { Order } from '@/models/Order'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const body = await req.json()
    const { planId } = body
    if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 })

    await connectDB()
    const plan = await PremiumPlan.findById(planId)
    if (!plan || !plan.isActive) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    const amountPaise = Math.round(plan.price * 100)

    const rzOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `nlm_${Date.now().toString(36)}`,
      notes: { planId: planId.toString(), planTitle: plan.title },
    })

    const userId = (session.user as any).id
    await Order.create({
      userId,
      planId,
      razorpayOrderId: rzOrder.id,
      amount: amountPaise,
      currency: 'INR',
      status: 'created',
      planTitle: plan.title,
      userEmail: session.user.email,
    })

    return NextResponse.json({
      orderId: rzOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      planTitle: plan.title,
      userEmail: session.user.email,
      userName: session.user.name ?? '',
    })
  } catch (err: any) {
    console.error('create-order error:', err)
    return NextResponse.json({ error: err?.message ?? 'Order creation failed' }, { status: 500 })
  }
}

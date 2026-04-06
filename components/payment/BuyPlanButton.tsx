'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {
  planId: string
  planTitle: string
  price: number
  currency?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function BuyPlanButton({ planId, planTitle, price, currency = '₹' }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  async function handleBuy() {
    if (!session?.user) {
      router.push('/login?redirect=/diet-plans')
      return
    }

    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { alert('Failed to load payment gateway. Please try again.'); setLoading(false); return }

      // Create order on server
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const order = await res.json()

      // Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'NutriLifeMitra',
        description: order.planTitle,
        order_id: order.orderId,
        prefill: {
          name: order.userName,
          email: order.userEmail,
        },
        theme: { color: '#1A5C38' },
        handler: async (response: any) => {
          // Verify payment on server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          if (verifyRes.ok) {
            setPaid(true)
            router.push('/profile?tab=plans&success=1')
          } else {
            alert('Payment verification failed. Contact support.')
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.')
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <div className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white">
        ✓ Payment Successful!
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={loading}
      className="mt-4 w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {loading ? 'Opening payment...' : `Buy Now — ${currency}${price}`}
    </button>
  )
}

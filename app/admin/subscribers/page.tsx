import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'
import { format } from 'date-fns'
import SendDigestButton from './SendDigestButton'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminSubscribersPage() {
  await connectDB()
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean()
  const activeCount = subscribers.filter((s) => s.isActive).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Subscribers</h2>
          <p className="text-sm text-gray-500">{subscribers.length} total · {activeCount} active</p>
        </div>
        <SendDigestButton activeCount={activeCount} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Subscribed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map((sub, idx) => (
              <tr key={sub._id.toString()}>
                <td className="px-4 py-2 text-sm text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{sub.email}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sub.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {sub.subscribedAt ? format(new Date(sub.subscribedAt), 'dd MMM yyyy') : '-'}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

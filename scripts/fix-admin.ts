import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import bcrypt from 'bcryptjs'
import { connectDB } from '../lib/mongodb'
import { User } from '../models/User'

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) { console.error('ADMIN_EMAIL not set'); process.exit(1) }

  await connectDB()

  const password = 'Admin@123'
  const hashed = await bcrypt.hash(password, 10)

  const result = await User.findOneAndUpdate(
    { email: adminEmail },
    { role: 'admin', password: hashed, provider: 'credentials' },
    { upsert: true, new: true }
  )

  console.log(`✅ Admin ready — email: ${result.email}, role: ${result.role}`)
  console.log(`   Password set to: Admin@123`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })

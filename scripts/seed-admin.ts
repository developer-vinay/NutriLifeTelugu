import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import bcrypt from 'bcryptjs'
import { connectDB } from '../lib/mongodb'
import { User } from '../models/User'

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.error('ADMIN_EMAIL is not set in environment variables.')
    process.exit(1)
  }

  const password = 'Admin@123'

  await connectDB()

  const existing = await User.findOne({ email: adminEmail }).exec()

  if (existing) {
    console.log('Admin user already exists.')
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await User.create({
    name: 'NutriLife Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    provider: 'credentials',
  })

  console.log('Admin created successfully with default password Admin@123')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})


import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { email, password } = credentials as { email: string; password: string }
        await connectDB()
        const user = await User.findOne({ email }).exec()
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          language: user.language ?? 'te',
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const existing = await User.findOne({ email: user.email as string }).exec()
        const adminEmail = process.env.ADMIN_EMAIL

        if (!existing) {
          await User.create({
            name: user.name ?? undefined,
            email: user.email as string,
            image: user.image ?? undefined,
            role: user.email === adminEmail ? 'admin' : 'user',
            provider: account.provider as 'google',
            language: 'te',
          })
        } else if (user.email === adminEmail && existing.role !== 'admin') {
          existing.role = 'admin'
          await existing.save()
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? 'user'
        token.language = (user as any).language ?? 'te'
        token.userId = (user as any).id
      } else if (token.email) {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email }).exec()
        if (dbUser) {
          token.role = dbUser.role
          token.language = dbUser.language ?? 'te'
          token.userId = dbUser._id.toString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? 'user'
        ;(session.user as any).language = token.language ?? 'te'
        ;(session.user as any).id = token.userId
      }
      return session
    },
  },
})

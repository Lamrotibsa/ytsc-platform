import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import User from '../../../models/User'
import dbConnect from '../../../lib/dbConnect'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await dbConnect()

        // Find user by email
        const user = await User.findOne({ email: credentials?.email })
        if (!user) throw new Error('No user found')

        // Compare password
        const isValid = await bcrypt.compare(credentials!.password, user.password)
        if (!isValid) throw new Error('Invalid password')

        // Return user object (will be stored in JWT/session)
        return { id: user._id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
})
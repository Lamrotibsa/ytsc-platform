import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password, name } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  await dbConnect()

  // Check if user exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    role: 'member'
  })

  res.status(201).json({ message: 'User created', userId: user._id })
}
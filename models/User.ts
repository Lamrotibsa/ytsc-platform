import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  password: string
  name?: string
  role: 'member' | 'admin'
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import Course from '../../models/Course'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  console.log('Connected to database:', mongoose.connection.name)
  if (mongoose.connection.db) {
  console.log('Collection names:', await mongoose.connection.db.listCollections().toArray())
}
  const courses = await Course.find({})
  console.log('Number of courses found:', courses.length)
  if (courses.length > 0) {
    console.log('First course title:', courses[0].title)
  }
  res.status(200).json(courses)
}
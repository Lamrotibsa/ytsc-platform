import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf'], required: true },
  url: { type: String, required: true },
  duration: String,
})

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  lessons: [LessonSchema],
})

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
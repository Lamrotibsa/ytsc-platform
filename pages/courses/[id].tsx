import { GetServerSideProps } from 'next'
import dbConnect from '../../lib/dbConnect'
import Course from '../../models/Course'

interface Lesson {
  title: string
  type: 'video' | 'pdf'
  url: string
  duration?: string
  _id?: string
}

interface CourseType {
  _id: string
  title: string
  description: string
  lessons: Lesson[]
}

interface CoursePageProps {
  course: CourseType
}

export default function CoursePage({ course }: CoursePageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <p className="text-gray-700 mb-8">{course.description}</p>
      <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
      <div className="space-y-4">
        {course.lessons.map((lesson, idx) => (
          <div key={idx} className="border p-4 rounded">
            <h3 className="font-bold">{lesson.title}</h3>
            {lesson.type === 'video' ? (
              <video controls src={lesson.url} className="mt-2 w-full max-h-96" />
            ) : (
              <a
                href={lesson.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F59E0B] hover:underline"
              >
                View PDF
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  await dbConnect()
  const course = await Course.findById(context.params?.id).lean()
  if (!course) {
    return { notFound: true }
  }

  // Safely convert _id fields
  const serializedCourse = {
    ...course,
    _id: course._id.toString(),
    lessons: course.lessons.map((lesson: any) => ({
      ...lesson,
      // Only include _id if it exists, otherwise omit it
      ...(lesson._id && { _id: lesson._id.toString() })
    }))
  }

  return {
    props: {
      course: serializedCourse
    }
  }
}
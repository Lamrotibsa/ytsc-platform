import { GetServerSideProps } from 'next'
import Link from 'next/link'
import dbConnect from '../../lib/dbConnect'
import Course from '../../models/Course'

interface CourseType {
  _id: string
  title: string
  description: string
  thumbnail?: string
}

interface CoursesPageProps {
  courses: CourseType[]
}

export default function Courses({ courses }: CoursesPageProps) {
  console.log('Courses received in component:', courses); // ← ADD THIS

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Courses Yet</h1>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#38424D]">All Courses</h1>
      <section>
      <h2 className="text-3xl font-bold text-[#38424D] mb-8 text-center">Featured Courses</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="border rounded-lg overflow-hidden shadow">
            <div className="h-40 bg-gray-300" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{course.description}</p>
              <Link href={`/courses/${course._id}`} className="mt-4 inline-block text-[#F59E0B] font-semibold">
                View Course →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect()
  const courses = await Course.find({}).lean()
  return {
    props: {
      courses: courses.map(course => ({
        ...course,
        _id: course._id.toString()
      }))
    }
  }
}
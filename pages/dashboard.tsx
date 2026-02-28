import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../lib/dbConnect'
import Course from '../models/Course'
import Link from 'next/link'

interface CourseType {
  _id: string
  title: string
  description: string
  thumbnail?: string
}

interface DashboardProps {
  courses: CourseType[]
}

export default function Dashboard({ courses }: DashboardProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-600">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{course.description}</p>
              <Link href={`/courses/${course._id}`} className="mt-4 inline-block text-[#F59E0B] font-semibold">
                View Course →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  await dbConnect()
  const courses = await Course.find({}).lean() // For demo, show all courses; later you can filter by user enrollment

  return {
    props: {
      courses: courses.map(course => ({
        ...course,
        _id: course._id.toString(),
        // Ensure lessons are serialized if needed (but not required for listing)
      })),
    },
  }
}
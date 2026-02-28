import { GetServerSideProps } from 'next'
import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import Course from '../models/Course'

interface CourseType {
  _id: string
  title: string
  description: string
  thumbnail?: string
}

interface HomeProps {
  courses: CourseType[]
}

export default function Home({ courses }: HomeProps) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-[#38424D] text-white rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Empowering Shareholders Through Knowledge</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Access exclusive training, resources, and courses designed for YTSC members.
        </p>
        <Link href="/courses" className="bg-[#F59E0B] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90">
          Explore Courses
        </Link>
      </section>

      {/* About Teaser */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#38424D] mb-4">About Yegara Trading</h2>
          <p className="text-gray-700 mb-4">
            Yegara Trading Share Company is a leader in social enterprise and technology,
            dedicated to providing value to our shareholders through innovation and education.
          </p>
          <Link href="/about" className="text-[#F59E0B] font-semibold hover:underline">
            Learn more →
          </Link>
        </div>
        <div className="relative h-64 bg-gray-200 rounded-lg" />
      </section>

      {/* Dynamic Course Teaser */}
      <section>
        <h2 className="text-3xl font-bold text-[#38424D] mb-8 text-center">Featured Courses</h2>
        {courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
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
        )}
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
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-[#38424D] text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/LOGOS/transparent/YEGARA-06.png" alt="YTSC" width={120} height={40} />
        </Link>
        <div className="space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/courses" className="hover:underline">Courses</Link>
          {session ? (
            <>
              <span>{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-[#F59E0B] px-4 py-2 rounded hover:bg-opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#F59E0B] px-4 py-2 rounded hover:bg-opacity-90">
              Login
            </Link>
          )}
          
        </div>
      </nav>
    </header>
  )
}
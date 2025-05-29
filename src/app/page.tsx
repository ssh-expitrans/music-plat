import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Music Teacher</h1>
        <p className="text-lg text-gray-700">
          Learn music with personalized lessons tailored just for you.
        </p>
      </header>

      <section className="mb-8 flex justify-center gap-6">
        <Link href="/signup">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Sign Up
          </button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Login
          </button>
        </Link>
      </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
            <img
              src="/teacher-photo.jpg"
              alt="Photo of the music teacher"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="text-3xl font-semibold">Meet Jane Doe</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Jane is a passionate music teacher with over 15 years of experience inspiring students of all ages. She specializes in piano and guitar lessons tailored to each individual’s goals.
            </p>
            <Link href="/about">
              <button className="mt-2 w-max px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                Learn More
              </button>
            </Link>
          </div>
        </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Group Pricing</h2>
        <p>Starting at $50 per group session.</p>
        <p className="italic mt-2">Contact for individual class pricing.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p>Email: <a href="mailto:music.teacher@example.com" className="text-blue-600 hover:underline">music.teacher@example.com</a></p>
        <p>Phone: <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
      </section>

      <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
        © 2025 Buzz Financial
      </footer>

    </div>
  );
}

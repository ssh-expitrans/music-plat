'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-serif bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-16">
        {/* Left side: title and subtitle */}
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--accent)] drop-shadow-md">
            MUSIC LESSONS
          </h1>
          <p className="mt-2 text-xl text-neutral-600 dark:text-neutral-400 max-w-md">
            Personalized. Professional. Powerful.
          </p>
        </div>

        {/* Right side: buttons */}
        <div className="flex gap-4">
          <Link href="/signup">
            <button className="btn-accent px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 font-semibold">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => router.push('/demodashboard/studentdash')}
            className="btn-outline px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 font-semibold"
          >
            My Dash
          </button>
        </div>
      </header>

      {/* HERO / TEACHER INTRO */}
      <section className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 rounded-2xl shadow-lg p-10 flex flex-col sm:flex-row items-center gap-10 mb-16 text-white">
        <div className="flex-shrink-0 w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white">
          <img
            src="/stockwoman.jpg"
            alt="Photo of the music teacher"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="max-w-lg space-y-4">
          <h2 className="text-4xl font-bold drop-shadow-lg">Meet Jane Doe</h2>
          <p className="text-lg leading-relaxed drop-shadow-md">
            Jane is a passionate music teacher with over 15 years of experience inspiring students of all ages. She specializes in piano lessons tailored to each individual’s goals.
          </p>
          <Link href="/about">
            <button className="bg-white text-[var(--accent)] font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="mb-16 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-[var(--accent)]">Group Pricing</h2>
        <p className="text-lg mb-2">Starting at <span className="font-bold">$50</span> per group session.</p>
        <p className="italic text-neutral-600 dark:text-neutral-400">Contact for individual class pricing.</p>
      </section>

      {/* CONTACT */}
      <section className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-24">
        <h2 className="text-3xl font-semibold mb-6 text-[var(--accent)] text-center">Contact Information</h2>
        <div className="space-y-4 text-center">
          <p className="text-lg">
            📧 Email: <a href="mailto:music.teacher@example.com" className="text-indigo-600 hover:underline dark:text-indigo-400">music.teacher@example.com</a>
          </p>
          <p className="text-lg">
            📞 Phone: <a href="tel:+1234567890" className="text-indigo-600 hover:underline dark:text-indigo-400">(123) 456-7890</a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-6 text-center text-neutral-500 dark:text-neutral-400 text-sm border-t border-neutral-300 dark:border-neutral-700">
        © 2025 Buzz Financial
      </footer>
    </div>
  );
}

'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-serif bg-[var(--background)] text-[var(--foreground)] min-h-screen">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-12">
        {/* Left side: title and subtitle */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">MUSIC LESSONS</h1>
          <p className="mt-1 text-lg text-neutral-600 dark:text-neutral-400">
            Personalized. Professional. Powerful.
          </p>
        </div>

        {/* Right side: buttons in one row */}
        <div className="flex gap-4">
          <Link href="/signup">
            <button className="btn-accent px-6 py-2 rounded">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => router.push('/demodashboard')}
            className="btn-outline px-6 py-2 rounded"
          >
            My Dash
          </button>
        </div>
      </header>

      {/* TEACHER INTRO */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 flex flex-col sm:flex-row items-center gap-8 mb-12">
        {/* Image on left */}
        <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
          <img
            src="/stockwoman.jpg"
            alt="Photo of the music teacher"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Text on right */}
        <div className="flex flex-col gap-4 max-w-xl">
          <h2 className="text-3xl font-semibold">Meet Jane Doe</h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-lg">
            Jane is a passionate music teacher with over 15 years of experience inspiring students of all ages. She specializes in piano and guitar lessons tailored to each individual’s goals.
          </p>
          <Link href="/about">
            <button className="btn-accent w-max mt-2 px-6 py-2 rounded">
              Learn More
            </button>
          </Link>
        </div>
      </section>


      {/* Pricing Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Group Pricing</h2>
        <p>Starting at $50 per group session.</p>
        <p className="italic mt-2">Contact for individual class pricing.</p>
      </section>

      {/* Contact Info Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p>
          Email: <a href="mailto:music.teacher@example.com" className="text-[var(--accent)] hover:underline">music.teacher@example.com</a>
        </p>
        <p>
          Phone: <a href="tel:+1234567890" className="text-[var(--accent)] hover:underline">(123) 456-7890</a>
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-neutral-500 dark:text-neutral-400 text-sm">
        © 2025 Buzz Financial
      </footer>
    </div>
  );
}

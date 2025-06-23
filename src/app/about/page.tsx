'use client';

import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 font-serif bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6 sm:gap-0">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--accent)] drop-shadow-md">
            About the Instructor
          </h1>
          <p className="mt-2 text-xl text-neutral-600 max-w-md">
            Learn more about who’s behind the music.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/">
            <button className="btn-outline px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 font-semibold w-full sm:w-auto">
              ⬅ Back Home
            </button>
          </Link>
        </div>
      </header>

      {/* HERO / INTRO SECTION */}
      <section className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 rounded-2xl shadow-lg p-10 flex flex-col sm:flex-row items-center gap-10 mb-16 text-white">
        <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="/stockwoman.jpg"
            alt="Teacher portrait"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        <div className="max-w-lg space-y-4 w-full">
          <h2 className="text-4xl font-bold drop-shadow-lg">Meet Jane Doe</h2>
          <p className="text-lg leading-relaxed drop-shadow-md">
            Hello! I’m <strong>Jane Doe</strong>, a passionate and experienced music educator with over <strong>15 years</strong> of teaching piano. I work with students of all ages — from wide-eyed beginners to seasoned players looking to level up.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="mb-24 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-[var(--accent)] mb-6">Teaching Philosophy</h2>
        <p className="text-lg text-neutral-700 leading-relaxed">
          My lessons focus on building confidence, mastering technique, and — most importantly — keeping music fun and engaging. I tailor each session to the individual student’s goals, pace, and personality. Whether you want to read sheet music, play by ear, or prep for performances, I’ll help you get there with expert guidance and encouragement.
        </p>
      </section>

      {/* CTA BUTTON */}
      <section className="text-center mb-24">
        <p className="text-lg mb-4 text-neutral-700">
          Ready to get started? Book your first lesson today or reach out with any questions.
        </p>
        <Link href="/login">
          <button className="bg-[var(--accent)] text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors font-semibold">
            Sign Up for Lessons
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-6 text-center text-neutral-500 text-base sm:text-sm border-t border-neutral-300">
        © 2025 Buzz Financial
      </footer>
    </div>
  );
}

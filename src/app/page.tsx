'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import React, { useState, useEffect } from "react";


function StudentSuccessRotator() {
  const testimonials = [
    {
      quote: "After just a few months with Jane, I was confidently performing in front of my friends and family!",
      name: "Alex",
      detail: "beginner piano student",
    },
    {
      quote: "Jane's teaching method helped me finally understand music theory. She's amazing!",
      name: "Chris",
      detail: "intermediate guitar student",
    },
    {
      quote: "I used to be terrified of recitals. Now I look forward to them!",
      name: "Taylor",
      detail: "vocal student",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section className="bg-white p-8 rounded-xl shadow-md mb-20 text-center max-w-3xl mx-auto transition-all duration-500 ease-in-out">
      <h3 className="text-2xl font-semibold text-[var(--accent)] mb-4">Student Success</h3>
      <p className="text-lg text-neutral-700 italic transition-opacity duration-500">
        &quot;{current.quote}&quot;
      </p>
      <p className="mt-2 font-semibold">— {current.name}, {current.detail}</p>
    </section>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 font-serif bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6 sm:gap-0">
        {/* Left side: title and subtitle */}
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--accent)] drop-shadow-md">
            MUSIC LESSONS
          </h1>
          <p className="mt-2 text-xl text-neutral-600 max-w-md">
            Personalized. Professional. Powerful.
          </p>
        </div>

        {/* Right side: buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/signup">
            <button className="btn-accent px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 font-semibold w-full sm:w-auto">
              Sign Up
            </button>
          </Link>
          <button
            onClick={() => router.push('/demodashboard/studentdash/')}
            className="btn-outline px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 font-semibold w-full sm:w-auto"
          >
            My Dash
          </button>
        </div>
      </header>

      {/* HERO / TEACHER INTRO */}
      <section className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 rounded-2xl shadow-lg p-10 flex flex-col sm:flex-row items-center gap-10 mb-16 text-white">
        <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="/stockwoman.jpg"
            alt="Teacher portrait"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority={true}
          />
        </div>


        <div className="max-w-lg space-y-4 w-full">
          <h2 className="text-4xl font-bold drop-shadow-lg">Meet Jane Doe</h2>
          <p className="text-lg leading-relaxed drop-shadow-md">
            Jane is a passionate music teacher with over 15 years of experience inspiring students of all ages. She specializes in piano lessons tailored to each individual’s goals.
          </p>
          <Link href="/about">
            <button className="bg-white text-[var(--accent)] font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
<section className="mb-24 text-center">
  <h2 className="text-4xl font-bold text-[var(--accent)] mb-10">How It Works</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-4">

    {/* Step 1 */}
    <div className="flex flex-col items-center bg-white  rounded-xl shadow-md p-6">
      <span className="text-4xl mb-4">📝</span>
      <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
      <p className="text-neutral-600 text-sm">Create your account to get started and explore your dashboard.</p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center bg-white  rounded-xl shadow-md p-6">
      <span className="text-4xl mb-4">💳</span>
      <h3 className="text-xl font-semibold mb-2">Buy Lessons</h3>
      <p className="text-neutral-600 text-sm">Choose a lesson package that fits your goals and schedule.</p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6">
      <span className="text-4xl mb-4">📅</span>
      <h3 className="text-xl font-semibold mb-2">Book a Time</h3>
      <p className="text-neutral-600 text-sm">Reserve your lesson slot with our easy booking tool.</p>
    </div>

    {/* Step 4 */}
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6">
      <span className="text-4xl mb-4">🎵</span>
      <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
      <p className="text-neutral-600 text-sm">Join your lessons and grow your skills with personalized guidance.</p>
    </div>

  </div>
</section>


<StudentSuccessRotator />



      {/* PRICING + CONTACT CONTAINER */}
      <section className="flex flex-col sm:flex-row sm:justify-center sm:gap-20 mb-24 max-w-6xl mx-auto px-4">
  {/* PRICING */}
  <div className="flex-1 max-w-md bg-white rounded-xl shadow-md p-8 mb-10 sm:mb-0 text-center">
    <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">Group Pricing</h2>
    <p className="text-lg mb-2">Starting at <span className="font-bold">$50</span> per group session.</p>
    <p className="italic text-neutral-600">Contact for individual class pricing.</p>
  </div>

  {/* CONTACT */}
  <div className="flex-1 max-w-md bg-white rounded-xl shadow-md p-8 text-center">
    <h2 className="text-2xl font-semibold mb-6 text-[var(--accent)]">Contact</h2>
    <div className="space-y-4">
      <p className="text-lg">
        📧 Email: <a href="mailto:music.teacher@example.com" className="text-indigo-600 hover:underline">music.teacher@example.com</a>
      </p>
      <p className="text-lg">
        📞 Phone: <a href="tel:+1234567890" className="text-indigo-600 hover:underline">(123) 456-7890</a>
      </p>
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="mt-auto py-6 text-center text-neutral-500 text-base sm:text-sm border-t border-neutral-300">
        © 2025 Buzz Financial
      </footer>
    </div>
  );
}

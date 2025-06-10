import Link from "next/link";

export default function About() {
  return (
    <>
      {/* HEADER */}
      <header className="bg-indigo-700 text-white p-4 shadow flex items-center">
        <Link href="/" className="font-semibold text-lg hover:underline">
          &larr; Back to Homepage
        </Link>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8 space-y-12">

        {/* PAGE TITLE */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 dark:text-white">
          Meet Your Instructor
        </h1>

        {/* PROFILE SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0 w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-indigo-500">
            <img
              src="/stockwoman.jpg"
              alt="Teacher portrait"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          <section className="flex-1 text-gray-800 dark:text-gray-300 text-lg space-y-6 leading-relaxed">
            <p>
              Hello! I’m <strong>[Teacher Name]</strong>, a passionate and experienced music educator with over <strong>X years</strong> of teaching piano.
              I work with students of all ages — from wide-eyed beginners to seasoned players looking to level up.
            </p>
            <p>
              My lessons focus on building confidence, mastering technique, and — most importantly — keeping music fun and engaging. I tailor each session to the individual student’s goals, pace, and personality.
            </p>
            <p>
              Whether you want to read sheet music, play by ear, or prep for performances, I’ll help you get there with expert guidance and encouragement.
            </p>
          </section>
        </div>

        {/* CALL TO ACTION */}
        <div className="text-center">
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Ready to get started? Book your first lesson today or reach out with any questions.
          </p>
          <Link href="/signup">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors font-semibold">
              Sign Up for Lessons
            </button>
          </Link>
        </div>

      </main>
    </>
  );
}

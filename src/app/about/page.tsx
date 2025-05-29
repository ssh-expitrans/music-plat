import Link from "next/link";

export default function About() {
  return (
    <>
      <header className="bg-indigo-700 text-white p-4 shadow flex items-center">
        <Link href="/" className="font-semibold text-lg hover:underline">
          &larr; Back to Homepage
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
          About the Teacher
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0 w-64 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-indigo-500">
            <img
              src="/teacher-photo.jpg"
              alt="Teacher portrait"
              className="object-cover w-full h-full"
            />
          </div>

          <section className="flex-1 text-gray-800 dark:text-gray-300 text-lg space-y-6">
            <p>
              Hi! I’m <strong>[Teacher Name]</strong>, a passionate music teacher with over <strong>X years</strong> of experience.
              I specialize in piano, guitar, and voice lessons tailored to all ages and skill levels.
            </p>
            <p>
              My teaching style focuses on building confidence and fostering a lifelong love of music.
              Whether you’re a beginner or preparing for advanced exams, I’m here to guide you every step of the way.
            </p>
            <p>
              Feel free to reach out if you have any questions or want to schedule a lesson!
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

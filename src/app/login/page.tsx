import Link from "next/link";

export default function Login() {
  return (
    <>
      <header className="bg-indigo-700 text-white p-4 shadow flex items-center">
        <Link href="/" className="font-semibold text-lg hover:underline">
          &larr; Back to Homepage
        </Link>
      </header>

      <main className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h1>
        <form className="flex flex-col gap-4">
          <label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:underline self-end"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white rounded py-2 font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          No account yet?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign up here
          </Link>
          .
        </p>
      </main>
    </>
  );
}

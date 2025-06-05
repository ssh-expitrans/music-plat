"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage("Account created! Please check your email to verify your account.");
      }

      setLoading(false);

      // Optionally redirect or require email verification before login
      // router.push("/login");
    } catch (err: any) {
      setError(err.message || "Sign-up failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="bg-indigo-700 text-white p-4 shadow flex items-center">
        <Link href="/" className="font-semibold text-lg hover:underline">
          &larr; Back to Homepage
        </Link>
      </header>

      <main className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Sign Up
        </h1>

        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        {message && (
          <p className="mb-4 text-green-600 font-semibold text-center">{message}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-semibold">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-indigo-600 text-white rounded py-2 font-semibold hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log in here
          </Link>
          .
        </p>
      </main>
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Cookies from "js-cookie";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  async function handleResetPassword() {
    const email = prompt("Enter your email to reset password:");
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      alert(err.message || "Failed to send reset email.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Get Firebase ID Token (JWT)
      const idToken = await user.getIdToken();

      // Save token as cookie (valid for 1 day)
      Cookies.set("token", idToken, { expires: 1 });

      router.push("/dashboard/personal");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
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
          Login
        </h1>

        {error && <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>}

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
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-indigo-600 hover:underline self-end"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-indigo-600 text-white rounded py-2 font-semibold hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
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

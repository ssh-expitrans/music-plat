'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // if you’ve set up Firestore


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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

        await setDoc(doc(db, "students", user.uid), {
        name: email.split("@")[0],
        email: email,
        bookings: [],
      });

      setMessage("Account created successfully! Please check your email to verify your account before logging in.");
      
      // Optionally redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle specific Firebase errors
        if (err.message.includes("email-already-in-use")) {
          setError("This email is already registered. Please use a different email or try logging in.");
        } else if (err.message.includes("weak-password")) {
          setError("Password is too weak. Please use a stronger password.");
        } else if (err.message.includes("invalid-email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-serif flex flex-col">
      
      {/* HEADER */}
      <header className="px-6 py-4">
        <Link href="/" className="text-[var(--accent)] font-semibold hover:underline">
          ← Back to Homepage
        </Link>
      </header>

      {/* FORM CONTAINER */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full space-y-6">
          <h1 className="text-4xl font-bold text-center text-[var(--accent)]">Sign Up</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm text-center font-medium">
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password (min 6 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:bg-indigo-700 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            Already have an account with us?{" "}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
              Log in here
            </Link>
            .
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-neutral-500 text-sm border-t border-neutral-300 mt-10">
        © 2025 Buzz Financial
      </footer>
    </div>
  );
}
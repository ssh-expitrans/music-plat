"use client"; // mark as client component

import React, { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (loading) return;

  const form = event.currentTarget;
  setLoading(true);
  setError("");
  setSuccess("");

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";

  if (!name || !email || !password) {
    setError("Please fill all required fields.");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      setError("Invalid server response.");
      setLoading(false);
      return;
    }

    console.log("Response status:", res.status);
    console.log("Response data:", data);

    if (res.status === 201) {
      setSuccess("Signup successful! You can now log in.");
      setError("");
      form.reset(); // ✅ This is safe and won’t crash
    } else if (res.status === 409) {
      setError("Email already registered");
      setSuccess("");
    } else if (!res.ok) {
      setError(data.error || `Error: ${res.status}`);
      setSuccess("");
    }

  } catch (err) {
    console.error("Network or fetch error:", err);
    setError("Network error, please try again.");
    setSuccess("");
  } finally {
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
        {success && (
          <p className="mb-4 text-green-600 font-semibold text-center">{success}</p>
        )}

        <form
          id="signup-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="name"
            className="text-gray-700 dark:text-gray-300 font-semibold"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <label
            htmlFor="email"
            className="text-gray-700 dark:text-gray-300 font-semibold"
          >
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

          <label
            htmlFor="password"
            className="text-gray-700 dark:text-gray-300 font-semibold"
          >
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
            type="submit"
            disabled={loading}
            className={`mt-4 bg-indigo-600 text-white rounded py-2 font-semibold hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already signed up?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log in here
          </Link>
          .
        </p>
      </main>
    </>
  );
}

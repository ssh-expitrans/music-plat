// components/Login.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Sign up form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await signUp(email, password, {
          firstName,
          lastName,
          role,
        });
        // After sign up, redirect based on role
        if (role === 'teacher') {
          router.push('/demodashboard/teacherdash/real');
        } else {
          router.push('/demodashboard/studentdash/real');
        }
      } else {
        await signIn(email, password);
        // After login, redirect based on role
        // Fetch user profile to determine role
        // (Assume signIn sets user in context, so we can check after)
        // Wait a tick for context to update
        setTimeout(() => {
          const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
          if (userProfile.role === 'teacher') {
            router.push('/demodashboard/teacherdash/real');
          } else {
            router.push('/demodashboard/studentdash/real');
          }
        }, 500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login buttons
  const handleDemoLogin = (demoRole: 'student' | 'teacher') => {
    if (demoRole === 'student') {
      router.push('/demodashboard/studentdash');
    } else {
      router.push('/demodashboard/teacherdash');
    }
  };

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
          <h1 className="text-4xl font-bold text-center text-[var(--accent)]">
            {isSignUp ? 'Create Account' : 'Login'}
          </h1>

          {/* Demo Buttons */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-neutral-600 mb-3 text-center font-medium">Try the demo:</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDemoLogin('student')}
                className="flex-1 bg-[var(--accent)] hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Student Demo
              </button>
              <button
                onClick={() => handleDemoLogin('teacher')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Teacher Demo
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with real account</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    disabled={isLoading}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:bg-indigo-700 transition ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--accent)] hover:underline font-medium"
            >
              {isSignUp ? 'Sign in here' : 'Sign up here'}
            </button>
            .
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-neutral-500 text-sm border-t border-neutral-300 mt-10">
        © 2025 Music Learning Platform
      </footer>
    </div>
  );
}
// app/student/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function StudentPage() {
  const [userData, setUserData] = useState<{ email: string; userId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll simulate authentication
    // In a real app, you'd check localStorage, sessionStorage, or make an API call
    
    // Simulate loading
    setTimeout(() => {
      // For demo purposes, set some mock data
      // Replace this with actual authentication logic
      const mockUser = {
        email: "student@example.com",
        userId: "student123"
      };
      
      setUserData(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
        <p className="mt-2 text-gray-500">Please wait while we load your dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Session Expired</h1>
        <p className="mt-2 text-gray-700">Please log in again to continue.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-700">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        Welcome, {userData.email}
      </h1>
      <p className="text-gray-600 mb-4">This is your student dashboard.</p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow">
        <p className="text-gray-700 dark:text-gray-200">User ID: {userData.userId}</p>
      </div>
    </div>
  );
}
// app/dashboard/personal/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export default async function PersonalDashboard() {
  const cookieStore = await Promise.resolve(cookies()); // force TypeScript to resolve sync type
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-700">You must be logged in to view this page.</p>
      </div>
    );
  }

  let userData;
  try {
    userData = jwt.verify(token, JWT_SECRET) as { email: string; userId: string };
  } catch {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Session Expired</h1>
        <p className="mt-2 text-gray-700">Please log in again to continue.</p>
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

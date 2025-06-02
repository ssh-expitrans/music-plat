"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      alert("Logout failed. Try again.");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}

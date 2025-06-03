"use client";

import { useState } from "react";

const tabs = ["Personal", "Book", "Buy", "Reschedule", "Account"];

export default function DemoDashboard() {
  const [selectedTab, setSelectedTab] = useState("Personal");

  const renderContent = () => {
    switch (selectedTab) {
      case "Personal":
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold mb-4">Student Information</h2>
            <p><strong>Name:</strong> Johnny Example</p>
            <p><strong>Date of Birth:</strong> 2012-08-15</p>
            <p><strong>Age Group:</strong> Child (8–12)</p>
            <p><strong>Skill Level:</strong> Beginner</p>
            <p><strong>Contact Email:</strong> johnny@example.com</p>
          </div>
        );
      case "Book":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Book Lessons</h2>
            <p className="italic text-gray-600">[Calendar integration coming soon]</p>
          </div>
        );
      case "Buy":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Buy Lessons</h2>
            <button className="px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Buy Lesson Packages
            </button>
          </div>
        );
      case "Reschedule":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reschedule Lessons</h2>
            <p className="italic text-gray-600">[Coming soon]</p>
          </div>
        );
      case "Account":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Account</h2>
            <p>This is a demo dashboard. To access your personalized dashboard, please sign up for an account.</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <a
                href="/signup"
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="text-blue-600 hover:underline text-sm"
              >
                Already have an account? Log in
              </a>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-48 bg-gray-800 text-white flex flex-col p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-left px-3 py-2 rounded ${
              selectedTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* Content area */}
      <section className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => {
              document.cookie = "token=; path=/; max-age=0;";
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </header>
        {renderContent()}
      </section>
    </main>
  );
}

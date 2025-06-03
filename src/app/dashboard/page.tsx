"use client";

import { useState } from "react";

const tabs = ["Home", "Personal", "Book", "Buy", "Reschedule", "Account"];

function getCurrentWeekDays(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

function getMonthDays(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function DemoDashboard() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const renderContent = () => {
    switch (selectedTab) {
      case "Home":
        const today = new Date();
        const monthDays = getMonthDays(today.getFullYear(), today.getMonth());

        return (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">
                Welcome Back, Johnny!
              </h2>
              <p className="text-gray-800">
                Your next session is on <strong>Maytember 16 at 3:00 PM</strong>.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                This Month's Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="font-bold text-sm text-gray-600">
                    {day}
                  </div>
                ))}
                {/* Padding for first day of the month */}
                {Array(monthDays[0].getDay())
                  .fill(null)
                  .map((_, idx) => (
                    <div key={`pad-${idx}`}></div>
                  ))}
                {monthDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={`py-2 rounded cursor-default ${
                      day.toDateString() === today.toDateString()
                        ? "bg-yellow-400 font-bold text-blue-900"
                        : "hover:bg-yellow-100"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Assigned Homework
              </h3>
              <ul className="list-disc list-inside text-gray-800">
                <li>Practice C major scale 5 times</li>
                <li>Watch jazz phrasing video (10 min)</li>
              </ul>
            </div>
          </div>
        );

      case "Personal":
        return (
          <div className="bg-white p-6 rounded-lg shadow space-y-2">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Student Information
            </h2>
            <p className="text-gray-800">
              <strong>Name:</strong> Johnny Example
            </p>
            <p className="text-gray-800">
              <strong>Date of Birth:</strong> 2012-08-15
            </p>
            <p className="text-gray-800">
              <strong>Age Group:</strong> Child (8–12)
            </p>
            <p className="text-gray-800">
              <strong>Skill Level:</strong> Beginner
            </p>
            <p className="text-gray-800">
              <strong>Contact Email:</strong> johnny@example.com
            </p>
          </div>
        );

      case "Book":
        const weekDays = getCurrentWeekDays();

        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Book Lessons</h2>
            <div className="flex justify-between gap-2">
              {weekDays.map((date) => {
                const dayNum = date.getDate();
                const isSelected = selectedDay === dayNum;
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`flex-1 py-3 rounded border transition flex flex-col items-center
                      ${
                        isSelected
                          ? "bg-yellow-400 text-blue-900 font-bold"
                          : "bg-gray-100 hover:bg-yellow-200"
                      }
                      ${isToday ? "ring-2 ring-yellow-400" : ""}
                    `}
                    aria-label={`Select day ${dayNum}, ${date.toDateString()}`}
                  >
                    <span className="text-xs font-semibold text-gray-600">
                      {date.toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </span>
                    <span className="text-lg">{dayNum}</span>
                  </button>
                );
              })}
            </div>
            {selectedDay && (
              <p className="mt-4 text-blue-700 font-semibold">
                You selected{" "}
                {new Date(
                  new Date().setDate(selectedDay)
                ).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        );

      case "Buy":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Buy Lessons</h2>
            <button className="px-5 py-3 bg-yellow-400 text-blue-800 rounded hover:bg-yellow-300 transition font-semibold">
              Buy Lesson Packages
            </button>
          </div>
        );

      case "Reschedule":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Reschedule Lessons
            </h2>
            <p className="italic text-gray-800">[Coming soon]</p>
          </div>
        );

      case "Account":
        return (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Account</h2>
            <p className="text-gray-800">
              This is a demo dashboard. To access your personalized dashboard,
              please sign up for an account.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <a
                href="/signup"
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </a>
              <a href="/login" className="text-blue-600 hover:underline text-sm">
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
    <main className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-blue-600 text-white flex flex-col p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-left px-3 py-2 rounded font-semibold ${
              selectedTab === tab
                ? "bg-yellow-400 text-blue-800"
                : "hover:bg-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* Content area */}
      <section className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
          <button
            className="px-4 py-2 bg-yellow-400 text-blue-800 font-semibold rounded hover:bg-yellow-300 transition"
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

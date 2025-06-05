"use client";

import React, { useState } from "react";

const tabs = ["Students", "Upcoming", "Settings"];

const skillOrder = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const studentsDemo: {
  name: string;
  level: SkillLevel;
  ageRange: string;
  progress: number;
}[] = [
  { name: "Emma Johnson", level: "Beginner", ageRange: "8-10", progress: 60 },
  { name: "Liam Torres", level: "Intermediate", ageRange: "11-13", progress: 80 },
  { name: "Ava Chen", level: "Advanced", ageRange: "14-16", progress: 95 },
  { name: "Noah Williams", level: "Beginner", ageRange: "7-9", progress: 40 },
  { name: "Sophia Martinez", level: "Intermediate", ageRange: "12-14", progress: 70 },
  { name: "Mason Brown", level: "Advanced", ageRange: "15-17", progress: 85 },
];


type SortOption = "name" | "age" | "skill" | "progress";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";


export default function TeacherDemoDashboard() {
  const [activeTab, setActiveTab] = useState("Students");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Helper to parse ageRange strings like "8-10" => min age number (8)
  function getMinAge(ageRange: string) {
    const parts = ageRange.split("-");
    return parts.length === 2 ? parseInt(parts[0], 10) : 0;
  }

  // Sort students according to selected sort
  const sortedStudents = [...studentsDemo].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "age":
        return getMinAge(a.ageRange) - getMinAge(b.ageRange);
      case "skill":
        return (skillOrder[a.level] || 0) - (skillOrder[b.level] || 0);
      case "progress":
        return a.progress - b.progress;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard (Demo)</h1>
          <p className="text-gray-500">Preview what your studio management experience could look like.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-md font-semibold transition ${
                activeTab === tab
                  ? "bg-white text-blue-700 shadow border-t-2 border-blue-500"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {activeTab === "Students" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Students</h2>
                <div className="flex items-center space-x-4">
                  {/* View mode buttons */}
                  <div>
                    <button
                      onClick={() => setViewMode("card")}
                      className={`px-3 py-1 rounded-l border ${
                        viewMode === "card"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Card View
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1 rounded-r border ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      List View
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div>
                    <label htmlFor="sort" className="sr-only">Sort students</label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border rounded p-1 text-gray-700"
                    >
                      <option value="name">Alphabetical</option>
                      <option value="age">Age Range (Low to High)</option>
                      <option value="skill">Skill Level</option>
                      <option value="progress">Progress</option>
                    </select>
                  </div>
                </div>
              </div>

              {viewMode === "card" ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {sortedStudents.map((student, index) => (
                    <div key={index} className="border rounded p-4 bg-gray-50">
                      <h3 className="font-bold text-lg">{student.name}</h3>
                      <p className="text-gray-700">
                        Level: {student.level} | Age Range: {student.ageRange} years
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Progress
                        </label>
                        <div className="w-full bg-gray-300 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{student.progress}% complete</p>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Assign Homework
                        </button>
                        <button className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">
                          Add Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  {sortedStudents.map((student, index) => (
                    <div
                      key={index}
                      className="border rounded p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="sm:w-1/3 min-w-[200px]">
                        <h3 className="font-bold text-lg">{student.name}</h3>
                        <p className="text-gray-700">
                          Level: {student.level} | Age Range: {student.ageRange} years
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full sm:w-1/3 mt-3 sm:mt-0">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Progress
                        </label>
                        <div className="w-full bg-gray-300 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{student.progress}% complete</p>
                      </div>

                      <div className="mt-3 sm:mt-0 flex space-x-2">
                        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Assign Homework
                        </button>
                        <button className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">
                          Add Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Upcoming" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Lessons</h2>
              <ul className="space-y-3">
                <li className="border-l-4 border-blue-500 pl-3">
                  Mon, June 10 – 3:00 PM: Emma Johnson
                </li>
                <li className="border-l-4 border-blue-500 pl-3">
                  Tue, June 11 – 4:00 PM: Liam Torres
                </li>
                <li className="border-l-4 border-blue-500 pl-3">
                  Wed, June 12 – 5:30 PM: Ava Chen
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">*Full calendar view coming in the real dashboard.</p>
            </div>
          )}

{activeTab === "Settings" && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

    {/* Personal Account Settings */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Personal Account</h3>
      
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border">
          <img
            src="/stockwoman.jpg"
            alt="Profile Picture"
            className="object-cover w-full h-full"
          />
        </div>
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Change Picture
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div>
        <label htmlFor="bio" className="block font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          className="w-full p-2 border rounded resize-none"
          placeholder="Write a short bio..."
          defaultValue="Music teacher with 10 years of experience..."
        />
      </div>
    </div>

    {/* Update Rate */}
    <div>
      <label htmlFor="updateRate" className="block font-medium text-gray-700 mb-1">
        Update Frequency
      </label>
      <select
        id="updateRate"
        className="w-full p-2 border rounded"
        defaultValue="weekly"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="never">Never</option>
      </select>
    </div>

    {/* Availability Type */}
    <div>
      <label htmlFor="availabilityType" className="block font-medium text-gray-700 mb-1">
        Availability Type
      </label>
      <select
        id="availabilityType"
        className="w-full p-2 border rounded"
        defaultValue="fixed"
      >
        <option value="fixed">Fixed Schedule</option>
        <option value="flexible">Flexible</option>
        <option value="on-demand">On Demand</option>
      </select>
    </div>

    {/* Studio Settings (existing) */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700">Available Days:</label>
        <input
          type="text"
          defaultValue="Mon, Wed, Fri"
          className="w-full mt-1 p-2 border rounded"
          disabled
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Age Range:</label>
        <input
          type="text"
          defaultValue="7-14 years"
          className="w-full mt-1 p-2 border rounded"
          disabled
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Skill Levels:</label>
        <input
          type="text"
          defaultValue="Beginner to Advanced"
          className="w-full mt-1 p-2 border rounded"
          disabled
        />
      </div>
    </div>

    {/* Back to Main Site */}
    <div className="mt-6 text-center">
      <a
        href="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Main Site
      </a>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

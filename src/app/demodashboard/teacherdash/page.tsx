"use client";

import React, { useState } from "react";

const tabs = ["Students", "Upcoming", "Homework", "Notes", "Calendar", "Settings"];

const skillOrder = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

type Student = {
  name: string;
  level: SkillLevel;
  ageRange: string;
  progress: number;
  profilePic: string; // URL or path to student pic
};

const studentsDemo: Student[] = [
  { name: "Emma Johnson", level: "Beginner", ageRange: "8-10", progress: 60, profilePic: "/students/emma.jpg" },
  { name: "Liam Torres", level: "Intermediate", ageRange: "11-13", progress: 80, profilePic: "/students/liam.jpg" },
  { name: "Ava Chen", level: "Advanced", ageRange: "14-16", progress: 95, profilePic: "/students/ava.jpg" },
  { name: "Noah Williams", level: "Beginner", ageRange: "7-9", progress: 40, profilePic: "/students/noah.jpg" },
  { name: "Sophia Martinez", level: "Intermediate", ageRange: "12-14", progress: 70, profilePic: "/students/sophia.jpg" },
  { name: "Mason Brown", level: "Advanced", ageRange: "15-17", progress: 85, profilePic: "/students/mason.jpg" },
];

type SortOption = "name" | "age" | "skill" | "progress";

export default function TeacherDemoDashboard() {
  const [activeTab, setActiveTab] = useState<string>("Students");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // For Calendar blocking days
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  });

  // Helper to parse min age from ageRange string e.g. "8-10"
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

  // Generate calendar dates for current month (simple for demo)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Generate all dates in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDates = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });

  // Toggle block day
  function toggleBlockDate(dateStr: string) {
    setBlockedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  }

  // Handle contact info input changes
  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard (Demo)</h1>
          <p className="text-gray-500">Preview what your studio management experience could look like.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0">
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
        <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
          {/* Students Tab */}
          {activeTab === "Students" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Students</h2>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
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
                    <label htmlFor="sort" className="sr-only">
                      Sort students
                    </label>
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
                    <div key={index} className="border rounded p-4 bg-gray-50 flex space-x-4 items-center">
                      {/* Profile Pic */}
                      <div className="w-20 h-20 rounded-full overflow-hidden border shadow">
                        <img
                          src={student.profilePic}
                          alt={`${student.name} profile`}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Info + progress */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{student.name}</h3>
                        <p className="text-gray-700">
                          Level: {student.level} | Age Range: {student.ageRange} years
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-3 max-w-xs">
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
                      <div className="sm:w-1/3 min-w-[200px] flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border shadow">
                          <img
                            src={student.profilePic}
                            alt={`${student.name} profile`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{student.name}</h3>
                          <p className="text-gray-700">
                            Level: {student.level} | Age Range: {student.ageRange} years
                          </p>
                        </div>
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

          {/* Upcoming Tab */}
          {activeTab === "Upcoming" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Lessons</h2>
              <ul className="space-y-3">
                <li className="border-l-4 border-blue-500 pl-3">Mon, June 10 – 3:00 PM: Emma Johnson</li>
                <li className="border-l-4 border-blue-500 pl-3">Tue, June 11 – 4:00 PM: Liam Torres</li>
                <li className="border-l-4 border-blue-500 pl-3">Wed, June 12 – 5:30 PM: Ava Chen</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">*Full calendar view coming in the real dashboard.</p>
            </div>
          )}

          {/* Homework Tab */}
          {activeTab === "Homework" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Homework Assignments</h2>
              <p>Here you would see and assign homework to students.</p>
              {/* For demo, just placeholders */}
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Emma Johnson: Practice scales - 15 minutes</li>
                <li>Liam Torres: Learn Song A - 3 pages</li>
                <li>Ava Chen: Sight reading exercises</li>
              </ul>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "Notes" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Notes</h2>
              <p>Manage your notes about students here.</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Emma Johnson: Needs to focus on timing</li>
                <li>Liam Torres: Great improvement in rhythm</li>
                <li>Ava Chen: Ready for advanced theory</li>
              </ul>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "Calendar" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar (Block Out Days)</h2>
              <p>Select days to block out for unavailability. Blocked days will be highlighted in red.</p>

              <div className="grid grid-cols-7 gap-2 mt-4 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="font-semibold text-gray-600">
                    {d}
                  </div>
                ))}

                {/* Add empty slots for first day offset */}
                {Array(new Date(year, month, 1).getDay())
                  .fill(null)
                  .map((_, i) => (
                    <div key={"empty" + i} />
                  ))}

                {calendarDates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isBlocked = blockedDates.includes(dateStr);
                  const isToday = dateStr === today.toISOString().split("T")[0];

                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleBlockDate(dateStr)}
                      className={`py-2 rounded border transition ${
                        isBlocked
                          ? "bg-red-600 text-white border-red-700"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      } ${isToday ? "font-bold underline" : ""}`}
                      title={isBlocked ? "Click to unblock" : "Click to block"}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
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

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Contact Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      className="w-full p-2 border rounded"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      className="w-full p-2 border rounded"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={contactInfo.address}
                      onChange={handleContactChange}
                      rows={2}
                      className="w-full p-2 border rounded resize-none"
                      placeholder="123 Main St, City, State ZIP"
                    />
                  </div>
                </div>
              </div>

              {/* Update Rate Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Rate</h3>
                <p className="text-gray-600">Your hourly rate for lessons is $50/hour.</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Update Rate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

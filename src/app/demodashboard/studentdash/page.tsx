"use client";

import React, { useState } from "react";

const tabs = ["Home", "Book", "Buy", "Upcoming", "Account"];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];


// Hardcoded demo bookings: key = "DayString-TimeString"
const demoSlotData: Record<string, { booked: number; skill: string; ageGroup: string }> = {
  "Sun Jun 9 2024-9:00 AM": { booked: 2, skill: "Beginner", ageGroup: "Kids" },
  "Mon Jun 10 2024-10:00 AM": { booked: 5, skill: "Intermediate", ageGroup: "Teens" },
  "Mon Jun 10 2024-2:00 PM": { booked: 3, skill: "Advanced", ageGroup: "Teens" },
  "Tue Jun 11 2024-11:00 AM": { booked: 1, skill: "Advanced", ageGroup: "Teens" },
  "Tue Jun 11 2024-3:30 PM": { booked: 4, skill: "Beginner", ageGroup: "Kids" },
  "Wed Jun 12 2024-1:00 PM": { booked: 3, skill: "Beginner", ageGroup: "Kids" },
  "Wed Jun 12 2024-4:00 PM": { booked: 2, skill: "Intermediate", ageGroup: "Teens" },
  "Thu Jun 13 2024-2:00 PM": { booked: 4, skill: "Intermediate", ageGroup: "Teens" },
  "Thu Jun 13 2024-9:30 AM": { booked: 6, skill: "Advanced", ageGroup: "Teens" },
  "Fri Jun 14 2024-3:00 PM": { booked: 6, skill: "Advanced", ageGroup: "Teens" },
  "Fri Jun 14 2024-12:30 PM": { booked: 2, skill: "Beginner", ageGroup: "Kids" },
};

// Utility: get current week's Sunday-Saturday dates
function getCurrentWeekSundayStart() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // Array to store multiple selections

  // Example kid user info
  const personalInfo = {
    name: "Timmy Turner",
    dob: "2011-09-15",
    ageGroup: "Kids",
    skillLevel: "Beginner",
    email: "timmy.turner@example.com",
    progress: 40,
  };

  const currentWeek = getCurrentWeekSundayStart();

  // Handle slot selection/deselection
  const handleSlotClick = (day: string, time: string) => {
    const slotKey = `${day}-${time}`;
    
    setSelectedSlots(prevSlots => {
      // If slot is already selected, remove it (unclick functionality)
      if (prevSlots.includes(slotKey)) {
        return prevSlots.filter(slot => slot !== slotKey);
      }
      // Otherwise, add it to selections
      return [...prevSlots, slotKey];
    });
  };

  // Check if a slot is selected
  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.includes(`${day}-${time}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Tabs */}
      <nav className="w-48 bg-white border-r border-slate-200 p-4 flex flex-col space-y-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab !== "Book") {
                setSelectedSlots([]); // Clear selections when switching tabs
              }
            }}
            className={`py-3 px-4 rounded-lg text-left font-medium hover:bg-indigo-50 transition-colors
              ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-700 hover:text-indigo-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "Home" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-3 text-slate-800">
                Welcome Back, {personalInfo.name}!
              </h2>
              <p className="text-slate-600 text-lg">
                Your next session is on{" "}
                <span className="font-semibold text-indigo-600">June 10 at 10:00 AM</span>.
              </p>
            </div>

            {/* Personal Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">Personal Info</h3>
                <div className="space-y-3">
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">Name:</span> {personalInfo.name}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">Date of Birth:</span> {personalInfo.dob}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">Age Group:</span> {personalInfo.ageGroup}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">Skill Level:</span> {personalInfo.skillLevel}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">Email:</span> {personalInfo.email}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Progress</h3>
                <div className="w-full bg-slate-200 rounded-full h-8">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-8 rounded-full transition-all shadow-sm"
                    style={{ width: `${personalInfo.progress}%` }}
                  />
                </div>
                <p className="text-right text-sm text-slate-600 mt-1">
                  {personalInfo.progress}%
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Beginner Level</span>
                    <span>Intermediate Level</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Great progress! Keep practicing to reach the next level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Book" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-full mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">Book Lessons</h2>

            {/* Selection Summary */}
            {selectedSlots.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">
                  Selected Sessions ({selectedSlots.length}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map((slotKey) => {
                    const [day, time] = slotKey.split('-');
                    const dayName = new Date(day).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                    return (
                      <span
                        key={slotKey}
                        className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {dayName} at {time}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Days horizontally - wider layout */}
            <div className="grid grid-cols-7 gap-4">
              {currentWeek.map((day) => {
                const dayOfWeek = day.getDay();

                // Weekends (Sunday or Saturday) show disabled slots
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  return (
                    <div
                      key={day.toDateString()}
                      className="p-4 border border-slate-200 rounded-lg text-center text-slate-400 bg-slate-50"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {day.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-sm">No slots</p>
                    </div>
                  );
                }

                return (
                  <div
                    key={day.toDateString()}
                    className="p-4 border border-slate-200 rounded-lg flex flex-col items-center bg-white"
                  >
                    <h3 className="text-base font-semibold mb-3 text-slate-800 text-center">
                      {day.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>

                    {/* Time slots container - no scrolling */}
                    <div className="flex flex-col space-y-2 w-full">{timeSlots.map((time) => {
                        const key = `${day.toDateString()}-${time}`;
                        const slot = demoSlotData[key];
                        const isSelected = isSlotSelected(day.toDateString(), time);

                        return (
                          <button
                            key={key}
                            onClick={() => handleSlotClick(day.toDateString(), time)}
                            className={`rounded-md px-3 py-2 border text-xs flex flex-col items-center transition-all min-h-[65px] justify-center
                              ${
                                isSelected
                                  ? "bg-amber-400 text-slate-900 border-amber-400 font-semibold shadow-md"
                                  : "bg-slate-50 text-slate-700 hover:bg-amber-100 border-slate-200 hover:border-amber-200"
                              }`}
                            aria-label={`${isSelected ? 'Unselect' : 'Select'} slot on ${day.toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })} at ${time}`}
                          >
                            <span className="font-semibold text-sm mb-1">{time}</span>
                            {slot ? (
                              <div className="text-xs text-slate-600 flex flex-col items-center space-y-1">
                                <span className="font-medium">{slot.booked}/8</span>
                                <div className="flex flex-col items-center space-y-1">
                                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {slot.skill}
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {slot.ageGroup}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500 flex flex-col items-center space-y-1">
                                <span>0/8</span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                                  Available
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Book Now Section */}
            {selectedSlots.length > 0 && (
              <div className="mt-8 text-center">
                <p className="mb-4 text-slate-700 font-medium text-lg">
                  {selectedSlots.length === 1 
                    ? `You have selected 1 session`
                    : `You have selected ${selectedSlots.length} sessions`
                  }
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSelectedSlots([])}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      const sessions = selectedSlots.map(slotKey => {
                        const [day, time] = slotKey.split('-');
                        const dayName = new Date(day).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        });
                        return `${dayName} at ${time}`;
                      }).join(', ');
                      alert(`Booking confirmed for: ${sessions}`);
                      setSelectedSlots([]);
                    }}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                  >
                    Book {selectedSlots.length} Session{selectedSlots.length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
  
        {activeTab === "Buy" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-800 text-center">Piano Lesson Packages</h2>
            
            {/* Individual Lesson Packages */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-700">Individual Lessons</h3>
              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { 
                    name: "Single Lesson", 
                    price: "$30", 
                    desc: "One 30-minute session",
                    popular: false,
                    features: ["Individual attention", "Flexible scheduling", "Perfect for trying out"]
                  },
                  { 
                    name: "4-Pack", 
                    price: "$115", 
                    desc: "Save $5 on 4 lessons",
                    popular: false,
                    features: ["$28.75 per lesson", "1-month validity", "Great for beginners"]
                  },
                  { 
                    name: "8-Pack", 
                    price: "$220", 
                    desc: "Save $20 on 8 lessons",
                    popular: true,
                    features: ["$27.50 per lesson", "2-month validity", "Most popular choice"]
                  },
                  { 
                    name: "12-Pack", 
                    price: "$315", 
                    desc: "Save $45 on 12 lessons",
                    popular: false,
                    features: ["$26.25 per lesson", "3-month validity", "Best value"]
                  },
                ].map((pkg) => (
                  <div key={pkg.name} className={`border rounded-xl p-6 bg-white shadow-sm relative transition-all hover:shadow-md ${pkg.popular ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h4>
                    <p className="text-slate-600 mb-3">{pkg.desc}</p>
                    <p className="text-3xl font-bold text-indigo-600 mb-4">{pkg.price}</p>
                    <ul className="text-sm text-slate-600 mb-6 space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 rounded-lg font-medium transition-colors ${pkg.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Lesson Options */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-700">Extended Lessons</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { name: "45-Minute Single", price: "$40", desc: "Extended individual session", duration: "45 minutes" },
                  { name: "45-Minute 6-Pack", price: "$225", desc: "Save $15 on extended lessons", duration: "6 x 45-minute sessions" },
                  { name: "60-Minute Single", price: "$50", desc: "Full hour private lesson", duration: "60 minutes" },
                ].map((item) => (
                  <div key={item.name} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">{item.name}</h4>
                    <p className="text-slate-600 text-sm mb-2">{item.desc}</p>
                    <p className="text-xs text-slate-500 mb-3">{item.duration}</p>
                    <p className="text-xl font-bold text-indigo-600 mb-4">{item.price}</p>
                    <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Unlimited */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-700">Monthly Unlimited</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { 
                    name: "Unlimited Standard", 
                    price: "$199/month", 
                    desc: "Unlimited 30-minute lessons",
                    features: ["Book up to 2 lessons per day", "30-minute sessions", "Cancel anytime", "Practice room access"]
                  },
                  { 
                    name: "Unlimited Premium", 
                    price: "$299/month", 
                    desc: "Unlimited lessons + perks",
                    features: ["Mix of 30, 45, 60-minute sessions", "Priority booking", "Sheet music library access", "Recital preparation included"]
                  },
                ].map((membership) => (
                  <div key={membership.name} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{membership.name}</h4>
                    <p className="text-slate-600 mb-3">{membership.desc}</p>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">{membership.price}</p>
                    <ul className="text-sm text-slate-600 mb-6 space-y-2">
                      {membership.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Start Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Piano Programs */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-slate-700">Special Programs</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { 
                    name: "Recital Prep Package", 
                    price: "$150", 
                    desc: "5 focused sessions for performance",
                    duration: "5 x 45-minute sessions"
                  },
                  { 
                    name: "Theory Intensive", 
                    price: "$120", 
                    desc: "4 sessions focused on music theory",
                    duration: "4 x 30-minute sessions"
                  },
                  { 
                    name: "Sight-Reading Bootcamp", 
                    price: "$100", 
                    desc: "6 sessions to improve reading skills",
                    duration: "6 x 30-minute sessions"
                  },
                ].map((program) => (
                  <div key={program.name} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">{program.name}</h4>
                    <p className="text-slate-600 text-sm mb-2">{program.desc}</p>
                    <p className="text-xs text-slate-500 mb-3">{program.duration}</p>
                    <p className="text-xl font-bold text-indigo-600 mb-4">{program.price}</p>
                    <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Upcoming" && (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Upcoming Lessons</h2>
            <ul className="divide-y divide-gray-200">
              <li className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">June 10, 2024 - 10:00 AM</p>
                  <p className="text-slate-700">Piano - Timmy Turner (Beginner, Kids)</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-300">
                    Reschedule
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Cancel
                  </button>
                </div>
              </li>
              <li className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">June 12, 2024 - 1:00 PM</p>
                  <p className="text-slate-700">Piano - Timmy Turner (Beginner, Kids)</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-300">
                    Reschedule
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Cancel
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}

        {activeTab === "Account" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Account</h2>
            <p className="text-slate-700">This is a demo dashboard. Please log in or sign up.</p>
            <button className="mt-6 px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">
              Log In
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/*"use client";

import React, { useState } from "react";

const tabs = ["Home", "Personal", "Book", "Buy", "Upcoming", "Account"];

// Define your time slots (could be customized):
/*const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function getMonthDays(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Hardcoded booked lessons for demo (date keys in YYYY-MM-DD)
const bookedLessons: Record<string, { time: string; students: number }> = {
  "2025-06-03": { time: "10:00 AM", students: 3 },
  "2025-06-05": { time: "2:00 PM", students: 5 },
  "2025-06-12": { time: "11:00 AM", students: 2 },
};

// Format Date to YYYY-MM-DD string
const formatDateKey = (date: Date): string => date.toISOString().split("T")[0];
 /*
export default function DemoDashboard() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // State for "Book" tab: current week start date
 const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    return start;
  });

  // Handlers for week navigation
  const prevWeek = () => {
    setCurrentWeekStart((date) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const nextWeek = () => {
    setCurrentWeekStart((date) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // Generate current week days for "Book"
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  // Hardcoded demo slot counts per day/time (for "Book" tab)
  const demoSlotCounts: { [key: string]: number } = {
    // Monday
    [`${currentWeek[1].toDateString()}-9:00 AM`]: 2,
    [`${currentWeek[1].toDateString()}-10:00 AM`]: 5,
    [`${currentWeek[1].toDateString()}-11:00 AM`]: 1,
    [`${currentWeek[1].toDateString()}-12:00 PM`]: 7,
    [`${currentWeek[1].toDateString()}-1:00 PM`]: 4,
    [`${currentWeek[1].toDateString()}-2:00 PM`]: 6,
    [`${currentWeek[1].toDateString()}-3:00 PM`]: 3,
    [`${currentWeek[1].toDateString()}-4:00 PM`]: 2,
    [`${currentWeek[1].toDateString()}-5:00 PM`]: 0,

    // Tuesday
    [`${currentWeek[2].toDateString()}-9:00 AM`]: 0,
    [`${currentWeek[2].toDateString()}-10:00 AM`]: 4,
    [`${currentWeek[2].toDateString()}-11:00 AM`]: 2,
    [`${currentWeek[2].toDateString()}-12:00 PM`]: 6,
    [`${currentWeek[2].toDateString()}-1:00 PM`]: 3,
    [`${currentWeek[2].toDateString()}-2:00 PM`]: 1,
    [`${currentWeek[2].toDateString()}-3:00 PM`]: 5,
    [`${currentWeek[2].toDateString()}-4:00 PM`]: 4,
    [`${currentWeek[2].toDateString()}-5:00 PM`]: 2,

    // Wednesday
    [`${currentWeek[3].toDateString()}-9:00 AM`]: 7,
    [`${currentWeek[3].toDateString()}-10:00 AM`]: 3,
    [`${currentWeek[3].toDateString()}-11:00 AM`]: 4,
    [`${currentWeek[3].toDateString()}-12:00 PM`]: 1,
    [`${currentWeek[3].toDateString()}-1:00 PM`]: 0,
    [`${currentWeek[3].toDateString()}-2:00 PM`]: 6,
    [`${currentWeek[3].toDateString()}-3:00 PM`]: 3,
    [`${currentWeek[3].toDateString()}-4:00 PM`]: 2,
    [`${currentWeek[3].toDateString()}-5:00 PM`]: 1,

    // Thursday
    [`${currentWeek[4].toDateString()}-9:00 AM`]: 5,
    [`${currentWeek[4].toDateString()}-10:00 AM`]: 2,
    [`${currentWeek[4].toDateString()}-11:00 AM`]: 3,
    [`${currentWeek[4].toDateString()}-12:00 PM`]: 0,
    [`${currentWeek[4].toDateString()}-1:00 PM`]: 1,
    [`${currentWeek[4].toDateString()}-2:00 PM`]: 4,
    [`${currentWeek[4].toDateString()}-3:00 PM`]: 2,
    [`${currentWeek[4].toDateString()}-4:00 PM`]: 3,
    [`${currentWeek[4].toDateString()}-5:00 PM`]: 6,

    // Friday
    [`${currentWeek[5].toDateString()}-9:00 AM`]: 1,
    [`${currentWeek[5].toDateString()}-10:00 AM`]: 3,
    [`${currentWeek[5].toDateString()}-11:00 AM`]: 6,
    [`${currentWeek[5].toDateString()}-12:00 PM`]: 2,
    [`${currentWeek[5].toDateString()}-1:00 PM`]: 4,
    [`${currentWeek[5].toDateString()}-2:00 PM`]: 0,
    [`${currentWeek[5].toDateString()}-3:00 PM`]: 7,
    [`${currentWeek[5].toDateString()}-4:00 PM`]: 3,
    [`${currentWeek[5].toDateString()}-5:00 PM`]: 5,
  };

  const [homeworkDone, setHomeworkDone] = React.useState<{ [key: string]: boolean }>({});

  const toggleHomework = (item: string) => {
    setHomeworkDone(prev => ({ ...prev, [item]: !prev[item] }));
  };


  const renderContent = () => {
    switch (selectedTab) {
      case "Home": {
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

                {Array(monthDays[0].getDay())
                  .fill(null)
                  .map((_, idx) => (
                    <div key={`pad-${idx}`}></div>
                  ))}

                {monthDays.map((day) => {
                  const dayKey = formatDateKey(day);
                  const isToday = day.toDateString() === today.toDateString();
                  const hasBooking = bookedLessons[dayKey] !== undefined;

                  return (
                    <button
                      key={dayKey}
                      onClick={() => setSelectedDay(dayKey)}
                      className={`relative py-2 rounded cursor-pointer w-full
                        ${isToday ? "bg-yellow-400 font-bold text-blue-900" : "hover:bg-yellow-100"}
                      `}
                      aria-label={`Day ${day.getDate()}${hasBooking ? ", booked lesson" : ", no lesson"}`}
                      type="button"
                    >
                      {day.getDate()}

                      {hasBooking && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 border rounded text-center">
            {selectedDay ? (
              bookedLessons[selectedDay] ? (
                <>
                  <h4 className="font-bold text-lg mb-2">
                    Lesson on {new Date(selectedDay).toLocaleDateString()}
                  </h4>
                  <p>
                    Time: {bookedLessons[selectedDay].time} <br />
                    Students: {bookedLessons[selectedDay].students}
                  </p>
                  <a
                    href={`/reschedule?date=${selectedDay}`}
                    className="inline-block mt-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                  >
                    Reschedule?
                  </a>
                </>
              ) : (
                <>
                  <p>No lesson booked for {new Date(selectedDay).toLocaleDateString()}.</p>
                  <a
                    href={`/booking?date=${selectedDay}`}
                    className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                  >
                    Book?
                  </a>
                </>
              )
            ) : (
              <p>Click a day to see lesson info or book.</p>
            )}

              </div>
            </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Assigned Homework</h3>
            <ul className="list-disc list-inside text-gray-800">
              {["Practice C major scale 5 times", "Watch jazz phrasing video (10 min)"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={homeworkDone[item] || false}
                    onChange={() => toggleHomework(item)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    aria-label={`Mark homework "${item}" as done`}
                  />
                  <span className={homeworkDone[item] ? "line-through text-gray-500" : ""}>{item}</span>
                </li>
              ))}
            </ul>
          </div>


          </div>
        );
      }

      case "Personal":
        return (
          <div className="bg-white p-6 rounded-lg shadow space-y-2">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Information</h2>
            <img
              src="/profile-placeholder.png"
              alt="Profile"
              className="w-24 h-24 rounded-full border mb-4"
            />
            <p className="text-gray-800">
              <strong>Name:</strong> Johnny Example
            </p>

            <p className="text-gray-800">
              <strong>Progress:</strong>
            </p>
            <div className="w-full bg-gray-200 rounded h-4">
              <div className="bg-blue-500 h-4 rounded" style={{ width: "40%" }}></div>
            </div>

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

     /* case "Book":
        return (
          <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Book Lessons</h2>
            <div className="flex flex-col divide-y divide-gray-300">
              {currentWeek.map((day) => {
                const dayOfWeek = day.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  // No slots on Sunday(0) or Saturday(6)
                  return (
                    <div
                      key={day.toDateString()}
                      className="py-4 flex flex-col items-center text-gray-400"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {day.toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <p>No slots available</p>
                    </div>
                  );
                }

                return (
                  <div key={day.toDateString()} className="py-4">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">
                      {day.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => {
                        const key = `${day.toDateString()}-${time}`;
                        const booked = demoSlotCounts[key] ?? 0;
                        const isSelected = selectedDay === day.toDateString() && selectedTime === time;

                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setSelectedDay(day.toDateString());
                              setSelectedTime(time);
                            }}
                            className={`rounded px-3 py-2 border w-full text-sm flex flex-col items-center transition
                              ${
                                isSelected
                                  ? "bg-yellow-400 text-blue-900 border-yellow-400 font-bold"
                                  : "bg-gray-100 text-gray-900 hover:bg-yellow-200 border-transparent"
                              }`}
                            aria-label={`Book slot on ${day.toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })} at ${time}`}
                          >
                            <span>{time}</span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              👥 {booked}/8
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedDay && selectedTime && (
              <div className="mt-6 text-center">
                <p className="mb-2 text-blue-700 font-semibold">
                  You selected {selectedTime} on{" "}
                  {new Date(selectedDay).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <button
                  onClick={() =>
                    alert(
                      `Booked for ${selectedTime} on ${new Date(
                        selectedDay
                      ).toLocaleDateString()}`
                    )
                  }
                  className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        );


      case "Buy":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Single Lesson", price: "$30", desc: "One 30-minute session" },
              { name: "5-Pack", price: "$140", desc: "Save $10 on 5 lessons" },
              { name: "10-Pack", price: "$270", desc: "Save $30 on 10 lessons" },
            ].map((pkg) => (
              <div key={pkg.name} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-bold text-blue-700">{pkg.name}</h3>
                <p className="text-gray-800">{pkg.desc}</p>
                <p className="text-xl font-semibold text-blue-900 mt-2">{pkg.price}</p>
                <button className="mt-4 px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-300">
                  Purchase
                </button>
              </div>
            ))}
          </div>

        );

      case "Upcoming":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Reschedule Lessons
            </h2>
            <p className="text-gray-800 mb-2">
              Select an existing booking to reschedule:
            </p>
            <select className="mb-4 px-3 py-2 border rounded w-full">
              <option>June 8, 3:00 PM</option>
              <option>June 15, 3:00 PM</option>
            </select>
            <p className="text-gray-800 mb-2">Pick new time:</p>
            <button className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-300">
              Confirm Reschedule
            </button>
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
      <aside className="w-48 bg-blue-600 text-white flex flex-col p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-left px-3 py-2 rounded font-semibold ${
              selectedTab === tab ? "bg-yellow-400 text-blue-800" : "hover:bg-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      <section className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Demo Dashboard</h1>
          <button
            className="px-4 py-2 bg-yellow-400 text-blue-800 font-semibold rounded hover:bg-yellow-300 transition"
            onClick={() => {
              const isLoggedIn = document.cookie.includes("token=");

              if (isLoggedIn) {
                document.cookie = "token=; path=/; max-age=0;";
              }

              window.location.href = "/login";
            }}
          >
            {document.cookie.includes("token=") ? "Logout" : "Login"}
          </button>

        </header>

        {renderContent()}
      </section>
    </main>
  );
*/
  


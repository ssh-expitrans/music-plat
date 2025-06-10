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
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Floating particles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Sidebar Tabs */}
      <nav className="relative z-10 w-64 backdrop-blur-lg bg-white/80 border-r border-white/20 p-6 flex flex-col space-y-3 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🎵 MusicLearn
          </h1>
          <p className="text-sm text-gray-600 mt-1">Student Portal</p>
        </div>
        
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab !== "Book") {
                setSelectedSlots([]); // Clear selections when switching tabs
              }
            }}
            className={`group relative py-4 px-5 rounded-xl text-left font-semibold transition-all duration-300 transform hover:scale-105
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-gray-700 hover:bg-white/60 hover:text-purple-600 hover:shadow-lg"
              }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                {tab === "Home" && "🏠"}
                {tab === "Book" && "📅"}
                {tab === "Buy" && "💳"}
                {tab === "Upcoming" && "⏰"}
                {tab === "Account" && "👤"}
              </span>
              <span>{tab}</span>
            </div>
            {activeTab === tab && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-8 overflow-auto">
        {activeTab === "Home" && (
          <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 rounded-3xl shadow-2xl text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4 animate-slideInLeft">
                  Welcome Back, {personalInfo.name}! 🎉
                </h2>
                <p className="text-xl text-purple-100 animate-slideInLeft animation-delay-200">
                  Your next session is on{" "}
                  <span className="font-bold text-yellow-300 px-3 py-1 bg-white/20 rounded-full">
                    June 10 at 10:00 AM
                  </span>
                </p>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    👤
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Personal Info
                  </h3>
                </div>
                <div className="space-y-4">
                  {Object.entries({
                    "Name": personalInfo.name,
                    "Date of Birth": personalInfo.dob,
                    "Age Group": personalInfo.ageGroup,
                    "Skill Level": personalInfo.skillLevel,
                    "Email": personalInfo.email
                  }).map(([key, value], index) => (
                    <div 
                      key={key}
                      className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="font-semibold text-gray-700">{key}:</span>
                      <span className="text-gray-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    📈
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Progress
                  </h3>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                      style={{ width: `${personalInfo.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <p className="text-right text-lg font-bold text-gray-700 mb-4">
                    {personalInfo.progress}% Complete
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Beginner Level</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Intermediate Level</span>
                  </div>
                  <p className="text-center text-gray-600 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl">
                    🌟 Great progress! Keep practicing to reach the next level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Book" && (
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 max-w-full mx-auto animate-fadeIn">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl mr-6 shadow-lg">
                📅
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Book Lessons
                </h2>
                <p className="text-gray-600 mt-1">Select your preferred time slots</p>
              </div>
            </div>

            {/* Selection Summary */}
            {selectedSlots.length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg animate-slideInDown">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">✨</span>
                  <h3 className="font-bold text-amber-800 text-xl">
                    Selected Sessions ({selectedSlots.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
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
                        className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {dayName} at {time}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Days horizontally - wider layout */}
            <div className="grid grid-cols-7 gap-6">
              {currentWeek.map((day, dayIndex) => {
                const dayOfWeek = day.getDay();

                // Weekends (Sunday or Saturday) show disabled slots
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  return (
                    <div
                      key={day.toDateString()}
                      className="p-6 bg-gray-100/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-center text-gray-400 shadow-lg animate-fadeInUp"
                      style={{ animationDelay: `${dayIndex * 100}ms` }}
                    >
                      <h3 className="text-lg font-bold mb-4">
                        {day.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="text-4xl mb-2">😴</div>
                      <p className="font-medium">Weekend Rest</p>
                    </div>
                  );
                }

                return (
                  <div
                    key={day.toDateString()}
                    className="p-6 bg-white/70 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex flex-col items-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fadeInUp"
                    style={{ animationDelay: `${dayIndex * 100}ms` }}
                  >
                    <h3 className="text-lg font-bold mb-4 text-gray-800 text-center bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full">
                      {day.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>

                    {/* Time slots container - no scrolling */}
                    <div className="flex flex-col space-y-3 w-full">
                      {timeSlots.map((time, timeIndex) => {
                        const key = `${day.toDateString()}-${time}`;
                        const slot = demoSlotData[key];
                        const isSelected = isSlotSelected(day.toDateString(), time);

                        return (
                          <button
                            key={key}
                            onClick={() => handleSlotClick(day.toDateString(), time)}
                            className={`group relative rounded-xl px-4 py-3 border-2 text-sm flex flex-col items-center transition-all duration-300 transform hover:scale-105 min-h-[70px] justify-center overflow-hidden
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-300 shadow-2xl shadow-amber-500/25 scale-105"
                                  : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl"
                              }`}
                            style={{ animationDelay: `${(dayIndex * timeSlots.length + timeIndex) * 50}ms` }}
                            aria-label={`${isSelected ? 'Unselect' : 'Select'} slot on ${day.toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })} at ${time}`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 animate-pulse"></div>
                            )}
                            
                            <span className="relative z-10 font-bold text-base mb-2">
                              {time}
                            </span>
                            
                            {slot ? (
                              <div className="relative z-10 text-xs flex flex-col items-center space-y-1">
                                <span className="font-semibold">
                                  {slot.booked}/8 students
                                </span>
                                <div className="flex flex-col items-center space-y-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    slot.skill === 'Beginner' ? 'bg-green-100 text-green-800' :
                                    slot.skill === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {slot.skill}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    slot.ageGroup === 'Kids' ? 'bg-pink-100 text-pink-800' :
                                    'bg-indigo-100 text-indigo-800'
                                  }`}>
                                    {slot.ageGroup}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="relative z-10 text-xs flex flex-col items-center space-y-1">
                                <span className="font-medium text-green-600">0/8 students</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  ✨ Available
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
              <div className="mt-10 text-center animate-slideInUp">
                <p className="mb-6 text-gray-700 font-semibold text-xl">
                  {selectedSlots.length === 1 
                    ? `🎯 You have selected 1 session`
                    : `🎯 You have selected ${selectedSlots.length} sessions`
                  }
                </p>
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => setSelectedSlots([])}
                    className="group px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="group-hover:animate-bounce inline-block mr-2">🗑️</span>
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
                      alert(`🎉 Booking confirmed for: ${sessions}`);
                      setSelectedSlots([]);
                    }}
                    className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
                  >
                    <span className="group-hover:animate-bounce inline-block mr-2">🚀</span>
                    Book {selectedSlots.length} Session{selectedSlots.length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Buy" && (
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <h2 className="flex items-center mb-6">Piano Lesson Packages</h2>
            
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

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInDown { animation: slideInDown 0.4s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.5s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
  /*
        {activeTab === "Buy" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-800 text-center">Piano Lesson Packages</h2>
            
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

"use client";

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
  


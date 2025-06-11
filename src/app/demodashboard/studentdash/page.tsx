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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Handle tab change and close mobile menu
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab !== "Book") {
      setSelectedSlots([]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Floating particles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-20 bg-white/90 backdrop-blur-lg border-b border-white/20 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              🎵 MusicLearn
            </h1>
            <p className="text-xs text-gray-600">Student Portal</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-xl">
            <div className="px-4 py-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`w-full group relative py-3 px-4 rounded-xl text-left font-semibold transition-all duration-300 mb-2
                    ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-white/60 hover:text-purple-600 hover:shadow-md"
                    }`}
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
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex relative z-10 w-64 backdrop-blur-lg bg-white/80 border-r border-white/20 p-6 flex-col space-y-3 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🎵 MusicLearn
          </h1>
          <p className="text-sm text-gray-600 mt-1">Student Portal</p>
        </div>
        
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
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
      <main className="relative z-10 flex-1 p-4 lg:p-8 overflow-auto">
        {activeTab === "Home" && (
          <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto animate-fadeIn">
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 lg:p-8 rounded-3xl shadow-2xl text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
              <div className="absolute top-0 right-0 w-32 h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-16 lg:-translate-y-32 translate-x-16 lg:translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-48 lg:h-48 bg-white/5 rounded-full translate-y-12 lg:translate-y-24 -translate-x-12 lg:-translate-x-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-4xl font-bold mb-4 animate-slideInLeft">
                  Welcome Back, {personalInfo.name}! 🎉
                </h2>
                <p className="text-lg lg:text-xl text-purple-100 animate-slideInLeft animation-delay-200">
                  Your next session is on{" "}
                  <span className="font-bold text-yellow-300 px-2 lg:px-3 py-1 bg-white/20 rounded-full text-sm lg:text-base">
                    June 10 at 10:00 AM
                  </span>
                </p>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="group bg-white/70 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg lg:text-xl mr-4">
                    👤
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Personal Info
                  </h3>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  {Object.entries({
                    "Name": personalInfo.name,
                    "Date of Birth": personalInfo.dob,
                    "Age Group": personalInfo.ageGroup,
                    "Skill Level": personalInfo.skillLevel,
                    "Email": personalInfo.email
                  }).map(([key, value], index) => (
                    <div 
                      key={key}
                      className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 gap-1 sm:gap-0"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="font-semibold text-gray-700 text-sm lg:text-base">{key}:</span>
                      <span className="text-gray-800 font-medium text-sm lg:text-base break-all sm:break-normal">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg lg:text-xl mr-4">
                    📈
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Progress
                  </h3>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 lg:h-6 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-4 lg:h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                      style={{ width: `${personalInfo.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <p className="text-right text-base lg:text-lg font-bold text-gray-700 mb-4">
                    {personalInfo.progress}% Complete
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm font-medium text-gray-600">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-center">Beginner Level</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-center">Intermediate Level</span>
                  </div>
                  <p className="text-center text-gray-600 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl text-sm lg:text-base">
                    🌟 Great progress! Keep practicing to reach the next level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

{activeTab === "Buy" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <h2 className="flex items-center mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-3xl font-bold">Piano Lesson Packages</h2>
            
            <div className="mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Individual Lessons</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div key={pkg.name} className={`border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-white shadow-sm relative transition-all hover:shadow-md active:scale-95 ${pkg.popular ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">Most Popular</span>
                      </div>
                    )}
                    <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{pkg.name}</h4>
                    <p className="text-slate-600 mb-3 text-sm sm:text-base">{pkg.desc}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-4">{pkg.price}</p>
                    <ul className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-2.5 sm:py-3 rounded-lg font-medium transition-all active:scale-95 touch-manipulation ${pkg.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300'}`}>
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Extended Lessons</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "45-Minute Single", price: "$40", desc: "Extended individual session", duration: "45 minutes" },
                  { name: "45-Minute 6-Pack", price: "$225", desc: "Save $15 on extended lessons", duration: "6 x 45-minute sessions" },
                  { name: "60-Minute Single", price: "$50", desc: "Full hour private lesson", duration: "60 minutes" },
                ].map((item) => (
                  <div key={item.name} className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all active:scale-95">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">{item.name}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mb-2">{item.desc}</p>
                    <p className="text-xs text-slate-500 mb-3">{item.duration}</p>
                    <p className="text-lg sm:text-xl font-bold text-indigo-600 mb-4">{item.price}</p>
                    <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 active:bg-slate-300 active:scale-95 transition-all font-medium touch-manipulation">
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Monthly Unlimited</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
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
                  <div key={membership.name} className="border border-slate-200 rounded-lg sm:rounded-xl p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-all active:scale-95">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{membership.name}</h4>
                    <p className="text-slate-600 mb-3 text-sm sm:text-base">{membership.desc}</p>
                    <p className="text-xl sm:text-2xl font-bold text-indigo-600 mb-4">{membership.price}</p>
                    <ul className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                      {membership.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-2"></span>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all font-medium touch-manipulation">
                      Start Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Special Programs</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div key={program.name} className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all active:scale-95">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">{program.name}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mb-2">{program.desc}</p>
                    <p className="text-xs text-slate-500 mb-3">{program.duration}</p>
                    <p className="text-lg sm:text-xl font-bold text-indigo-600 mb-4">{program.price}</p>
                    <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 active:bg-slate-300 active:scale-95 transition-all font-medium touch-manipulation">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

       {activeTab === "Upcoming" && (
  <div className="max-w-6xl mx-auto animate-fadeIn px-4 sm:px-0">
    {/* Header Section */}
    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-white overflow-hidden mb-6 sm:mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90"></div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 sm:-translate-y-32 sm:translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full translate-y-12 -translate-x-12 sm:translate-y-24 sm:-translate-x-24"></div>
      
      <div className="relative z-10 flex items-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mr-4 sm:mr-6 shadow-lg">
          📅
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 animate-slideInLeft">
            Upcoming Lessons
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 animate-slideInLeft animation-delay-200">
            Your scheduled piano sessions
          </p>
        </div>
      </div>
    </div>

    {/* Lessons Grid */}
    <div className="space-y-4 sm:space-y-6">
      {[
        {
          date: "June 10, 2024",
          time: "10:00 AM",
          student: "Timmy Turner",
          level: "Beginner",
          ageGroup: "Kids",
          status: "confirmed",
          daysTill: 0
        },
        {
          date: "June 12, 2024", 
          time: "1:00 PM",
          student: "Timmy Turner",
          level: "Beginner", 
          ageGroup: "Kids",
          status: "confirmed",
          daysTill: 2
        }
      ].map((lesson, index) => (
        <div 
          key={index}
          className="group bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 animate-slideInUp active:scale-98"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* Lesson Info */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Date Circle */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-medium">
                    {new Date(lesson.date).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
                  </span>
                  <span className="text-lg sm:text-xl font-bold">
                    {new Date(lesson.date).getDate()}
                  </span>
                </div>
                {lesson.daysTill === 0 && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">!</span>
                  </div>
                )}
              </div>

              {/* Lesson Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {lesson.time}
                  </h3>
                  {lesson.daysTill === 0 && (
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full animate-pulse w-fit">
                      TODAY
                    </span>
                  )}
                  {lesson.daysTill > 0 && (
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full w-fit">
                      IN {lesson.daysTill} DAY{lesson.daysTill > 1 ? 'S' : ''}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
                  <span className="flex items-center text-gray-700 font-semibold text-sm sm:text-base">
                    <span className="mr-2 text-lg sm:text-xl">🎹</span>
                    <span className="truncate">Piano - {lesson.student}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      lesson.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      lesson.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {lesson.level}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      lesson.ageGroup === 'Kids' ? 'bg-pink-100 text-pink-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {lesson.ageGroup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="group/btn flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl sm:rounded-2xl hover:from-amber-500 hover:to-orange-500 active:from-amber-600 active:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base">
                <span className="group-hover/btn:animate-bounce inline-block mr-1 sm:mr-2">🔄</span>
                Reschedule
              </button>
              <button className="group/btn flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base">
                <span className="group-hover/btn:animate-bounce inline-block mr-1 sm:mr-2">❌</span>
                Cancel
              </button>
            </div>
          </div>

          {/* Progress Bar for today's lesson */}
          {lesson.daysTill === 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Session starts in:</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">2 hours 30 minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden animate-pulse" style={{ width: '75%' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* No More Lessons Message */}
    <div className="mt-6 sm:mt-8 text-center p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 shadow-lg">
      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎵</div>
      <p className="text-gray-600 font-medium text-base sm:text-lg mb-4">
        That&apos;s all your upcoming lessons! Ready to book more?
      </p>
      <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl sm:rounded-2xl hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation">
        <span className="mr-2">📅</span>
        Book New Lessons
      </button>
    </div>
  </div>
)}

{activeTab === "Account" && (
  <div className="max-w-4xl mx-auto animate-fadeIn px-4 sm:px-0">
    {/* Header Section */}
    <div className="relative bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-white overflow-hidden mb-6 sm:mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-700/90 to-gray-700/90"></div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 sm:-translate-y-32 sm:translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full translate-y-12 -translate-x-12 sm:translate-y-24 sm:-translate-x-24"></div>
      
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 shadow-lg">
          👤
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 animate-slideInUp">
          Account Management
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-slate-200 animate-slideInUp animation-delay-200">
          Access your personalized dashboard
        </p>
      </div>
    </div>

    {/* Demo Notice */}
    <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 text-center mb-6 sm:mb-8">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 sm:mb-6 shadow-lg animate-bounce">
        🎭
      </div>
      <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
        Demo Dashboard
      </h3>
      <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
        You&apos;re currently viewing a demonstration of our piano lesson booking system. 
        Sign in to access your personalized dashboard with real lesson data and account settings.
      </p>
      
      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          { icon: "📊", title: "Progress Tracking", desc: "Monitor your musical journey" },
          { icon: "🎯", title: "Goal Setting", desc: "Set and achieve milestones" },
          { icon: "💳", title: "Payment History", desc: "Manage billing and payments" }
        ].map((feature, index) => (
          <div 
            key={index}
            className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp active:scale-95"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
            <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h4>
            <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <button className="group w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-slate-700 to-gray-700 text-white rounded-xl sm:rounded-2xl hover:from-slate-800 hover:to-gray-800 active:from-slate-900 active:to-gray-900 transition-all duration-300 font-bold shadow-2xl hover:shadow-slate-500/25 transform hover:scale-105 active:scale-95 touch-manipulation">
          <span className="group-hover:animate-bounce inline-block mr-2 sm:mr-3">🚀</span>
          Log In to Your Account
        </button>
        <button className="group w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl sm:rounded-2xl hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation">
          <span className="group-hover:animate-bounce inline-block mr-2 sm:mr-3">✨</span>
          Create New Account
        </button>
      </div>
    </div>

    {/* Additional Info */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 text-center">
      <div className="flex items-center justify-center gap-2 text-blue-700 font-medium text-sm sm:text-base">
        <span className="text-lg sm:text-xl">🔒</span>
        <span>Your data is secure and private</span>
      </div>
    </div>
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

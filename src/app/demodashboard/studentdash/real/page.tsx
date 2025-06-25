"use client";

import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";

const tabs = ["Home", "Book", "Buy", "Upcoming", "Account"];

const getTabIcon = (tab: string) => {
  switch (tab) {
    case "Home": return "🏠";
    case "Book": return "📅";
    case "Buy": return "💳";
    case "Upcoming": return "⏰";
    case "Account": return "👤";
    default: return "";
  }
};

export default function StudentDashReal() {
  const [activeTab, setActiveTab] = useState("Home");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [homework, setHomework] = useState<DocumentData[]>([]);
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentWeekSunday());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const currentWeek = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setUser(firebaseUser);
      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        // Defensive: If firstName/lastName are missing but displayName exists, use it
        if (userData && (!userData.firstName || !userData.lastName) && firebaseUser.displayName) {
          const [first, ...rest] = firebaseUser.displayName.split(" ");
          userData.firstName = userData.firstName || first;
          userData.lastName = userData.lastName || rest.join(" ");
        }
        setProfile(userData);
        // Fetch homework assignments
        const hwSnap = await getDocs(query(collection(db, "homework"), where("studentId", "==", firebaseUser.uid)));
        console.log("Homework docs count:", hwSnap.size);
        setHomework(hwSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        // Fetch bookings
        const bookingSnap = await getDocs(query(collection(db, "bookings"), where("studentId", "==", firebaseUser.uid)));
        console.log("Bookings docs count:", bookingSnap.size);
        setBookings(bookingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Dashboard Firestore error:", e);
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin-slow text-6xl mb-4">🎵</div>
        <p className="text-lg text-purple-700 font-semibold">Loading your dashboard...</p>
      </div>
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  // Helper: get next lesson
  const nextLesson = bookings
    .filter(b => new Date(b.date + ' ' + b.time) > new Date())
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())[0];

  // --- Book Tab Helper Functions ---
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];
  function getCurrentWeekSunday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0,0,0,0);
    return sunday;
  }
  function getWeekDates(sundayDate: Date) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sundayDate);
      d.setDate(sundayDate.getDate() + i);
      week.push(d);
    }
    return week;
  }
  function formatWeekRange(weekStart: Date) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.toLocaleDateString(undefined, { month: 'long' })} ${weekStart.getDate()}-${weekEnd.getDate()}`;
    } else {
      return `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
  }
  function isCurrentWeek(currentWeekStart: Date) {
    const today = getCurrentWeekSunday();
    return currentWeekStart.getTime() === today.getTime();
  }

  // --- Book Tab UI Components (scoped inside main component) ---
  function BookWeekNav() {
    return (
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200 shadow-lg space-y-4 sm:space-y-0 md:gap-8">
        <div className="flex space-x-2 sm:space-x-0 sm:block order-2 sm:order-1 md:space-x-4">
          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg"
          >
            <span className="group-hover:animate-bounce inline-block mr-1 sm:mr-2 text-lg sm:text-xl md:text-2xl">⬅️</span>
          </button>
          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg sm:hidden"
          >
            <span className="group-hover:animate-bounce inline-block ml-1 text-lg md:text-2xl">➡️</span>
          </button>
        </div>
        <div className="text-center order-1 sm:order-2 min-w-[160px] md:min-w-[220px]">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-800 mb-1">
            {formatWeekRange(currentWeekStart)}
          </h3>
          {!isCurrentWeek && (
            <button
              onClick={() => setCurrentWeekStart(getCurrentWeekSunday())}
              className="text-xs sm:text-sm md:text-base text-purple-600 hover:text-purple-800 font-medium"
            >
              Go to Current Week
            </button>
          )}
          {isCurrentWeek(currentWeekStart) && (
            <span className="text-xs sm:text-sm md:text-base text-purple-600 font-medium bg-purple-100 px-2 sm:px-3 md:px-4 py-1 rounded-full">
              📍 Current Week
            </span>
          )}
        </div>
        <button
          onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
          className="group flex items-center px-6 py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 hidden sm:flex order-3 text-base md:text-lg"
        >
          <span className="group-hover:animate-bounce inline-block ml-2 text-xl md:text-2xl">➡️</span>
        </button>
      </div>
    );
  }

  function BookSelectionSummary() {
    if (selectedSlots.length === 0) return null;
    return (
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg animate-slideInDown">
        <div className="flex items-center mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl mr-2 sm:mr-3">✨</span>
          <h3 className="font-bold text-amber-800 text-lg sm:text-xl">
            Selected Sessions ({selectedSlots.length})
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {selectedSlots.map((slotKey) => {
            const [dayStr, time] = slotKey.split("-");
            return (
              <span key={slotKey} className="px-3 py-1 bg-white rounded-full border border-amber-300 text-amber-800 text-xs font-semibold">
                {dayStr} @ {time}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  function BookSlotGrid() {
    function handleSlotClick(day: Date, time: string) {
      const slotKey = `${day.toDateString()}-${time}`;
      setSelectedSlots(prev => prev.includes(slotKey) ? prev.filter(s => s !== slotKey) : [...prev, slotKey]);
    }
    function isSlotSelected(day: Date, time: string) {
      return selectedSlots.includes(`${day.toDateString()}-${time}`);
    }
    return (
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
        {currentWeek.map((day, dayIndex) => {
          const dayOfWeek = day.getDay();
          const isToday = day.toDateString() === new Date().toDateString();
          // Weekends (Sunday or Saturday) show disabled slots
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            return (
              <div key={dayIndex} className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl border border-gray-200 opacity-60">
                <span className="font-bold text-gray-400 mb-2">{day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="text-xs text-gray-400">No lessons</span>
              </div>
            );
          }
          return (
            <div key={dayIndex} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-purple-100 shadow">
              <span className={`font-bold mb-2 ${isToday ? 'text-purple-700' : 'text-gray-700'}`}>{day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{isToday && ' (Today)'}</span>
              <div className="flex flex-col gap-2 w-full">
                {timeSlots.map((time: string) => (
                  <button
                    key={time}
                    onClick={() => handleSlotClick(day, time)}
                    className={`w-full px-2 py-1 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${isSlotSelected(day, time) ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-lg' : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-400'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function BookNowSection() {
    if (selectedSlots.length === 0) return null;
    return (
      <div className="mt-8 sm:mt-10 text-center animate-slideInUp">
        <p className="mb-4 sm:mb-6 text-gray-700 font-semibold text-lg sm:text-xl">
          {selectedSlots.length === 1 
            ? `🎯 You have selected 1 session`
            : `🎯 You have selected ${selectedSlots.length} sessions`
          }
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6">
          <button
            onClick={() => setSelectedSlots([])}
            className="group px-6 py-3 sm:px-8 sm:py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Clear All
          </button>
          <button
            onClick={() => alert('Booking not implemented yet!')}
            className="group px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Book {selectedSlots.length === 1 ? 'Session' : 'Sessions'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Sidebar Navigation */}
      <nav className="hidden md:flex relative z-10 w-44 lg:w-64 backdrop-blur-lg bg-white/80 border-r border-white/20 p-4 lg:p-6 flex-col space-y-3 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-2xl text-white shadow-lg">
            🎵
          </div>
          <p className="text-sm text-gray-700 font-semibold">Student Portal</p>
        </div>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`group relative py-4 px-5 rounded-xl text-left font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === tab ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25" : "text-gray-700 hover:bg-white/60 hover:text-purple-600 hover:shadow-lg"}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getTabIcon(tab)}</span>
              <span className="hidden sm:inline">{tab}</span>
            </div>
            {activeTab === tab && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </nav>
      {/* Bottom Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex md:hidden bg-white/90 border-t border-gray-200 shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 ${activeTab === tab ? "text-indigo-600 font-bold bg-gradient-to-t from-indigo-50 to-white" : "text-gray-500 hover:text-indigo-500"}`}
            aria-label={tab}
          >
            <span className="text-xl mb-0.5">{getTabIcon(tab)}</span>
            <span className="text-xs leading-tight">{tab}</span>
          </button>
        ))}
      </nav>
      {/* Main Content */}
      <main className="relative z-10 flex-1 p-8 overflow-auto pb-20 md:pb-0">
        {activeTab === "Home" && (
          <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-fadeIn px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-white overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 animate-slideInLeft leading-tight">
                  Welcome Back, {profile && (profile.firstName || profile.lastName) ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() : user.email}! 🎉
                </h2>
                {nextLesson && (
                  <div className="animate-slideInLeft animation-delay-200">
                    <p className="text-base sm:text-lg lg:text-xl text-purple-100 mb-2">
                      Your next session is on
                    </p>
                    <span className="inline-block font-bold text-yellow-300 px-3 py-2 bg-white/20 rounded-full text-sm sm:text-base">
                      {new Date(nextLesson.date + ' ' + nextLesson.time).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Personal Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="group bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 flex-shrink-0">
                    👤
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Personal Info
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {profile && (() => {
                    // Calculate age from DOB
                    let age = '';
                    if (profile.dob) {
                      const dobDate = new Date(profile.dob);
                      const today = new Date();
                      let years = today.getFullYear() - dobDate.getFullYear();
                      const m = today.getMonth() - dobDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                        years--;
                      }
                      age = years > 0 ? `${years}` : '';
                    }
                    const info = {
                      "Name": (profile.firstName + ' ' + profile.lastName).trim(),
                      "Email": profile.email,
                      "Date of Birth": profile.dob ? `${profile.dob}${age ? ` (Age: ${age})` : ''}` : '',
                      "Skill Level": profile.skillLevel || '',
                    };
                    return Object.entries(info).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 space-y-1 sm:space-y-0">
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">{key}:</span>
                        <span className="text-gray-800 font-medium text-sm sm:text-base break-words">{value}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              {/* Progress (if available) */}
              <div className="group bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 flex-shrink-0">
                    📈
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Progress
                  </h3>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 sm:h-6 mb-3 sm:mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-4 sm:h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden" style={{ width: `${profile?.progress || 0}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <p className="text-right text-base sm:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                    {profile?.progress || 0}% Complete
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-center text-sm sm:text-base text-gray-600 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl">
                    🌟 Great progress! Keep practicing to reach the next level.
                  </p>
                </div>
              </div>
            </div>
            {/* Homework Section */}
            <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 flex-shrink-0">
                  📚
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Homework Assignments
                </h3>
              </div>
              <div className="space-y-4">
                {homework.length === 0 ? (
                  <p className="text-gray-500">No homework assignments yet.</p>
                ) : (
                  homework.map((assignment) => (
                    <div key={assignment.id} className="p-4 sm:p-5 rounded-xl border-l-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-500">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-800">{assignment.title}</h4>
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">{assignment.description}</p>
                          <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600">
                            <span><strong>Assigned:</strong> {assignment.assignedDate}</span>
                            <span><strong>Due:</strong> {assignment.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "Book" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-8 rounded-3xl shadow-2xl border border-white/30 max-w-full mx-auto animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mb-4 sm:mb-0 sm:mr-6 shadow-lg">
                📅
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Book Lessons
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Select your preferred time slots</p>
              </div>
            </div>

            {/* Week Navigation */}
            {BookWeekNav()}

            {/* Selection Summary */}
            {BookSelectionSummary()}

            {/* Desktop View - Grid Layout */}
            {BookSlotGrid()}

            {/* Book Now Section */}
            {BookNowSection()}
          </div>
        )}
        {activeTab === "Buy" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl">Piano Lesson Packages</h2>
              {/* Cart summary placeholder (UI only) */}
              <div className="hidden sm:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">
                <span>🛒</span>
                <span>Cart: 0 items</span>
                <span className="ml-2 font-bold">$0.00</span>
              </div>
            </div>

            {/* Cart UI (not functional yet) */}
            <div className="mb-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span>🛒</span>
                  <span>Your Cart</span>
                </div>
                <button className="text-xs text-indigo-600 font-bold hover:underline" disabled>Clear All</button>
              </div>
              <p className="text-slate-500">Your cart is empty</p>
            </div>

            {/* Individual Lessons */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Individual Lessons</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow border border-slate-200 p-5 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎹</span>
                      <span className="font-bold text-lg">30-min Lesson</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-2">One-on-one piano lesson with a certified teacher.</div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-indigo-700 font-bold text-xl">$30</span>
                      <span className="text-xs text-slate-400">per lesson</span>
                    </div>
                    <button className="mt-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200" disabled>Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Lessons */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Extended Lessons</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow border border-slate-200 p-5 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎶</span>
                      <span className="font-bold text-lg">1-hour Lesson</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-2">In-depth piano lesson covering advanced topics.</div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-indigo-700 font-bold text-xl">$50</span>
                      <span className="text-xs text-slate-400">per lesson</span>
                    </div>
                    <button className="mt-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200" disabled>Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages Section (if applicable) */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-700">Lesson Packages</h3>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow border border-slate-200 p-5 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📦</span>
                        <span className="font-bold text-lg">Starter Package</span>
                      </div>
                      <div className="text-slate-600 text-sm mb-4">
                        5 individual lessons + 2 free trial group classes.
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-indigo-700 font-bold text-xl">$120</span>
                        <span className="text-xs text-slate-400">one-time</span>
                      </div>
                    </div>
                    <button className="mt-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200" disabled>Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "Upcoming" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mr-4 shadow-lg">
                ⏰
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Upcoming Events
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Your scheduled lessons and events</p>
              </div>
            </div>

            {/* Events List (mockup data) */}
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="p-4 sm:p-5 rounded-xl border-l-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-800">Piano Recital</h4>
                        <span className="text-xs sm:text-sm text-purple-600 font-semibold bg-purple-100 rounded-full px-3 py-1">
                          Group Class
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">
                        Join us for a group piano recital to showcase your skills!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600">
                        <span><strong>Date:</strong> March 15, 2023</span>
                        <span><strong>Time:</strong> 5:00 PM - 7:00 PM</span>
                        <span><strong>Location:</strong> Music Hall A</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "Account" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mr-4 shadow-lg">
                👤
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  My Account
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your profile and settings</p>
              </div>
            </div>

            {/* Account Settings Form (simplified) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                  <input className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none" type="text" id="firstName" defaultValue={profile?.firstName || ''} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                  <input className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none" type="text" id="lastName" defaultValue={profile?.lastName || ''} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor="email">Email</label>
                <input className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none" type="email" id="email" defaultValue={profile?.email || ''} disabled />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor="dob">Date of Birth</label>
                <input className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none" type="date" id="dob" defaultValue={profile?.dob || ''} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor="skillLevel">Skill Level</label>
                <select className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none" id="skillLevel" defaultValue={profile?.skillLevel || ''}>
                  <option value="">Select your skill level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Book Tab Helper Components ---
// import { formatWeekRange } from "./page"; // Remove this import; not needed

function BookWeekNav({ currentWeekStart, setCurrentWeekStart, isCurrentWeek }: { currentWeekStart: Date, setCurrentWeekStart: (d: Date) => void, isCurrentWeek: boolean }) {
  // Add formatWeekRange here for use in this component
  function formatWeekRange(weekStart: Date) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.toLocaleDateString(undefined, { month: 'long' })} ${weekStart.getDate()}-${weekEnd.getDate()}`;
    } else {
      return `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
  }
  // Define getCurrentWeekSunday locally
  function getCurrentWeekSunday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0,0,0,0);
    return sunday;
  }
  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200 shadow-lg space-y-4 sm:space-y-0 md:gap-8">
      <div className="flex space-x-2 sm:space-x-0 sm:block order-2 sm:order-1 md:space-x-4">
        <button
          onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
          className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg"
        >
          <span className="group-hover:animate-bounce inline-block mr-1 sm:mr-2 text-lg sm:text-xl md:text-2xl">⬅️</span>
        </button>
        <button
          onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
          className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg sm:hidden"
        >
          <span className="group-hover:animate-bounce inline-block ml-1 text-lg md:text-2xl">➡️</span>
        </button>
      </div>
      <div className="text-center order-1 sm:order-2 min-w-[160px] md:min-w-[220px]">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-800 mb-1">
          {formatWeekRange(currentWeekStart)}
        </h3>
        {!isCurrentWeek && (
          <button
            onClick={() => setCurrentWeekStart(getCurrentWeekSunday())}
            className="text-xs sm:text-sm md:text-base text-purple-600 hover:text-purple-800 font-medium"
          >
            Go to Current Week
          </button>
        )}
        {isCurrentWeek && (
          <span className="text-xs sm:text-sm md:text-base text-purple-600 font-medium bg-purple-100 px-2 sm:px-3 md:px-4 py-1 rounded-full">
            📍 Current Week
          </span>
        )}
      </div>
      <button
        onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
        className="group flex items-center px-6 py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 hidden sm:flex order-3 text-base md:text-lg"
      >
        <span className="group-hover:animate-bounce inline-block ml-2 text-xl md:text-2xl">➡️</span>
      </button>
    </div>
  );
}

function BookSelectionSummary({ selectedSlots }: { selectedSlots: string[] }) {
  if (selectedSlots.length === 0) return null;
  return (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg animate-slideInDown">
      <div className="flex items-center mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">✨</span>
        <h3 className="font-bold text-amber-800 text-lg sm:text-xl">
          Selected Sessions ({selectedSlots.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {selectedSlots.map((slotKey) => {
          const [dayStr, time] = slotKey.split("-");
          return (
            <span key={slotKey} className="px-3 py-1 bg-white rounded-full border border-amber-300 text-amber-800 text-xs font-semibold">
              {dayStr} @ {time}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function BookSlotGrid({ currentWeek, selectedSlots, setSelectedSlots }: { currentWeek: Date[], selectedSlots: string[], setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>> }) {
  // Define timeSlots inside the component
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];
  function handleSlotClick(day: Date, time: string) {
    const slotKey = `${day.toDateString()}-${time}`;
    setSelectedSlots(prev => prev.includes(slotKey) ? prev.filter(s => s !== slotKey) : [...prev, slotKey]);
  }
  function isSlotSelected(day: Date, time: string) {
    return selectedSlots.includes(`${day.toDateString()}-${time}`);
  }
  return (
    <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
      {currentWeek.map((day, dayIndex) => {
        const dayOfWeek = day.getDay();
        const isToday = day.toDateString() === new Date().toDateString();
        // Weekends (Sunday or Saturday) show disabled slots
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return (
            <div key={dayIndex} className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl border border-gray-200 opacity-60">
              <span className="font-bold text-gray-400 mb-2">{day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="text-xs text-gray-400">No lessons</span>
            </div>
          );
        }
        return (
          <div key={dayIndex} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-purple-100 shadow">
            <span className={`font-bold mb-2 ${isToday ? 'text-purple-700' : 'text-gray-700'}`}>{day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{isToday && ' (Today)'}</span>
            <div className="flex flex-col gap-2 w-full">
              {timeSlots.map((time: string) => (
                <button
                  key={time}
                  onClick={() => handleSlotClick(day, time)}
                  className={`w-full px-2 py-1 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${isSlotSelected(day, time) ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-lg' : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-400'}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookNowSection({ selectedSlots, setSelectedSlots }: { selectedSlots: string[], setSelectedSlots: (s: string[]) => void }) {
  if (selectedSlots.length === 0) return null;
  return (
    <div className="mt-8 sm:mt-10 text-center animate-slideInUp">
      <p className="mb-4 sm:mb-6 text-gray-700 font-semibold text-lg sm:text-xl">
        {selectedSlots.length === 1 
          ? `🎯 You have selected 1 session`
          : `🎯 You have selected ${selectedSlots.length} sessions`
        }
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6">
        <button
          onClick={() => setSelectedSlots([])}
          className="group px-6 py-3 sm:px-8 sm:py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Clear All
        </button>
        <button
          onClick={() => alert('Booking not implemented yet!')}
          className="group px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Book {selectedSlots.length === 1 ? 'Session' : 'Sessions'}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";

const tabs = ["Home", "Book", "Buy", "Upcoming", "Account"] as const;

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

// --- Book Tab Helper Functions (move these above the first hook call!) ---
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

// --- Types ---
interface LessonSlot {
  id: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm or HH:mm:ss
  bookedStudentIds?: string[];
  [key: string]: unknown;
}
interface CartItem {
  length: number;
  price: number;
  qty: number;
}
interface UserProfile extends DocumentData {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  skillLevel?: string;
  progress?: number;
}

export default function StudentDashReal() {
  // --- All hooks at the top, in a fixed order ---
  const [activeTab, setActiveTab] = useState<"Home" | "Book" | "Buy" | "Upcoming" | "Account">("Home");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [homework, setHomework] = useState<DocumentData[]>([]);
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentWeekSunday());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  // --- Buy tab state ---
  const [selectedOption, setSelectedOption] = useState<number | null>(30);
  const [quantities, setQuantities] = useState<{ [length: number]: number }>({ 30: 1, 60: 1, 90: 1 });
  // --- Book Tab State ---
  const [availableSlots, setAvailableSlots] = useState<LessonSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  // --- Booking Modal State (restored) ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  // --- Cancel Booking Modal State ---
  const [cancelModal, setCancelModal] = useState<{ open: boolean; booking: LessonSlot | null }>({ open: false, booking: null });
  // --- Memo and router ---
  const router = useRouter();
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);

  // --- Helper: group slots by day for BookAvailableTimes ---
  const slotsByDay = useMemo(() => {
    const map: { [date: string]: LessonSlot[] } = {};
    for (const slot of availableSlots) {
      if (!map[slot.date]) map[slot.date] = [];
      map[slot.date].push(slot);
    }
    // Sort slots for each day by time
    Object.values(map).forEach(arr => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [availableSlots]);

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
        setHomework(hwSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        // Fetch bookings
        const bookingSnap = await getDocs(query(collection(db, "bookings"), where("studentId", "==", firebaseUser.uid)));
        setBookings(bookingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    setSlotsLoading(true);
    const fetchSlots = async () => {
      try {
        const slotsSnap = await getDocs(query(collection(db, "lessonSlots")));
        setAvailableSlots(
          slotsSnap.docs
            .map(doc => {
              const data = doc.data() as LessonSlot;
              return { ...data, id: doc.id };
            })
            .filter(slot => Array.isArray(slot.bookedStudentIds) && slot.bookedStudentIds.length === 0)
        );
      } catch {
        setAvailableSlots([]);
      }
      setSlotsLoading(false);
    };
    fetchSlots();
  }, []);

  // --- Lesson Options (typed) ---
  const lessonOptions: Array<{ length: number; price: number; icon: string; desc: string }> = [
    { length: 30, price: 30, icon: '🎹', desc: 'Standard 30-minute private lesson.' },
    { length: 60, price: 60, icon: '🎶', desc: 'Full 1-hour private lesson.' },
    { length: 90, price: 90, icon: '🎼', desc: 'Extended 90-minute private lesson.' },
  ];

  // Only after all hooks, do early returns:
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

  // Helper: format slot time only (no day)
  function formatSlotTime(slot: LessonSlot | undefined) {
    if (!slot?.time) return slot?.id || '';
    const dateObj = new Date(slot.date + 'T' + slot.time);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- Book Tab UI Components (scoped inside main component) ---
  function BookWeekNav() {
    return (
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200 shadow-lg space-y-4 sm:space-y-0 md:gap-8">
        <div className="flex space-x-2 sm:space-x-0 sm:block order-2 sm:order-1 md:space-x-4">
          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg"
            type="button"
          >
            <span className="group-hover:animate-bounce inline-block mr-1 sm:mr-2 text-lg sm:text-xl md:text-2xl">⬅️</span>
          </button>
          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="group flex items-center px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-purple-200 text-sm sm:text-base md:text-lg sm:hidden"
            type="button"
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
          type="button"
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
          {selectedSlots.map((slotId) => {
            const slot = availableSlots.find(s => s.id === slotId);
            return (
              <span key={slotId} className="px-3 py-1 bg-white rounded-full border border-amber-300 text-amber-800 text-xs font-semibold">
                {/* Only show time, not day */}
                {formatSlotTime(slot)}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  function BookAvailableTimes() {
    if (slotsLoading) return <div className="text-purple-600 font-semibold">Loading available times...</div>;
    if (availableSlots.length === 0) return <div className="text-gray-500">No available times at the moment.</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((dateObj, idx) => {
          const dateStr = dateObj.toISOString().slice(0, 10);
          const slots = slotsByDay[dateStr] || [];
          return (
            <div key={dateStr} className="flex flex-col">
              <div className={`font-bold text-center mb-2 rounded-lg px-2 py-1 ${idx === 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              {slots.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-2">No slots</div>
              ) : (
                slots.map(slot => {
                  const isSelected = selectedSlots.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setBookingSuccess(false);
                        setSelectedSlots(prev => isSelected ? prev.filter(s => s !== slot.id) : [...prev, slot.id]);
                      }}
                      className={`w-full px-2 py-2 mb-2 rounded-xl font-semibold border-2 transition-all duration-200 shadow text-xs ${isSelected ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500' : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-400'}`}
                    >
                      {/* Only show time, not day */}
                      {formatSlotTime(slot)}
                    </button>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Book Now Section ---
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
            onClick={() => {
              setBookingSuccess(false);
              setShowConfirm(true);
            }}
            className="group px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Book {selectedSlots.length === 1 ? 'Session' : 'Sessions'}
          </button>
        </div>
        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-purple-700">Confirm Booking</h3>
              <p className="mb-4 text-gray-700">Are you sure you want to book the following sessions?</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {selectedSlots.map(slotId => {
                  const slot = availableSlots.find(s => s.id === slotId);
                  return (
                    <span key={slotId} className="px-3 py-1 bg-purple-100 rounded-full border border-purple-300 text-purple-800 text-xs font-semibold">
                      {slot ? `${slot.date} ${slot.time}` : slotId}
                    </span>
                  );
                })}
              </div>
              {bookingError && <div className="text-red-500 mb-2">{bookingError}</div>}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  disabled={bookingInProgress}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookConfirm}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 shadow-lg disabled:opacity-60"
                  disabled={bookingInProgress}
                >
                  {bookingInProgress ? 'Booking...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Booking Confirm Handler (local state only) ---
  function handleBookConfirm() {
    setBookingInProgress(true);
    setBookingError(null);
    // Simulate booking: move slots from availableSlots to bookings
    const booked = availableSlots.filter(slot => selectedSlots.includes(slot.id));
    setBookings(prev => [
      ...prev,
      ...booked.map(slot => ({
        id: slot.id,
        date: slot.date,
        time: slot.time,
        length: slot.length || 30,
        status: 'booked',
      }))
    ]);
    setAvailableSlots(prev => prev.filter(slot => !selectedSlots.includes(slot.id)));
    setSelectedSlots([]);
    setShowConfirm(false);
    setBookingInProgress(false);
    setBookingSuccess(true);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Booking Success Modal (only after confirmation) */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-green-700">Booking Confirmed!</h3>
            <p className="mb-4 text-gray-700">Your sessions have been booked and will appear in your upcoming lessons.</p>
            <button
              onClick={() => setBookingSuccess(false)}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Select your preferred available times</p>
              </div>
            </div>

            {/* Week Navigation */}
            {BookWeekNav()}

            {/* Week Calendar View of Available Times */}
            {BookAvailableTimes()}

            {/* Selection Summary (moved below calendar) */}
            {BookSelectionSummary()}

            {/* Book Now Section */}
            {BookNowSection()}
          </div>
        )}
        {activeTab === "Buy" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700">Book & Checkout</h2>
            {/* Lesson Options */}
            <div className="mb-8">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                {lessonOptions.map((option: { length: number; price: number; icon: string; desc: string }) => (
                  <div key={option.length} className={`flex flex-col items-start p-5 rounded-2xl border-2 ${selectedOption === option.length ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'} shadow transition-all duration-200`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-bold text-lg">{option.length} min Lesson</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-2">{option.desc}</div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-indigo-700 font-bold text-xl">${option.price}</span>
                      <span className="text-xs text-slate-400">per lesson</span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto w-full">
                      <button
                        className={`px-3 py-1 rounded-lg font-semibold text-sm border-2 ${selectedOption === option.length ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'}`}
                        onClick={() => setSelectedOption(selectedOption === option.length ? null : option.length)}
                        type="button"
                      >
                        {selectedOption === option.length ? 'Selected' : 'Select'}
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantities[option.length]}
                        onChange={e => setQuantities(q => ({ ...q, [option.length]: Math.max(1, Number(e.target.value)) }))}
                        className="w-16 px-2 py-1 border rounded-lg text-center text-base font-semibold text-indigo-700 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        disabled={selectedOption !== option.length}
                      />
                      <span className="text-xs text-slate-500">Qty</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Checkout Section (moved above footer) */}
            {(() => {
              // Calculate total price for Buy tab
              const totalPrice = Object.keys(quantities).reduce((sum, length) => {
                const qty = quantities[Number(length)];
                const option = lessonOptions.find(opt => opt.length === Number(length));
                return sum + (qty * (option?.price || 0));
              }, 0);
              return (
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                      Your Booking Summary
                    </h3>
                    <div className="text-right mt-2 sm:mt-0">
                      <span className="text-sm sm:text-base text-gray-500 mr-2">Total:</span>
                      <span className="text-2xl font-bold text-indigo-700">
                        ${'{'}totalPrice.toFixed(2){'}'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {Object.keys(quantities).map(length => {
                      const qty = quantities[Number(length)];
                      if (qty === 0) return null;
                      const option = lessonOptions.find(opt => opt.length === Number(length));
                      return (
                        <div key={length} className="flex justify-between items-center text-sm sm:text-base p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{option?.icon}</span>
                            <span className="font-semibold">{option?.length} min Lesson</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Qty: {qty}</span>
                            <span className="text-indigo-700 font-bold">${option?.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {activeTab === "Upcoming" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-700">Upcoming Lessons</h2>
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                You have no upcoming lessons. Book some lessons now!
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 sm:p-5 rounded-xl border-l-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800">{`Lesson on ${new Date(booking.date + ' ' + booking.time).toLocaleString()}`}</h4>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">{`Duration: ${booking.length} minutes`}</p>
                        <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600">
                          <span><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "Account" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-700">Account Settings</h2>
            {/* Account details and settings form can go here */}
            <p className="text-center text-gray-500 py-10">
              Account settings feature is not yet implemented.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

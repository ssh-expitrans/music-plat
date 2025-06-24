"use client";

import { useEffect, useState } from "react";
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
        let userData = userDoc.exists() ? userDoc.data() : null;
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
                  {profile && Object.entries({
                    "Name": profile.firstName + ' ' + profile.lastName,
                    "Email": profile.email,
                    "Role": profile.role,
                  }).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 space-y-1 sm:space-y-0">
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">{key}:</span>
                      <span className="text-gray-800 font-medium text-sm sm:text-base break-words">{value}</span>
                    </div>
                  ))}
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
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Book Lessons</h2>
            <p className="mb-4 text-gray-600">Your upcoming and available lesson slots will appear here soon.</p>
            {/* Implement booking logic here using bookings and timeSlots */}
          </div>
        )}
        {activeTab === "Buy" && (
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Buy Packages</h2>
            <p className="mb-4 text-gray-600">Purchase lesson packages and memberships here. (Coming soon!)</p>
          </div>
        )}
        {activeTab === "Upcoming" && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <h2 className="text-3xl font-bold mb-8 text-emerald-700">Upcoming Lessons</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500">No upcoming lessons scheduled.</p>
            ) : (
              bookings
                .filter(b => new Date(b.date + ' ' + b.time) > new Date())
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .map((lesson) => (
                  <div key={lesson.id} className="group bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slideInUp mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xs font-medium">{new Date(lesson.date).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</span>
                            <span className="text-xl font-bold">{new Date(lesson.date).getDate()}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{lesson.time}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center text-gray-700 font-semibold"><span className="mr-2 text-xl">🎹</span>Piano</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
        {activeTab === "Account" && (
          <div className="max-w-2xl mx-auto animate-fadeIn px-4 sm:px-6 lg:px-8">
            <div className="my-12 sm:my-16 pb-24 sm:pb-32">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl shadow-xl px-6 py-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3">Account</h2>
                <p className="text-gray-700 text-base sm:text-lg mb-2">Welcome, {profile?.firstName}!</p>
                <p className="text-gray-700 text-base sm:text-lg mb-2">Email: {profile?.email}</p>
                <p className="text-gray-700 text-base sm:text-lg mb-2">Role: {profile?.role}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-green-600 text-lg">🔒</span>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Your data is secure</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-700 font-medium">
                <span className="text-xl">🔒</span>
                <span>Your data is secure and private</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
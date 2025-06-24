"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { addDoc } from "firebase/firestore";

const tabs = [
  "Students",
  "Upcoming",
  "Homework",
  "Notes",
  "Calendar",
  "Settings",
];

const getTabIcon = (tab: string) => {
  switch (tab) {
    case "Students":
      return "👥";
    case "Upcoming":
      return "⏰";
    case "Homework":
      return "📚";
    case "Notes":
      return "📝";
    case "Calendar":
      return "📅";
    case "Settings":
      return "⚙️";
    default:
      return "";
  }
};

export default function TeacherDashReal() {
  const [activeTab, setActiveTab] = useState("Students");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [students, setStudents] = useState<DocumentData[]>([]);
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [homework, setHomework] = useState<DocumentData[]>([]);
  const [notes, setNotes] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Move all useState hooks to the top-level, before any early returns
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setUser(firebaseUser);
      try {
        // Fetch teacher profile
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setProfile(userDoc.exists() ? userDoc.data() : null);
        // Fetch all students (no teacherId filter)
        const studentsSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "student"))
        );
        setStudents(studentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        // Fetch bookings for this teacher
        const bookingsSnap = await getDocs(
          query(collection(db, "bookings"), where("teacherId", "==", firebaseUser.uid))
        );
        setBookings(bookingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        // Fetch homework assigned by this teacher
        const homeworkSnap = await getDocs(
          query(collection(db, "homework"), where("teacherId", "==", firebaseUser.uid))
        );
        setHomework(homeworkSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        // Fetch notes for this teacher
        const notesSnap = await getDocs(
          query(collection(db, "notes"), where("teacherId", "==", firebaseUser.uid))
        );
        setNotes(notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (profile) {
      setContactInfo({
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin-slow text-6xl mb-4">🎵</div>
          <p className="text-lg text-purple-100 font-semibold">Loading your dashboard...</p>
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

  // Helper: sort students by name
  const sortedStudents = [...students].sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));

  // Helper: get upcoming lessons
  const upcomingLessons = bookings
    .filter((b) => new Date(b.date + " " + b.time) > new Date())
    .sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime());

  // Helper: get calendar dates
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  function toggleBlockDate(dateStr: string) {
    setBlockedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  }

  // UI rendering (structure and styles adapted from demo dashboard)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ...Header and Tabs... */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 rounded-3xl shadow-2xl text-white overflow-hidden animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-bold mb-4 animate-slideInLeft">
                🎵 Teacher Studio Dashboard 🎵
              </h1>
              <p className="text-xl text-purple-100 animate-slideInLeft">
                Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.email}
              </p>
            </div>
          </div>
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 animate-fadeIn">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                    : "glass-effect text-white hover:bg-white/20"
                }`}
              >
                <span className="text-xl mr-2">{getTabIcon(tab)}</span>
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse-gentle"></div>
                )}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="glass-effect p-8 rounded-3xl shadow-2xl min-h-[500px] animate-fadeIn">
            {/* Students Tab */}
            {activeTab === "Students" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  👥 Your Students
                </h2>
                {sortedStudents.length === 0 ? (
                  <p className="text-purple-200">No students found.</p>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    {sortedStudents.map((student) => (
                      <div key={student.id} className="glass-effect rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl text-white font-bold">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{student.firstName} {student.lastName}</h3>
                            <p className="text-purple-200 text-sm mb-3">
                              🎯 {student.skillLevel || "-"} | 🎂 {(() => {
                                if (!student.dob) return "-";
                                const dobDate = new Date(student.dob);
                                const today = new Date();
                                let years = today.getFullYear() - dobDate.getFullYear();
                                const m = today.getMonth() - dobDate.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) years--;
                                return years > 0 ? years : "-";
                              })()} years
                            </p>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-purple-200 mb-1">
                                <span>Progress</span>
                                <span>{student.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 shadow-lg"
                                  style={{ width: `${student.progress || 0}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg"
                                onClick={() => setActiveTab("Homework")}
                              >
                                📚 Assign Homework
                              </button>
                              <button
                                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg"
                                onClick={() => setActiveTab("Notes")}
                              >
                                📝 Add Note
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Upcoming Tab */}
            {activeTab === "Upcoming" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ⏰ Upcoming Lessons
                </h2>
                {upcomingLessons.length === 0 ? (
                  <p className="text-purple-200">No upcoming lessons scheduled.</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingLessons.map((lesson) => (
                      <div key={lesson.id} className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{lesson.studentName || "Student"}</h3>
                            <p className="text-white/80">{lesson.date} at {lesson.time}</p>
                          </div>
                          <div className="text-3xl animate-pulse-gentle">🎵</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Homework Tab */}
            {activeTab === "Homework" && (
              <TeacherHomeworkTab students={sortedStudents} teacherId={user.uid} onAssign={() => setActiveTab("Students")}/>
            )}
            {/* Notes Tab */}
            {activeTab === "Notes" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  📝 Student Notes
                </h2>
                {notes.length === 0 ? (
                  <p className="text-purple-200">No notes yet.</p>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="glass-effect p-6 rounded-2xl border border-white/20">
                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 rounded-full mt-2 bg-yellow-500 shadow-lg"></div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{note.studentName || "Student"}</h3>
                            <p className="text-purple-200">{note.text || note.note}</p>
                          </div>
                          <button className="text-purple-300 hover:text-white transition-colors duration-200">
                            ✏️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Calendar Tab */}
            {activeTab === "Calendar" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  📅 Calendar Management
                </h2>
                <p className="text-purple-200">Click days to block them out. Blocked days appear in red.</p>
                <div className="glass-effect p-6 rounded-2xl border border-white/20">
                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-lg font-bold text-purple-300 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
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
                          className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-110 ${
                            isBlocked
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                              : "glass-effect text-white hover:bg-white/20 border border-white/20"
                          } ${isToday ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent" : ""}`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === "Settings" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ⚙️ Settings
                </h2>
                {/* Profile Section */}
                <div className="glass-effect p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">👤 Personal Profile</h3>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl text-white font-bold shadow-xl">
                      👩‍🏫
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-purple-200 mb-2 font-medium">Bio</label>
                    <textarea
                      rows={3}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Tell your students about yourself..."
                      defaultValue={profile?.bio || "Passionate music teacher..."}
                    />
                  </div>
                </div>
                {/* Contact Info */}
                <div className="glass-effect p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">📞 Contact Information</h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-200 mb-2 font-medium">📧 Email</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={handleContactChange}
                        name="email"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="teacher@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-2 font-medium">📱 Phone</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={handleContactChange}
                        name="phone"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-purple-200 mb-2 font-medium">🏠 Address</label>
                      <textarea
                        value={contactInfo.address}
                        onChange={handleContactChange}
                        name="address"
                        rows={2}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="123 Music Street, Harmony City, HC 12345"
                      />
                    </div>
                  </div>
                </div>
                {/* Rate Settings */}
                <div className="glass-effect p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">💰 Teaching Rate</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200">Current hourly rate</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        ${profile?.rate || 50}/hour
                      </p>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
                      💲 Update Rate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add TeacherHomeworkTab component at the bottom
function TeacherHomeworkTab({ students, teacherId, onAssign }: { students: any[]; teacherId: string; onAssign: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addDoc(collection(db, "homework"), {
        title,
        description,
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate,
        studentId: selectedStudent,
        teacherId,
      });
      setSuccess("Homework assigned!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedStudent("");
      onAssign();
    } catch (e: any) {
      setError(e.message || "Failed to assign homework.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        📚 Assign Homework
      </h2>
      <form onSubmit={handleAssign} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-purple-200 mb-2 font-medium">Student</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
            required
          >
            <option value="">Select student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-purple-200 mb-2 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-purple-200 mb-2 font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-purple-200 mb-2 font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
            required
          />
        </div>
        {error && <div className="text-red-400 font-medium">{error}</div>}
        {success && <div className="text-green-400 font-medium">{success}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Homework"}
        </button>
      </form>
    </div>
  );
}

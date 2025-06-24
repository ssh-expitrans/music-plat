"use client";

import { useEffect, useState, useRef } from "react";
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
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { addDoc, deleteDoc, updateDoc } from "firebase/firestore";

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
  const [notes, setNotes] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Move all useState hooks to the top-level, before any early returns
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  });
  const [lessonSlots, setLessonSlots] = useState<any[]>([]);
  const [slotForm, setSlotForm] = useState({
    startDate: "",
    endDate: "",
    time: "",
    duration: 30, // in minutes
    daysOfWeek: [] as number[], // 0=Sun, 1=Mon, ...
    maxStudents: 8,
  });
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [slotSuccess, setSlotSuccess] = useState("");

  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const slotSuccessTimeout = useRef<NodeJS.Timeout | null>(null);

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
        // Fetch notes for this teacher
        const notesSnap = await getDocs(
          query(collection(db, "notes"), where("teacherId", "==", firebaseUser.uid))
        );
        setNotes(notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        // Fetch lesson slots for this teacher
        const slotsSnap = await getDocs(
          query(collection(db, "lessonSlots"), where("teacherId", "==", firebaseUser.uid))
        );
        setLessonSlots(slotsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  // Auto-hide slotSuccess after 3 seconds
  useEffect(() => {
    if (slotSuccess) {
      if (slotSuccessTimeout.current) clearTimeout(slotSuccessTimeout.current);
      slotSuccessTimeout.current = setTimeout(() => setSlotSuccess("") , 3000);
    }
    return () => {
      if (slotSuccessTimeout.current) clearTimeout(slotSuccessTimeout.current);
    };
  }, [slotSuccess]);

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

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  }

  // Helper: generate 15-min increment times ("14:00", "14:15", ...)
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const h = Math.floor(i / 4);
    const m = (i % 4) * 15;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  });

  // Helper: weekday names
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Bulk slot creation handler
  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setSlotError("You must be logged in as a teacher to add a slot.");
      return;
    }
    setSlotLoading(true);
    setSlotError("");
    setSlotSuccess("");
    try {
      const { startDate, endDate, time, duration, daysOfWeek, maxStudents } = slotForm;
      if (!startDate || !time || daysOfWeek.length === 0) {
        setSlotError("Please fill all fields and select at least one day.");
        setSlotLoading(false);
        return;
      }
      let slotsToAdd = [];
      // If endDate is empty, treat as single-slot creation
      if (!endDate) {
        const singleDate = parseLocalDate(startDate);
        if (daysOfWeek.includes(singleDate.getDay())) {
          // Check for overlap
          const overlap = lessonSlots.some(slot => slot.date === startDate && slot.time === time);
          if (overlap) {
            setSlotError(`Overlap detected: You already have a slot on ${singleDate.toLocaleDateString()} at ${time}.`);
            setSlotLoading(false);
            return;
          }
          slotsToAdd.push({
            date: startDate, // keep as YYYY-MM-DD
            time,
            duration,
            maxStudents,
            teacherId: user.uid,
            bookedStudentIds: [],
            createdAt: Timestamp.now(),
          });
        } else {
          setSlotError("Selected weekday does not match the chosen date.");
          setSlotLoading(false);
          return;
        }
      } else {
        // Bulk creation between start and end date
        const start = parseLocalDate(startDate);
        const end = parseLocalDate(endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayCopy = new Date(d);
          if (daysOfWeek.includes(dayCopy.getDay())) {
            const dateStr = dayCopy.toISOString().split("T")[0];
            const overlap = lessonSlots.some(slot => slot.date === dateStr && slot.time === time);
            if (overlap) {
              setSlotError(`Overlap detected: You already have a slot on ${dayCopy.toLocaleDateString()} at ${time}.`);
              setSlotLoading(false);
              return;
            }
            slotsToAdd.push({
              date: dateStr,
              time,
              duration,
              maxStudents,
              teacherId: user.uid,
              bookedStudentIds: [],
              createdAt: Timestamp.now(),
            });
          }
        }
      }
      if (slotsToAdd.length === 0) {
        setSlotError("No valid slots to add (possible overlap or no days selected).");
        setSlotLoading(false);
        return;
      }
      // Add all slots in parallel
      await Promise.all(slotsToAdd.map(slot => addDoc(collection(db, "lessonSlots"), slot)));
      setSlotSuccess(`${slotsToAdd.length} slot(s) added!`);
      setSlotForm({ startDate: "", endDate: "", time: "", duration: 30, daysOfWeek: [], maxStudents: 8 });
      // Optionally, refresh slots list
      const slotsSnap = await getDocs(
        query(collection(db, "lessonSlots"), where("teacherId", "==", user.uid))
      );
      setLessonSlots(slotsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      setSlotError(e.message || "Failed to add slot(s).");
    } finally {
      setSlotLoading(false);
    }
  }

  async function handleDeleteSlot(slotId: string) {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteDoc(doc(db, "lessonSlots", slotId));
      setLessonSlots((prev) => prev.filter((s) => s.id !== slotId));
      setSlotToDelete(null);
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete slot.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleBulkDelete() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await Promise.all(selectedSessions.map(id => deleteDoc(doc(db, "lessonSlots", id))));
      setLessonSlots((prev) => prev.filter((s) => !selectedSessions.includes(s.id)));
      setSelectedSessions([]);
      setBulkDeleteConfirm(false);
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete sessions.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // Helper: format session display
  function formatSession(slot: any) {
    const dateObj = parseLocalDate(slot.date);
    // Use local date for day/month
    const [hour, minute] = slot.time.split(":");
    dateObj.setHours(Number(hour), Number(minute));
    const day = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
    const month = dateObj.toLocaleDateString(undefined, { month: 'short' });
    const dayNum = dateObj.getDate();
    const time = dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${day}, ${month} ${dayNum}, ${time} (${slot.duration} min) • Max: ${slot.maxStudents} • Booked: ${slot.bookedStudentIds?.length || 0}`;
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
                  ⏰ Upcoming Lessons (Week View)
                </h2>
                <WeekViewCalendar
                  lessonSlots={lessonSlots}
                  students={students}
                />
              </div>
            )}
            {/* Homework Tab */}
            {activeTab === "Homework" && (
              <div className="space-y-6">
                <TeacherHomeworkTab
                  students={sortedStudents.map(s => ({
                    id: s.id,
                    firstName: s.firstName,
                    lastName: s.lastName,
                    dob: s.dob,
                    skillLevel: s.skillLevel,
                    progress: s.progress,
                  }))}
                  teacherId={user.uid}
                  onAssign={() => setActiveTab("Students")}
                />
              </div>
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
                  📅 Session Calendar
                </h2>
                <div className="glass-effect p-6 rounded-2xl border border-white/20 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Add Session(s)</h3>
                  <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">Start Date</label>
                      <input type="date" value={slotForm.startDate} min={today.toISOString().split('T')[0]} onChange={e => setSlotForm(f => ({ ...f, startDate: e.target.value }))} className="w-full p-2 rounded bg-slate-800 border border-white/20 text-white" required />
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">End Date <span className="text-purple-300 text-xs">(optional for single slot)</span></label>
                      <input type="date" value={slotForm.endDate} min={slotForm.startDate || today.toISOString().split('T')[0]} onChange={e => setSlotForm(f => ({ ...f, endDate: e.target.value }))} className="w-full p-2 rounded bg-slate-800 border border-white/20 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">Days of Week</label>
                      <div className="flex gap-1 flex-wrap">
                        {weekdayNames.map((day, idx) => (
                          <button
                            type="button"
                            key={day}
                            className={`px-2 py-1 rounded-lg border text-sm font-semibold ${slotForm.daysOfWeek.includes(idx) ? "bg-purple-500 text-white" : "bg-slate-800 text-purple-200 border-white/20"}`}
                            onClick={() => setSlotForm(f => ({ ...f, daysOfWeek: f.daysOfWeek.includes(idx) ? f.daysOfWeek.filter(d => d !== idx) : [...f.daysOfWeek, idx] }))}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">Time</label>
                      <select value={slotForm.time} onChange={e => setSlotForm(f => ({ ...f, time: e.target.value }))} className="w-full p-2 rounded bg-slate-800 border border-white/20 text-white" required>
                        <option value="">Select time</option>
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">Duration (min)</label>
                      <select value={slotForm.duration} onChange={e => setSlotForm(f => ({ ...f, duration: Number(e.target.value) }))} className="w-full p-2 rounded bg-slate-800 border border-white/20 text-white">
                        {[15, 30, 45, 60, 90].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-1 font-medium">Max Students</label>
                      <input type="number" min={1} max={20} value={slotForm.maxStudents} onChange={e => setSlotForm(f => ({ ...f, maxStudents: Number(e.target.value) }))} className="w-full p-2 rounded bg-slate-800 border border-white/20 text-white" required />
                    </div>
                    <button type="submit" disabled={slotLoading} className="md:col-span-5 mt-2 py-2 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:bg-indigo-700 transition disabled:opacity-60">
                      {slotLoading ? "Adding..." : "Add Session(s)"}
                    </button>
                  </form>
                  {slotError && <div className="text-red-400 font-medium mt-2">{slotError}</div>}
                  {slotSuccess && <div className="text-green-400 font-medium mt-2">{slotSuccess}</div>}
                </div>
                <div className="glass-effect p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Sessions</h3>
                  {lessonSlots.length === 0 ? (
                    <p className="text-purple-200">No sessions yet.</p>
                  ) : (
                    <>
                      {selectedSessions.length > 0 && (
                        <div className="mb-2 flex items-center gap-2">
                          <button
                            className="text-red-500 hover:text-red-700 text-2xl px-3 py-1 rounded-xl bg-white/10 border border-red-400 font-bold flex items-center gap-2"
                            onClick={() => setBulkDeleteConfirm(true)}
                            disabled={deleteLoading}
                          >
                            🗑️ Delete Selected ({selectedSessions.length})
                          </button>
                        </div>
                      )}
                      <ul className="space-y-2">
                        {lessonSlots.map(slot => (
                          <li key={slot.id} className={`flex flex-col md:flex-row md:items-center justify-between bg-white/10 rounded-xl p-4 text-white relative group ${selectedSessions.includes(slot.id) ? 'ring-2 ring-red-400' : ''}`}>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedSessions.includes(slot.id)}
                                onChange={e => setSelectedSessions(sel => e.target.checked ? [...sel, slot.id] : sel.filter(id => id !== slot.id))}
                                className="accent-purple-500 w-5 h-5"
                              />
                              <span>{formatSession(slot)}</span>
                            </div>
                            <button
                              className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors text-xl opacity-80 group-hover:opacity-100"
                              title="Delete session"
                              onClick={() => setSlotToDelete(slot.id)}
                            >
                              🗑️
                            </button>
                          </li>
                        ))}
                      </ul>
                      {/* Bulk delete confirmation dialog */}
                      {bulkDeleteConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
                            <h4 className="text-xl font-bold mb-4 text-slate-900">Are you sure you want to delete {selectedSessions.length} session(s)?</h4>
                            <div className="flex justify-center gap-4 mt-4">
                              <button
                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-700 transition"
                                onClick={handleBulkDelete}
                                disabled={deleteLoading}
                              >
                                {deleteLoading ? "Deleting..." : "Yes, Delete"}
                              </button>
                              <button
                                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                                onClick={() => setBulkDeleteConfirm(false)}
                                disabled={deleteLoading}
                              >
                                Cancel
                              </button>
                            </div>
                            {deleteError && <div className="text-red-500 mt-2">{deleteError}</div>}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {/* Delete confirmation dialog */}
                  {slotToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
                        <h4 className="text-xl font-bold mb-4 text-slate-900">Are you sure you want to delete this session?</h4>
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-700 transition"
                            onClick={() => handleDeleteSlot(slotToDelete)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Yes, Delete"}
                          </button>
                          <button
                            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                            onClick={() => setSlotToDelete(null)}
                            disabled={deleteLoading}
                          >
                            Cancel
                          </button>
                        </div>
                        {deleteError && <div className="text-red-500 mt-2">{deleteError}</div>}
                      </div>
                    </div>
                  )}
                </div>
                {/* Calendar grid showing only sessions */}
                <div className="glass-effect p-6 rounded-2xl border border-white/20 mt-8">
                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                      const localDate = parseLocalDate(dateStr);
                      // Only show sessions visually, no block logic
                      const isToday = dateStr === today.toISOString().split("T")[0];
                      const isPast = localDate.getTime() < today.setHours(0,0,0,0);
                      const sessionsOnDay = lessonSlots.filter(slot => slot.date === dateStr);
                      return (
                        <div
                          key={dateStr}
                          className={`p-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 relative min-h-[48px] flex flex-col items-center justify-start ${
                            isToday ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent" : ""
                          } ${isPast ? "opacity-40" : ""}`}
                        >
                          <div className="text-white text-lg mb-1">{localDate.getDate()}</div>
                          {sessionsOnDay.length > 0 && (
                            <div className="flex flex-col gap-1 w-full">
                              {sessionsOnDay.map(slot => (
                                <div key={slot.id} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs rounded px-1 py-0.5 shadow-md truncate" title={formatSession(slot)}>
                                  {slot.time} ({slot.duration}m)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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

// Define Student interface for type safety
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  skillLevel?: string;
  progress?: number;
}

// Define Homework interface for type safety
interface Homework {
  id: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  studentId: string;
  teacherId: string;
  done: boolean;
}

// Add TeacherHomeworkTab component at the bottom
function TeacherHomeworkTab({ students, teacherId, onAssign }: { students: Student[]; teacherId: string; onAssign: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // Fetch all homework assigned by this teacher
  useEffect(() => {
    let ignore = false;
    async function fetchHomework() {
      setListLoading(true);
      try {
        const q = query(collection(db, "homework"), where("teacherId", "==", teacherId));
        const snap = await getDocs(q);
        if (!ignore) {
          setHomeworkList(
            snap.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || '',
                description: data.description || '',
                assignedDate: data.assignedDate || '',
                dueDate: data.dueDate || '',
                studentId: data.studentId || '',
                teacherId: data.teacherId || '',
                done: typeof data.done === 'boolean' ? data.done : false,
              };
            }).sort((a, b) => (b.assignedDate || '').localeCompare(a.assignedDate || ''))
          );
        }
      } catch {
        if (!ignore) setHomeworkList([]);
      }
      setListLoading(false);
    }
    fetchHomework();
    return () => { ignore = true; };
  }, [teacherId, success]);

  // Mark homework as done/undone
  async function toggleDone(hwId: string, current: boolean) {
    try {
      await updateDoc(doc(db, "homework", hwId), { done: !current });
      setHomeworkList(list => list.map(hw => hw.id === hwId ? { ...hw, done: !current } : hw));
    } catch {}
  }

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
        done: false,
      });
      setSuccess("Homework assigned!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedStudent("");
      onAssign();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to assign homework.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to get student name by id
  function getStudentName(id: string) {
    const s = students.find(stu => stu.id === id);
    return s ? `${s.firstName} ${s.lastName}` : "Unknown Student";
  }

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        📚 Assign Homework
      </h2>
      <form onSubmit={handleAssign} className="space-y-4 max-w-lg mx-auto glass-effect p-6 rounded-2xl border border-white/20">
        <div>
          <label className="block text-purple-200 mb-2 font-medium">Student</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-slate-900 border border-white/20 focus:ring-2 focus:ring-purple-500"
            required
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          >
            <option value="" className="text-slate-500 bg-white">Select student</option>
            {students.map(s => (
              <option key={s.id} value={s.id} className="text-slate-900 bg-white">{s.firstName} {s.lastName}</option>
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
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <span>🗂️</span> Assigned Homework
        </h3>
        {listLoading ? (
          <div className="text-purple-200">Loading homework...</div>
        ) : homeworkList.length === 0 ? (
          <div className="text-purple-200">No homework assigned yet.</div>
        ) : (
          <div className="space-y-4">
            {homeworkList.map(hw => (
              <div key={hw.id} className="glass-effect rounded-2xl p-5 border border-white/20 shadow-lg flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg text-white font-bold">
                      {getStudentName(hw.studentId).split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{getStudentName(hw.studentId)}</div>
                      <div className="text-purple-200 text-xs">Assigned: {hw.assignedDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900">
                      Due: {hw.dueDate}
                    </span>
                    <button
                      className={`ml-2 px-3 py-1 rounded-xl text-xs font-bold transition-colors duration-200 ${hw.done ? 'bg-green-500 text-white' : 'bg-slate-700 text-white'}`}
                      onClick={() => toggleDone(hw.id, hw.done)}
                      type="button"
                      title={hw.done ? 'Mark as not done' : 'Mark as done'}
                    >
                      {hw.done ? 'Done' : 'Not Done'}
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent mb-1">
                    {hw.title}
                  </div>
                  <div className="text-white/90 text-base whitespace-pre-line">
                    {hw.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WeekViewCalendar({ lessonSlots, students }: { lessonSlots: any[]; students: any[] }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  // Group slots by date
  const slotsByDate: { [date: string]: any[] } = {};
  lessonSlots.forEach(slot => {
    // Always use slot.date as key (YYYY-MM-DD)
    if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
    slotsByDate[slot.date].push(slot);
  });
  // Helper to get student names for a slot
  function getStudentNames(slot: any) {
    if (!slot.bookedStudentIds || slot.bookedStudentIds.length === 0) return 'None';
    return slot.bookedStudentIds.map((id: string) => {
      const s = students.find((stu: any) => stu.id === id);
      return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
    }).join(', ');
  }
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-3 py-1 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600"
          onClick={() => setWeekOffset(w => w - 1)}
        >
          ← Previous
        </button>
        <div className="text-xl font-bold text-white">
          {days[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <button
          className="px-3 py-1 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600"
          onClick={() => setWeekOffset(w => w + 1)}
        >
          Next →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          const slots = slotsByDate[dateStr] || [];
          return (
            <div key={dateStr} className="bg-white/10 rounded-2xl p-2 min-h-[120px] flex flex-col">
              <div className="text-center text-purple-200 font-bold mb-2">
                {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {slots.length === 0 ? (
                <div className="text-purple-300 text-xs text-center">No sessions</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {slots.sort((a, b) => a.time.localeCompare(b.time)).map(slot => (
                    <div key={slot.id} className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2 text-white shadow-md">
                      <div className="font-bold text-sm">{slot.time} ({slot.duration} min)</div>
                      <div className="text-xs">Max: {slot.maxStudents} | Booked: {slot.bookedStudentIds?.length || 0}</div>
                      <div className="text-xs">Students: {getStudentNames(slot)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to parse date string as local date (not UTC)
function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

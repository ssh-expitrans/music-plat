// components/TeacherDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  skillLevel: string;
  ageGroup: string;
}

const tabs = ["Overview", "Students", "Schedule", "Bookings", "Settings"];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [students, setStudents] = useState<Student[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, logout } = useAuth();

  // Demo data for when not connected to real data
  const demoStudents: Student[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', createdAt: new Date() },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', createdAt: new Date() },
    { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', createdAt: new Date() },
  ];

  const demoBookings: Booking[] = [
    { id: '1', studentId: '1', studentName: 'John Doe', date: '2024-01-15', time: '10:00 AM', status: 'upcoming', skillLevel: 'Beginner', ageGroup: '12-14' },
    { id: '2', studentId: '2', studentName: 'Jane Smith', date: '2024-01-16', time: '2:00 PM', status: 'upcoming', skillLevel: 'Intermediate', ageGroup: '15-17' },
    { id: '3', studentId: '3', studentName: 'Mike Johnson', date: '2024-01-10', time: '11:00 AM', status: 'completed', skillLevel: 'Advanced', ageGroup: 'Adult' },
  ];

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!userProfile) {
        // Use demo data if no user profile (demo mode)
        setStudents(demoStudents);
        setBookings(demoBookings);
        setLoading(false);
        return;
      }

      try {
        // Fetch students assigned to this teacher
        const studentsQuery = query(
          collection(db, 'users'),
          where('teacherId', '==', userProfile.uid),
          where('role', '==', 'student')
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsList = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Student[];

        // Fetch bookings for this teacher
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('teacherId', '==', userProfile.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsList = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];

        setStudents(studentsList);
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        // Fallback to demo data on error
        setStudents(demoStudents);
        setBookings(demoBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [userProfile]);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Overview": return "📊";
      case "Students": return "👥";
      case "Schedule": return "📅";
      case "Bookings": return "📋";
      case "Settings": return "⚙️";
      default: return "";
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today && booking.status === 'upcoming';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Upcoming Lessons</h3>
          <p className="text-3xl font-bold">{getUpcomingBookings().length}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">This Month</h3>
          <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Lessons</h3>
        <div className="space-y-3">
          {getUpcomingBookings().slice(0, 5).map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{booking.studentName}</p>
                <p className="text-sm text-gray-600">{booking.skillLevel} • {booking.ageGroup}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{booking.time}</p>
              </div>
            </div>
          ))}
          {getUpcomingBookings().length === 0 && (
            <p className="text-gray-500 text-center py-8">No upcoming lessons scheduled</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">My Students</h3>
      <div className="space-y-3">
        {students.map(student => (
          <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Joined {student.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-gray-500 text-center py-8">No students assigned yet</p>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">All Bookings</h3>
      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{booking.studentName}</p>
              <p className="text-sm text-gray-600">{booking.skillLevel} • {booking.ageGroup}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">{booking.time}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-500 text-center py-8">No bookings yet</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      {/* Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {userProfile ? `${userProfile.firstName}` : 'Teacher'}!
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{getTabIcon(tab)}</span>
                  <span>{tab}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "Overview" && renderOverview()}
          {activeTab === "Students" && renderStudents()}
          {activeTab === "Bookings" && renderBookings()}
          {activeTab === "Schedule" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Schedule Management</h3>
              <p className="text-gray-600">Schedule management features coming soon...</p>
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className
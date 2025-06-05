"use client";

export default function StudentDashboard() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Student Dashboard</h1>
      <p>Welcome! Your next lesson is Monday at 3:00 PM.</p>
    </main>
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
  


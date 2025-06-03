"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const tabs = ["Login", "Logout"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("Login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simple check for token cookie presence (you might want to fetch from your API instead)
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) {
      setIsLoggedIn(true);
      // Optional: decode token or fetch user info here
      // For demo, just fake user email:
      setUserEmail("demo@example.com");
      setActiveTab("Logout");
    }
  }, []);

  function handleLogout() {
    // Clear cookie (token)
    document.cookie = "token=; path=/; max-age=0;";
    setIsLoggedIn(false);
    setUserEmail(null);
    setActiveTab("Login");
    router.push("/login"); // or redirect to homepage/demo dash
  }

  return (
    <main className="flex max-w-4xl mx-auto p-8 gap-6">
      <nav className="w-48 bg-gray-100 border border-gray-300 rounded p-4">
        <ul>
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left py-2 px-3 rounded mb-2 transition
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="flex-grow bg-white p-6 rounded shadow">
        {activeTab === "Login" && (
          <>
            {isLoggedIn ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">You are logged in as:</h2>
                <p className="mb-4 font-medium">{userEmail}</p>
                <p>If you want to switch accounts, please log out first.</p>
              </div>
            ) : (
              <LoginForm />
            )}
          </>
        )}

        {activeTab === "Logout" && (
          <>
            {isLoggedIn ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Logout</h2>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <p>You are not logged in.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function LoginForm() {
  // You can plug in your existing login form here.
  // For demo, a simple stub form:

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Replace with real login logic");
      }}
      className="max-w-sm"
    >
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <label className="block mb-2">
        Email:
        <input type="email" required className="border border-gray-300 rounded p-2 w-full" />
      </label>

      <label className="block mb-4">
        Password:
        <input type="password" required className="border border-gray-300 rounded p-2 w-full" />
      </label>

      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}

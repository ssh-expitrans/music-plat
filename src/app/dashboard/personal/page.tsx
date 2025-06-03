// app/dashboard/personal/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export default async function PersonalDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;


  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; name?: string };
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {decoded.name || decoded.email}
          </h1>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => {
              // Client-side logout by deleting cookie and redirecting
              document.cookie = "token=; path=/; max-age=0;";
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Book Lessons</h2>
          {/* TODO: Replace with your calendar integration */}
          <div className="border border-gray-300 p-6 rounded">
            <p className="italic text-gray-600">[Calendar integration coming soon]</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Buy Lessons</h2>
          <button className="px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Buy Lesson Packages
          </button>
        </section>
      </main>
    );
  } catch (error) {
    redirect("/login");
  }
}

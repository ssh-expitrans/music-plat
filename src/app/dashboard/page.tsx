import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Welcome back, {decoded.email}</h1>
        <p>This is your dashboard.</p>
      </main>
    );
  } catch (err) {
    redirect("/login");
  }
}

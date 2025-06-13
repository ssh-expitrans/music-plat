"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";


export default function StudentDashReal() {
  const [user, setUser] = useState<User | null>(null);
  const [realData, setRealData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // User not logged in, redirect back to demo dashboard or login
        router.push("/studentdash");
        return;
      }

      setUser(firebaseUser);

      const userDoc = await getDoc(doc(db, "students", firebaseUser.uid));
      if (userDoc.exists()) {
        setRealData(userDoc.data());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading your dashboard...</p>;

  if (!user) return null; // Should redirect before this renders

  return (
    <div>
      <h1>Welcome, {realData?.name || user.email}</h1>
    </div>
  );
  
}
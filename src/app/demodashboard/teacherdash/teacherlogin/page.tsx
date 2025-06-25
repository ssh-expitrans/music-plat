// app/demodashboard/teacherdash/teacherlogin/page.tsx
"use client";
import dynamic from "next/dynamic";

const TeacherLogin = dynamic(() => import("@/components/teacherlogin"), { ssr: false });

export default function TeacherLoginPage() {
  return <TeacherLogin />;
}

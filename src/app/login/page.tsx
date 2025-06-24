// app/login/page.tsx
"use client";

import { Suspense } from "react";
import Login from "@/components/login";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

// src/app/checkout/page.tsx
"use client";

import CheckoutForm from '@/components/checkoutform';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <CheckoutForm />
    </div>
  );
}
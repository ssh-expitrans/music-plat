//components/checkoutform.tsx
 
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
//import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  preferredTime: string;
  experienceLevel: string;
  specialRequests: string;
}

type FormErrors = Partial<Record<keyof FormData | "submit", string>>;

export default function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageName = searchParams.get("package") || "Single Lesson";
  const packagePrice = searchParams.get("price") || "$30";

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    preferredTime: "",
    experienceLevel: "",
    specialRequests: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiryDate = (value: string) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").trim();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const requiredFields: (keyof FormData)[] = [
      "firstName", "lastName", "email", "phone",
      "cardNumber", "expiryDate", "cvv", "cardName",
      "address", "city", "state", "zipCode"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise((res) => setTimeout(res, 2000));
      router.push("/checkout/success");
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Payment failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">Checkout - {packageName}</h1>
      <p>Price: {packagePrice}</p>

      <div>
        <label>First Name</label>
        <input name="firstName" value={formData.firstName} onChange={handleInputChange} />
        {errors.firstName && <p className="text-red-600">{errors.firstName}</p>}
      </div>

      <div>
        <label>Last Name</label>
        <input name="lastName" value={formData.lastName} onChange={handleInputChange} />
        {errors.lastName && <p className="text-red-600">{errors.lastName}</p>}
      </div>

      <div>
        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
        {errors.email && <p className="text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label>Card Number</label>
        <input
          name="cardNumber"
          value={formData.cardNumber}
          maxLength={19}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            setFormData((prev) => ({ ...prev, cardNumber: formatted }));
          }}
        />
        {errors.cardNumber && <p className="text-red-600">{errors.cardNumber}</p>}
      </div>

      <div>
        <label>Expiry Date</label>
        <input
          name="expiryDate"
          value={formData.expiryDate}
          maxLength={5}
          onChange={(e) => {
            const formatted = formatExpiryDate(e.target.value);
            setFormData((prev) => ({ ...prev, expiryDate: formatted }));
          }}
        />
        {errors.expiryDate && <p className="text-red-600">{errors.expiryDate}</p>}
      </div>

      <div>
        <label>CVV</label>
        <input
          name="cvv"
          maxLength={4}
          value={formData.cvv}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, cvv: digits }));
          }}
        />
        {errors.cvv && <p className="text-red-600">{errors.cvv}</p>}
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Complete Purchase - $${(parseFloat(packagePrice.replace("$", "")) + 2.99).toFixed(2)}`}
      </button>

      {errors.submit && <p className="text-red-600 mt-2">{errors.submit}</p>}
    </form>
  );
}

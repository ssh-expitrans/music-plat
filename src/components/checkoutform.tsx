"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

  type InputFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  maxLength?: number;
};


  function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);


  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiryDate = (value: string) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").trim();

  const validateForm = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded shadow"
    >
      <div>
        <h1 className="text-2xl font-bold">Checkout - {packageName}</h1>
        <p className="text-gray-600">Price: {packagePrice}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstName: value }))
          }
          error={errors.firstName}
        />

        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, lastName: value }))
          }
          error={errors.lastName}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, email: value }))
          }
          error={errors.email}
        />

        <InputField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, phone: value }))
          }
          error={errors.phone}
        />

        <InputField
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          maxLength={19}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              cardNumber: formatCardNumber(value),
            }))
          }
          error={errors.cardNumber}
        />

        <InputField
          label="Name on Card"
          name="cardName"
          value={formData.cardName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, cardName: value }))
          }
          error={errors.cardName}
        />

        <InputField
          label="Expiry Date"
          name="expiryDate"
          value={formData.expiryDate}
          maxLength={5}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              expiryDate: formatExpiryDate(value),
            }))
          }
          error={errors.expiryDate}
        />

        <InputField
          label="CVV"
          name="cvv"
          value={formData.cvv}
          maxLength={4}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              cvv: value.replace(/\D/g, ""),
            }))
          }
          error={errors.cvv}
        />

        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, address: value }))
          }
          error={errors.address}
        />

        <InputField
          label="City"
          name="city"
          value={formData.city}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, city: value }))
          }
          error={errors.city}
        />

        <InputField
          label="State"
          name="state"
          value={formData.state}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, state: value }))
          }
          error={errors.state}
        />

        <InputField
          label="Zip Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, zipCode: value }))
          }
          error={errors.zipCode}
        />

      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isProcessing
          ? "Processing..."
          : `Complete Purchase - $${(parseFloat(packagePrice.replace("$", "")) + 2.99).toFixed(2)}`}
      </button>

      {errors.submit && <p className="text-red-600 text-sm text-center">{errors.submit}</p>}
    </form>
  );
}

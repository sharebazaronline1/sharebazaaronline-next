// app/r/[code]/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferralRedirectPage({ params }) {
  const router = useRouter();
  const { code } = params;

  useEffect(() => {
    if (code) {
      console.log("REF CODE:", code);
      localStorage.setItem("referral_code", code);
      localStorage.setItem("pending_referral", code);
      sessionStorage.setItem("referral_code", code);
    }
    router.replace("/login");
  }, [code, router]);

  return null;
}
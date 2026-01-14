"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage({ searchParams}: { searchParams: { data?: string } }) {
  const router = useRouter();

  useEffect(() => {
    const data = searchParams.data;
    if (data) {
      localStorage.setItem("linkedinProfile", data);
      router.push("/");
    }
  }, [searchParams, router]);

  return <p>Loading…</p>;
}

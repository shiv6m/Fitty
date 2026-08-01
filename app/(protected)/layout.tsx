"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  );
}

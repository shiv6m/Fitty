"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/outfits");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {isSignUp ? "Create an account" : "Welcome back"}
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-black text-white rounded-lg py-2 font-semibold"
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-500 mt-4 underline"
      >
        {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
      </button>
    </div>
  );
}

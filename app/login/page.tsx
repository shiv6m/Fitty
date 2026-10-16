"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,}$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!USERNAME_REGEX.test(username)) {
        setError("Username must be at least 3 characters, using only letters, numbers, _ or .");
        return;
      }
    }

    setSubmitting(true);

    if (isSignUp) {
      // 1. Create the auth account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setSubmitting(false);
        return;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        setError("Something went wrong creating your account.");
        setSubmitting(false);
        return;
      }

      // 2. Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) {
          setError(uploadError.message);
          setSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        avatarUrl = urlData.publicUrl;
      }

      // 3. Insert the profile row
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username,
        avatar_url: avatarUrl,
      });

      if (profileError) {
        if (profileError.message.includes("duplicate key")) {
          setError("That username is already taken.");
        } else {
          setError(profileError.message);
        }
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      router.push("/outfits");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) {
        setError(error.message);
      } else {
        router.push("/outfits");
      }
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

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <div>
              <label className="text-sm text-gray-500 block mb-1">Profile photo (optional)</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white rounded-lg py-2 font-semibold disabled:opacity-50"
        >
          {submitting ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
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

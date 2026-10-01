"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type Outfit = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

type Profile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState<"outfits" | "saved">("outfits");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const userId = userData.user.id;

      const [{ data: profileData }, { data: outfitsData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("outfits")
          .select("id, image_url, caption, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      setProfile(profileData);
      setOutfits(outfitsData ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Header: avatar centered, settings icon top right */}
      <div className="relative flex flex-col items-center pt-6 pb-4 px-4">
        <Link
          href="/settings"
          className="absolute top-6 right-4 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg"
        >
          ⚙
        </Link>

        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-2xl">
              {profile?.username?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {profile?.username ? `@${profile.username}` : "Set your username"}
        </p>
      </div>

      {/* Horizontal rule under header */}
      <div className="border-t border-gray-200" />

      {/* Tabs — two equal boxed cells like the sketch */}
      <div className="grid grid-cols-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("outfits")}
          className={`py-3 text-sm font-medium border-r border-gray-200 ${
            activeTab === "outfits" ? "text-black font-semibold" : "text-gray-400"
          }`}
        >
          Outfits
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-3 text-sm font-medium ${
            activeTab === "saved" ? "text-black font-semibold" : "text-gray-400"
          }`}
        >
          Saved
        </button>
      </div>

      <div className="p-4">
        {loading && <p className="text-gray-400">Loading...</p>}

        {/* Outfits grid — 3 columns */}
        {!loading && activeTab === "outfits" && (
          <>
            {outfits.length === 0 && (
              <p className="text-gray-400">No outfits yet. Tap + to post your first one.</p>
            )}
            <div className="grid grid-cols-3 gap-1">
              {outfits.map((outfit) => (
                <div key={outfit.id} className="bg-gray-100 aspect-square overflow-hidden">
                  <img
                    src={outfit.image_url}
                    alt={outfit.caption ?? "Outfit"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Saved grid — placeholder until saved outfits feature is built */}
        {!loading && activeTab === "saved" && (
          <p className="text-gray-400">Saved outfits coming soon.</p>
        )}
      </div>
    </div>
  );
}

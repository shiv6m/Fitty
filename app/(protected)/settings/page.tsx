"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,}$/;

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      const { data } = await supabase
        .from("profiles")
        .select("username, display_name, bio, avatar_url")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username ?? "");
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!USERNAME_REGEX.test(username)) {
      setError("Username must be at least 3 characters, using only letters, numbers, _ or .");
      return;
    }

    if (!userId) return;
    setSaving(true);

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      newAvatarUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: newAvatarUrl,
      })
      .eq("id", userId);

    setSaving(false);

    if (updateError) {
      if (updateError.message.includes("duplicate key")) {
        setError("That username is already taken.");
      } else {
        setError(updateError.message);
      }
      return;
    }

    setAvatarUrl(newAvatarUrl);
    setAvatarFile(null);
    setSuccess(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const inputStyle = {
    borderColor: "var(--line)",
    background: "transparent",
    color: "var(--ink)",
  };

  if (loading) {
    return (
      <div className="p-4">
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-6">Settings</h1>

      <div className="mb-8">
        <ThemeToggle />
      </div>

      <hr className="stitch-divider mb-8" />

      <form onSubmit={handleSave} className="flex flex-col gap-3 mb-8">
        <div className="flex flex-col items-center mb-2">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center stitch-ring"
            style={{ background: "var(--line)" }}
          >
            {(avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl) ? (
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl!}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl" style={{ color: "var(--muted)" }}>
                {username?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="text-xs mt-3 font-mono"
          />
        </div>

        <label
          className="text-xs font-mono uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg px-4 py-2 font-mono"
          style={inputStyle}
          required
        />

        <label
          className="text-xs font-mono uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Display name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border rounded-lg px-4 py-2"
          style={inputStyle}
        />

        <label
          className="text-xs font-mono uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="border rounded-lg px-4 py-2"
          style={inputStyle}
        />

        {error && (
          <p className="text-sm" style={{ color: "var(--thread)" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm" style={{ color: "var(--denim)" }}>
            Profile updated.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg py-2 font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--ink)" }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <hr className="stitch-divider mb-8" />

      <button
        onClick={handleSignOut}
        className="w-full rounded-lg py-2 font-semibold border"
        style={{ borderColor: "var(--thread)", color: "var(--thread)" }}
      >
        Sign out
      </button>
    </div>
  );
}

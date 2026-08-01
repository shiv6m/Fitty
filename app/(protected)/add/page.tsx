"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a photo.");
      return;
    }

    setUploading(true);

    // Get the current logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError("You must be signed in.");
      setUploading(false);
      return;
    }
    const userId = userData.user.id;

    // Upload the file to Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("outfit-images")
      .upload(fileName, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("outfit-images")
      .getPublicUrl(fileName);

    // Insert a row into the outfits table
    const { error: insertError } = await supabase.from("outfits").insert({
      user_id: userId,
      image_url: urlData.publicUrl,
      caption,
    });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      router.push("/outfits");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mb-4">New Outfit</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="border border-gray-300 rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="bg-black text-white rounded-lg py-2 font-semibold disabled:opacity-50"
        >
          {uploading ? "Posting..." : "Post outfit"}
        </button>
      </form>
    </div>
  );
}

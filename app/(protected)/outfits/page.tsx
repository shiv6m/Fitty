"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Outfit = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutfits = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from("outfits")
        .select("id, image_url, caption, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOutfits(data);
      }
      setLoading(false);
    };

    fetchOutfits();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Outfits</h1>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && outfits.length === 0 && (
        <p className="text-gray-400">No outfits yet. Tap + to post your first one.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={outfit.image_url}
              alt={outfit.caption ?? "Outfit"}
              className="w-full aspect-square object-cover"
            />
            {outfit.caption && (
              <p className="text-sm p-2 truncate">{outfit.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

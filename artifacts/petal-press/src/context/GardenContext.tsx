import { createContext, useState, useEffect, ReactNode } from "react";
import { Flower } from "../data/types";
import { NativeStatus } from "../data/nativeStatus";
import { supabase } from "../lib/supabase";
import { deriveTheme } from "../data/themes";

type GardenContextType = {
  flowers: Flower[];
  loading: boolean;
  addFlower: (flower: Flower) => Promise<void>;
  addPhotoToFlower: (id: string, imageUrl: string) => Promise<void>;
  updateFlower: (id: string, updates: Partial<Flower>) => Promise<void>;
};

export const GardenContext = createContext<GardenContextType | undefined>(undefined);

type FlowerRow = {
  id: string;
  common_name: string;
  latin_name: string;
  nickname: string;
  meaning: string;
  blurb: string;
  color: string;
  theme: string;
  date_pressed: string;
  plant_family: string;
  native_status: string;
  image_url: string;
  image_urls: string[];
  user_id?: string;
  created_at: string;
};

function rowToFlower(row: FlowerRow): Flower {
  const urls: string[] = row.image_urls?.length
    ? row.image_urls
    : row.image_url ? [row.image_url] : [];
  return {
    id: row.id,
    commonName: row.common_name,
    latinName: row.latin_name,
    nickname: row.nickname,
    meaning: row.meaning,
    blurb: row.blurb,
    color: row.color,
    theme: row.theme ?? deriveTheme(row.meaning ?? ""),
    datePressed: row.date_pressed,
    plantFamily: row.plant_family,
    nativeStatus: row.native_status as NativeStatus,
    imageUrl: urls[0] ?? "",
    imageUrls: urls,
  };
}

function flowerToRow(flower: Flower): Omit<FlowerRow, "created_at" | "user_id"> {
  return {
    id: flower.id,
    common_name: flower.commonName,
    latin_name: flower.latinName,
    nickname: flower.nickname,
    meaning: flower.meaning,
    blurb: flower.blurb,
    color: flower.color,
    theme: flower.theme,
    date_pressed: flower.datePressed,
    plant_family: flower.plantFamily,
    native_status: flower.nativeStatus,
    image_url: flower.imageUrls[0] ?? "",
    image_urls: flower.imageUrls,
  };
}

async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchFlowers() {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("flowers")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load flowers:", error.message);
    } else {
      setFlowers((data as FlowerRow[]).map(rowToFlower));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFlowers();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      fetchFlowers();
    });
    return () => subscription.unsubscribe();
  }, []);

  const addFlower = async (flower: Flower) => {
    if (!supabase) { setFlowers((prev) => [...prev, flower]); return; }
    const userId = await getCurrentUserId();
    const row = { ...flowerToRow(flower), ...(userId ? { user_id: userId } : {}) };
    const { error } = await supabase.from("flowers").insert(row);
    if (error) {
      console.error("Failed to save flower:", error.message);
      throw error;
    }
    setFlowers((prev) => [...prev, flower]);
  };

  const addPhotoToFlower = async (id: string, imageUrl: string) => {
    const flower = flowers.find((f) => f.id === id);
    if (!flower) return;
    const newUrls = [...flower.imageUrls, imageUrl];
    if (!supabase) {
      setFlowers((prev) => prev.map((f) => f.id === id ? { ...f, imageUrls: newUrls, imageUrl: newUrls[0] } : f));
      return;
    }
    const { error } = await supabase
      .from("flowers")
      .update({ image_urls: newUrls, image_url: newUrls[0] })
      .eq("id", id);
    if (error) {
      console.error("Failed to add photo:", error.message);
      throw error;
    }
    setFlowers((prev) =>
      prev.map((f) => f.id === id ? { ...f, imageUrls: newUrls, imageUrl: newUrls[0] } : f)
    );
  };

  const updateFlower = async (id: string, updates: Partial<Flower>) => {
    if (!supabase) {
      setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
      return;
    }
    const dbUpdates: Partial<Omit<FlowerRow, "created_at">> = {};
    if (updates.commonName !== undefined) dbUpdates.common_name = updates.commonName;
    if (updates.latinName !== undefined) dbUpdates.latin_name = updates.latinName;
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
    if (updates.meaning !== undefined) dbUpdates.meaning = updates.meaning;
    if (updates.blurb !== undefined) dbUpdates.blurb = updates.blurb;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.datePressed !== undefined) dbUpdates.date_pressed = updates.datePressed;
    if (updates.plantFamily !== undefined) dbUpdates.plant_family = updates.plantFamily;
    if (updates.nativeStatus !== undefined) dbUpdates.native_status = updates.nativeStatus;
    if (updates.imageUrls !== undefined) {
      dbUpdates.image_urls = updates.imageUrls;
      dbUpdates.image_url = updates.imageUrls[0] ?? "";
    }

    const { error } = await supabase.from("flowers").update(dbUpdates).eq("id", id);
    if (error) {
      console.error("Failed to update flower:", error.message);
      throw error;
    }
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <GardenContext.Provider value={{ flowers, loading, addFlower, addPhotoToFlower, updateFlower }}>
      {children}
    </GardenContext.Provider>
  );
}

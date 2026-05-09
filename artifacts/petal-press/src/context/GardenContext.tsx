import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Flower } from "../data/types";
import { supabase, FlowerRow } from "../lib/supabase";

type GardenContextType = {
  flowers: Flower[];
  loading: boolean;
  addFlower: (flower: Flower) => Promise<void>;
  updateFlower: (id: string, updates: Partial<Flower>) => Promise<void>;
  toggleBouquet: (id: string) => Promise<void>;
};

const GardenContext = createContext<GardenContextType | undefined>(undefined);

function rowToFlower(row: FlowerRow): Flower {
  return {
    id: row.id,
    commonName: row.common_name,
    latinName: row.latin_name,
    nickname: row.nickname,
    meaning: row.meaning,
    blurb: row.blurb,
    color: row.color,
    datePressed: row.date_pressed,
    location: row.location,
    spottedCount: row.spotted_count,
    imageUrl: row.image_url,
    inBouquet: row.in_bouquet,
  };
}

function flowerToRow(flower: Flower): Omit<FlowerRow, "created_at"> {
  return {
    id: flower.id,
    common_name: flower.commonName,
    latin_name: flower.latinName,
    nickname: flower.nickname,
    meaning: flower.meaning,
    blurb: flower.blurb,
    color: flower.color,
    date_pressed: flower.datePressed,
    location: flower.location,
    spotted_count: flower.spottedCount,
    image_url: flower.imageUrl,
    in_bouquet: flower.inBouquet,
  };
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlowers() {
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
    fetchFlowers();
  }, []);

  const addFlower = async (flower: Flower) => {
    const { error } = await supabase.from("flowers").insert(flowerToRow(flower));
    if (error) {
      console.error("Failed to save flower:", error.message);
      throw error;
    }
    setFlowers((prev) => [...prev, flower]);
  };

  const updateFlower = async (id: string, updates: Partial<Flower>) => {
    const dbUpdates: Partial<Omit<FlowerRow, "created_at">> = {};
    if (updates.commonName !== undefined) dbUpdates.common_name = updates.commonName;
    if (updates.latinName !== undefined) dbUpdates.latin_name = updates.latinName;
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
    if (updates.meaning !== undefined) dbUpdates.meaning = updates.meaning;
    if (updates.blurb !== undefined) dbUpdates.blurb = updates.blurb;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.datePressed !== undefined) dbUpdates.date_pressed = updates.datePressed;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.spottedCount !== undefined) dbUpdates.spotted_count = updates.spottedCount;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.inBouquet !== undefined) dbUpdates.in_bouquet = updates.inBouquet;

    const { error } = await supabase.from("flowers").update(dbUpdates).eq("id", id);
    if (error) {
      console.error("Failed to update flower:", error.message);
      throw error;
    }
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const toggleBouquet = async (id: string) => {
    const flower = flowers.find((f) => f.id === id);
    if (!flower) return;
    await updateFlower(id, { inBouquet: !flower.inBouquet });
  };

  return (
    <GardenContext.Provider value={{ flowers, loading, addFlower, updateFlower, toggleBouquet }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return context;
}

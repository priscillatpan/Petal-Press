import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Flower } from "../data/types";
import { NativeStatus } from "../data/nativeStatus";
import { supabase } from "../lib/supabase";

type GardenContextType = {
  flowers: Flower[];
  loading: boolean;
  addFlower: (flower: Flower) => Promise<void>;
  updateFlower: (id: string, updates: Partial<Flower>) => Promise<void>;
};

const GardenContext = createContext<GardenContextType | undefined>(undefined);

type FlowerRow = {
  id: string;
  common_name: string;
  latin_name: string;
  nickname: string;
  meaning: string;
  blurb: string;
  color: string;
  date_pressed: string;
  plant_family: string;
  native_status: string;
  image_url: string;
  created_at: string;
};

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
    plantFamily: row.plant_family,
    nativeStatus: row.native_status as NativeStatus,
    imageUrl: row.image_url,
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
    plant_family: flower.plantFamily,
    native_status: flower.nativeStatus,
    image_url: flower.imageUrl,
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
    if (updates.plantFamily !== undefined) dbUpdates.plant_family = updates.plantFamily;
    if (updates.nativeStatus !== undefined) dbUpdates.native_status = updates.nativeStatus;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

    const { error } = await supabase.from("flowers").update(dbUpdates).eq("id", id);
    if (error) {
      console.error("Failed to update flower:", error.message);
      throw error;
    }
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <GardenContext.Provider value={{ flowers, loading, addFlower, updateFlower }}>
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

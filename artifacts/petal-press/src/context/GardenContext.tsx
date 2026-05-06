import { createContext, useContext, useState, ReactNode } from "react";
import { Flower } from "../data/types";
import { initialFlowers } from "../data/flowers";

type GardenContextType = {
  flowers: Flower[];
  addFlower: (flower: Flower) => void;
  updateFlower: (id: string, updates: Partial<Flower>) => void;
  toggleBouquet: (id: string) => void;
};

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);

  const addFlower = (flower: Flower) => {
    setFlowers((prev) => [...prev, flower]);
  };

  const updateFlower = (id: string, updates: Partial<Flower>) => {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const toggleBouquet = (id: string) => {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, inBouquet: !f.inBouquet } : f))
    );
  };

  return (
    <GardenContext.Provider value={{ flowers, addFlower, updateFlower, toggleBouquet }}>
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

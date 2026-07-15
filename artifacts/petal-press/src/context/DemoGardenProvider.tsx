import { ReactNode } from "react";
import { GardenContext } from "./GardenContext";
import { initialFlowers } from "../data/flowers";

export function DemoGardenProvider({ children }: { children: ReactNode }) {
  return (
    <GardenContext.Provider
      value={{
        flowers: initialFlowers,
        loading: false,
        addFlower: async () => {},
        addPhotoToFlower: async () => {},
        updateFlower: async () => {},
      }}
    >
      {children}
    </GardenContext.Provider>
  );
}

import { useContext } from "react";
import { GardenContext } from "./GardenContext";

export function useGarden() {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return context;
}

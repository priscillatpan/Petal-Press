import { NativeStatus } from "./nativeStatus";

export type Flower = {
  id: string;
  commonName: string;
  latinName: string;
  nickname: string;
  meaning: string;
  blurb: string;
  color: string;
  theme: string;
  datePressed: string;
  createdAt?: string;
  plantFamily: string;
  nativeStatus: NativeStatus;
  imageUrl: string;
  imageUrls: string[];
};

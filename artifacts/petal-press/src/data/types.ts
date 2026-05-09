import { NativeStatus } from "./nativeStatus";

export type Flower = {
  id: string;
  commonName: string;
  latinName: string;
  nickname: string;
  meaning: string;
  blurb: string;
  color: string;
  datePressed: string;
  plantFamily: string;
  nativeStatus: NativeStatus;
  imageUrl: string;
};

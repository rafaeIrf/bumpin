import functions from "@react-native-firebase/functions";
import { Place, PlaceType } from "./types";

// Fetch nearby places for given coordinates and included types
export async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  types: PlaceType[],
  rankPreference: "POPULARITY" | "DISTANCE" = "POPULARITY",
  maxResultCount: number = 20
): Promise<Place[]> {
  const callable = functions().httpsCallable<any, { places: Place[] }>(
    "getNearbyPlaces"
  );
  const result = await callable({
    lat: latitude,
    lng: longitude,
    types,
    rankPreference,
  });
  return (result?.data?.places || []) as Place[];
}

// Fetch featured places by fixed place IDs (batch)
export async function getFeaturedPlaces(placeIds: string[]): Promise<Place[]> {
  try {
    const callable = functions().httpsCallable<any, { places: Place[] }>(
      "getPlacesByIds"
    );
    const result = await callable({ placeIds });
    return (result?.data?.places || []) as Place[];
  } catch (err) {
    console.error("Failed to fetch featured places:", err);
    return [];
  }
}

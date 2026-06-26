export type PlaceType = "food" | "activity" | "cafe";

export type Place = {
  id: string;
  name: string;
  region: string;
  type: PlaceType;
  foodCategory?: string;
  tags: string[];
  description: string;
  address?: string;
  mapUrl?: string;
};

export type RecommendedCourse = {
  region: string;
  foodPlace: Place;
  activityPlace: Place;
  cafePlace: Place;
};

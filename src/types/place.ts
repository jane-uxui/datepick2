export type PlaceType = "food" | "activity" | "cafe";

export type Place = {
  id: string;
  name: string;
  region: string;
  type: PlaceType;
  foodCategory?: string;
  activityCategory?: string;
  customTag?: string;
  tags: string[];
  description?: string;
  address?: string;
  mapUrl?: string;
};

export type CourseItem = {
  stepType: PlaceType;
  label: "식당" | "액티비티" | "카페";
  place: Place;
};

export type RecommendedCourse = {
  region: string;
  items: CourseItem[];
};

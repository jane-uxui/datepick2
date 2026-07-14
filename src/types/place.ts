export type PlaceType = "food" | "activity" | "cafe";

export type Place = {
  id: string;
  city: string;
  region: string;
  type: PlaceType;
  category: string;
  name: string;
  customTag?: string;
  tags: string[];
  mapUrl?: string;
};

export type CourseItem = {
  stepType: PlaceType;
  label: string;
  place: Place;
};

export type RecommendedCourse = {
  items: CourseItem[];
};

import { ANY_FOOD, ANY_REGION, REGIONS } from "@/data/options";
import { places } from "@/data/places";
import type { Place, RecommendedCourse } from "@/types/place";

function randomItem<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

function findFallback(type: Place["type"], region?: string): Place {
  const regional = region ? places.filter((place) => place.type === type && place.region === region) : [];
  const candidates = regional.length > 0 ? regional : places.filter((place) => place.type === type);
  const fallback = randomItem(candidates);

  if (!fallback) {
    throw new Error(`추천 가능한 ${type} 데이터가 없습니다.`);
  }

  return fallback;
}

function pickRegion(selectedRegions: string[]): string {
  const candidates =
    selectedRegions.includes(ANY_REGION) || selectedRegions.length === 0
      ? [...REGIONS]
      : selectedRegions.filter((region) => REGIONS.includes(region as (typeof REGIONS)[number]));

  return randomItem(candidates) ?? REGIONS[0];
}

export function recommendCourse(
  selectedRegions: string[],
  selectedFoods: string[],
  selectedActivities: string[],
): RecommendedCourse {
  const region = pickRegion(selectedRegions);
  const regionalPlaces = places.filter((place) => place.region === region);
  const regionalFoods = regionalPlaces.filter((place) => place.type === "food");
  const regionalActivities = regionalPlaces.filter((place) => place.type === "activity");
  const regionalCafes = regionalPlaces.filter((place) => place.type === "cafe");

  const foodCandidates = selectedFoods.includes(ANY_FOOD)
    ? regionalFoods
    : regionalFoods.filter((place) => place.foodCategory && selectedFoods.includes(place.foodCategory));

  const activityCandidates = regionalActivities.filter((place) =>
    place.tags.some((tag) => selectedActivities.includes(tag)),
  );

  const cafePriorityTags = ["감성카페", "사진", "조용한데이트"];
  const selectedCafeTags = selectedActivities.filter((tag) => cafePriorityTags.includes(tag));
  const cafeCandidates = regionalCafes.filter((place) => place.tags.some((tag) => selectedCafeTags.includes(tag)));

  return {
    region,
    foodPlace: randomItem(foodCandidates) ?? randomItem(regionalFoods) ?? findFallback("food", region),
    activityPlace: randomItem(activityCandidates) ?? randomItem(regionalActivities) ?? findFallback("activity", region),
    cafePlace: randomItem(cafeCandidates) ?? randomItem(regionalCafes) ?? findFallback("cafe", region),
  };
}

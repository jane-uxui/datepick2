import { ANY_ACTIVITY, ANY_FOOD, ANY_REGION, REGIONS } from "@/data/options";
import { places } from "@/data/places";
import type { CourseItem, Place, RecommendedCourse } from "@/types/place";

const BAR_CATEGORY = "술집";

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

function pickFood(regionalFoods: Place[], selectedFoods: string[], options?: { barOnly?: boolean; excludeBar?: boolean }) {
  const scopedFoods = regionalFoods.filter((place) => {
    if (options?.barOnly) {
      return place.foodCategory === BAR_CATEGORY;
    }

    if (options?.excludeBar) {
      return place.foodCategory !== BAR_CATEGORY;
    }

    return true;
  });

  if (selectedFoods.includes(ANY_FOOD)) {
    return randomItem(scopedFoods) ?? randomItem(regionalFoods);
  }

  const selectedCategories = selectedFoods.filter((food) => {
    if (options?.barOnly) {
      return food === BAR_CATEGORY;
    }

    if (options?.excludeBar) {
      return food !== BAR_CATEGORY;
    }

    return true;
  });

  const selectedMatches = scopedFoods.filter((place) => place.foodCategory && selectedCategories.includes(place.foodCategory));
  return randomItem(selectedMatches) ?? randomItem(scopedFoods) ?? randomItem(regionalFoods);
}

function pickActivity(regionalActivities: Place[], selectedActivities: string[]) {
  if (selectedActivities.includes(ANY_ACTIVITY)) {
    return randomItem(regionalActivities);
  }

  const candidates = regionalActivities.filter((place) =>
    [place.activityCategory, ...place.tags].some((tag) => Boolean(tag && selectedActivities.includes(tag))),
  );

  return randomItem(candidates) ?? randomItem(regionalActivities);
}

function pickCafe(regionalCafes: Place[], selectedActivities: string[]) {
  const cafePriorityTags = ["감성카페", "사진", "조용한데이트"];
  const selectedCafeTags = selectedActivities.includes(ANY_ACTIVITY)
    ? []
    : selectedActivities.filter((tag) => cafePriorityTags.includes(tag));
  const candidates = regionalCafes.filter((place) => place.tags.some((tag) => selectedCafeTags.includes(tag)));

  return randomItem(candidates) ?? randomItem(regionalCafes);
}

function courseItem(stepType: CourseItem["stepType"], label: CourseItem["label"], place: Place): CourseItem {
  return { stepType, label, place };
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

  const hasAnyFood = selectedFoods.includes(ANY_FOOD);
  const hasBar = !hasAnyFood && selectedFoods.includes(BAR_CATEGORY);
  const hasOnlyBar = hasBar && selectedFoods.length === 1;
  const hasBarWithOtherFood = hasBar && selectedFoods.some((food) => food !== BAR_CATEGORY);

  const foodPlace = pickFood(regionalFoods, selectedFoods) ?? findFallback("food", region);
  const nonBarFoodPlace = pickFood(regionalFoods, selectedFoods, { excludeBar: true }) ?? foodPlace;
  const barFoodPlace = pickFood(regionalFoods, [BAR_CATEGORY], { barOnly: true }) ?? foodPlace;
  const activityPlace = pickActivity(regionalActivities, selectedActivities) ?? findFallback("activity", region);
  const cafePlace = pickCafe(regionalCafes, selectedActivities) ?? findFallback("cafe", region);

  if (hasOnlyBar) {
    return {
      region,
      items: [
        courseItem("activity", "액티비티", activityPlace),
        courseItem("cafe", "카페", cafePlace),
        courseItem("food", "식당", barFoodPlace),
      ],
    };
  }

  if (hasBarWithOtherFood) {
    return {
      region,
      items: [
        courseItem("food", "식당", nonBarFoodPlace),
        courseItem("activity", "액티비티", activityPlace),
        courseItem("cafe", "카페", cafePlace),
        courseItem("food", "식당", barFoodPlace),
      ],
    };
  }

  return {
    region,
    items: [
      courseItem("food", "식당", foodPlace),
      courseItem("activity", "액티비티", activityPlace),
      courseItem("cafe", "카페", cafePlace),
    ],
  };
}

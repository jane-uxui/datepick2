import {
  ANY_ACTIVITY,
  ANY_FOOD,
  ANY_REGION,
  INCHEON_ALL_REGION,
  INCHEON_REGIONS,
  SELECTABLE_REGIONS,
  SEOUL_ALL_REGION,
  SEOUL_REGIONS,
} from "@/data/options";
import { places } from "@/data/places";
import type { CourseItem, Place, PlaceType, RecommendedCourse } from "@/types/place";

const BAR_CATEGORY = "술집";
const SEOUL_CITY = "서울";
const INCHEON_CITY = "인천";
const selectableRegionSet = new Set<string>(SELECTABLE_REGIONS);
const seoulRegionSet = new Set<string>(SEOUL_REGIONS);
const incheonRegionSet = new Set<string>(INCHEON_REGIONS);
const regionAliases: Record<string, string[]> = {
  "이태원": ["이태원", "이태원/한남"],
  "구월": ["구월", "구월동"],
  "차이나타운/월미도": ["차이나타운/월미도", "차이나/월미도/용현동"],
};
const selectableCsvRegionSet = new Set<string>(SELECTABLE_REGIONS.flatMap((region) => regionAliases[region] ?? [region]));

type ScopedPlaces = {
  basePlaces: Place[];
  cityFallbackPlaces: Place[];
  globalFallbackPlaces: Place[];
};

function randomItem<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

function uniquePlaces(items: Place[]): Place[] {
  return Array.from(new Map(items.map((place) => [place.id, place])).values());
}

function expandRegion(region: string): string[] {
  return regionAliases[region] ?? [region];
}

function isSelectablePlace(place: Place): boolean {
  return selectableCsvRegionSet.has(place.region);
}

function getSelectableCity(region: string): string | undefined {
  if (seoulRegionSet.has(region)) return SEOUL_CITY;
  if (incheonRegionSet.has(region)) return INCHEON_CITY;
  return undefined;
}

function makePlaceholderPlace(type: PlaceType, category: string): Place {
  const label = type === "food" ? "식당" : type === "activity" ? "데이트 스팟" : "카페";
  return {
    id: "fallback-" + type + "-" + category,
    city: "",
    region: "추천지역",
    type,
    category,
    name: "추천 가능한 " + label,
    customTag: "준비중",
    tags: [category, "준비중"],
  };
}

function getScopedPlaces(selectedRegions: string[]): ScopedPlaces {
  const selected = selectedRegions.filter(Boolean);
  const isAnyRegion = selected.length === 0 || selected.includes(ANY_REGION);
  if (isAnyRegion) {
    return { basePlaces: places, cityFallbackPlaces: places, globalFallbackPlaces: places };
  }

  const selectedRegionSet = new Set<string>();
  const selectedCitySet = new Set<string>();
  const wholeCitySet = new Set<string>();

  for (const region of selected) {
    if (region === SEOUL_ALL_REGION) {
      selectedCitySet.add(SEOUL_CITY);
      wholeCitySet.add(SEOUL_CITY);
      continue;
    }

    if (region === INCHEON_ALL_REGION) {
      selectedCitySet.add(INCHEON_CITY);
      wholeCitySet.add(INCHEON_CITY);
      continue;
    }

    if (selectableRegionSet.has(region)) {
      for (const csvRegion of expandRegion(region)) selectedRegionSet.add(csvRegion);
      const city = getSelectableCity(region);
      if (city) selectedCitySet.add(city);
    }
  }

  const selectablePlaces = places.filter(isSelectablePlace);
  const exactRegionPlaces = selectablePlaces.filter((place) => selectedRegionSet.has(place.region));
  const wholeCityPlaces = selectablePlaces.filter((place) => wholeCitySet.has(place.city));
  const basePlaces = uniquePlaces([...exactRegionPlaces, ...wholeCityPlaces]);
  const cityFallbackPlaces =
    selectedCitySet.size > 0 ? selectablePlaces.filter((place) => selectedCitySet.has(place.city)) : selectablePlaces;

  return {
    basePlaces: basePlaces.length > 0 ? basePlaces : cityFallbackPlaces,
    cityFallbackPlaces,
    globalFallbackPlaces: selectablePlaces,
  };
}

function filterByRequest(
  candidates: Place[],
  type: PlaceType,
  categories?: string[],
  predicate: (place: Place) => boolean = () => true,
): Place[] {
  return candidates.filter((place) => {
    if (place.type !== type || !predicate(place)) return false;
    return !categories || categories.length === 0 || categories.includes(place.category);
  });
}

function pickPlace(
  scope: ScopedPlaces,
  type: PlaceType,
  options: { categories?: string[]; predicate?: (place: Place) => boolean; fallbackCategory: string },
): Place {
  const predicate = options.predicate ?? (() => true);
  const pools = [
    filterByRequest(scope.basePlaces, type, options.categories, predicate),
    filterByRequest(scope.cityFallbackPlaces, type, options.categories, predicate),
    filterByRequest(scope.globalFallbackPlaces, type, options.categories, predicate),
    filterByRequest(scope.basePlaces, type, undefined, predicate),
    filterByRequest(scope.cityFallbackPlaces, type, undefined, predicate),
    filterByRequest(scope.globalFallbackPlaces, type, undefined, predicate),
  ];
  for (const pool of pools) {
    const picked = randomItem(pool);
    if (picked) return picked;
  }
  return makePlaceholderPlace(type, options.fallbackCategory);
}

function selectedCategories(selectedOptions: string[], anyOption: string): string[] | undefined {
  if (selectedOptions.length === 0 || selectedOptions.includes(anyOption)) return undefined;
  return selectedOptions;
}

function pickFood(scope: ScopedPlaces, selectedFoods: string[], options?: { barOnly?: boolean; excludeBar?: boolean }): Place {
  const categories = selectedCategories(selectedFoods, ANY_FOOD)?.filter((category) => {
    if (options?.barOnly) return category === BAR_CATEGORY;
    if (options?.excludeBar) return category !== BAR_CATEGORY;
    return true;
  });
  return pickPlace(scope, "food", {
    categories: options?.barOnly ? [BAR_CATEGORY] : categories,
    predicate: (place) => {
      if (options?.barOnly) return place.category === BAR_CATEGORY;
      if (options?.excludeBar) return place.category !== BAR_CATEGORY;
      return true;
    },
    fallbackCategory: options?.barOnly ? BAR_CATEGORY : categories?.[0] ?? "식당",
  });
}

function pickActivity(scope: ScopedPlaces, selectedActivities: string[]): Place {
  return pickPlace(scope, "activity", {
    categories: selectedCategories(selectedActivities, ANY_ACTIVITY),
    fallbackCategory: selectedActivities.find((activity) => activity !== ANY_ACTIVITY) ?? "액티비티",
  });
}

function pickCafe(scope: ScopedPlaces): Place {
  return pickPlace(scope, "cafe", { fallbackCategory: "카페" });
}

function courseItem(stepType: CourseItem["stepType"], label: string, place: Place): CourseItem {
  return { stepType, label, place };
}

export function recommendCourse(selectedRegions: string[], selectedFoods: string[], selectedActivities: string[]): RecommendedCourse {
  const scope = getScopedPlaces(selectedRegions);
  const hasAnyFood = selectedFoods.length === 0 || selectedFoods.includes(ANY_FOOD);
  const hasBar = !hasAnyFood && selectedFoods.includes(BAR_CATEGORY);
  const hasOnlyBar = hasBar && selectedFoods.length === 1;
  const hasBarWithOtherFood = hasBar && selectedFoods.some((food) => food !== BAR_CATEGORY);
  const foodPlace = pickFood(scope, selectedFoods);
  const nonBarFoodPlace = pickFood(scope, selectedFoods, { excludeBar: true });
  const barFoodPlace = pickFood(scope, [BAR_CATEGORY], { barOnly: true });
  const activityPlace = pickActivity(scope, selectedActivities);
  const cafePlace = pickCafe(scope);

  if (hasOnlyBar) {
    return { items: [courseItem("activity", "액티비티", activityPlace), courseItem("cafe", "카페", cafePlace), courseItem("food", "식당", barFoodPlace)] };
  }
  if (hasBarWithOtherFood) {
    return { items: [courseItem("food", "식당", nonBarFoodPlace), courseItem("activity", "액티비티", activityPlace), courseItem("cafe", "카페", cafePlace), courseItem("food", "식당", barFoodPlace)] };
  }
  return { items: [courseItem("food", "식당", foodPlace), courseItem("activity", "액티비티", activityPlace), courseItem("cafe", "카페", cafePlace)] };
}

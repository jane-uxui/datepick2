import { places } from "@/data/places";
import type { CourseItem, Place, RecommendedCourse } from "@/types/place";

const courseTitle = "오늘의 데이트 코스 💕";
const defaultShareOrigin = "https://datepick.vercel.app";

const labelByType: Record<Place["type"], string> = {
  food: "식당",
  activity: "액티비티",
  cafe: "카페",
};

function splitItemIds(items: string): string[] {
  return items
    .split(",")
    .map((id) => decodeURIComponent(id.trim()))
    .filter(Boolean);
}

function courseItemFromPlace(place: Place): CourseItem {
  return {
    stepType: place.type,
    label: labelByType[place.type],
    place,
  };
}

export function getCourseItemIds(course: RecommendedCourse): string[] {
  return course.items.map((item) => item.place.id);
}

export function buildCoursePath(course: RecommendedCourse): string {
  const items = getCourseItemIds(course).map(encodeURIComponent).join(",");
  return `/result?items=${items}`;
}

export function buildCourseShareUrl(course: RecommendedCourse, origin?: string): string {
  const baseOrigin = origin || defaultShareOrigin;
  return `${baseOrigin}${buildCoursePath(course)}`;
}

export function courseFromItemIds(items: string): RecommendedCourse | null {
  const ids = splitItemIds(items);
  const foundItems = ids.flatMap((id) => {
    const place = places.find((candidate) => candidate.id === id);
    return place ? [courseItemFromPlace(place)] : [];
  });

  return foundItems.length > 0 ? { items: foundItems } : null;
}

export function getMissingCourseItemIds(items: string): string[] {
  return splitItemIds(items).filter((id) => !places.some((place) => place.id === id));
}

export { courseTitle };
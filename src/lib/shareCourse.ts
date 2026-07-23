import type { Place, RecommendedCourse } from "@/types/place";
import { buildCourseShareUrl } from "@/lib/courseUrl";

const shareTitle = "오늘의 데이트 코스";
const shareHeadline = "오늘의 데이트 코스 💕";

type ShareablePlace = Place & {
  title?: string;
};

function getPlaceName(place: ShareablePlace): string {
  return place.name || place.title || "장소 정보 없음";
}

export function formatPlaceList(course: RecommendedCourse): string {
  return course.items.map((item, index) => `${index + 1}. ${getPlaceName(item.place)}`).join("\n");
}

export function getShareText(course: RecommendedCourse): string {
  return [shareHeadline, formatPlaceList(course)].join("\n\n");
}

export function getClipboardShareText(course: RecommendedCourse, origin?: string): string {
  return [getShareText(course), buildCourseShareUrl(course, origin)].join("\n\n");
}

export async function shareCourse(course: RecommendedCourse): Promise<"shared" | "copied"> {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const url = buildCourseShareUrl(course, origin);
  const text = getShareText(course);

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({
        title: shareTitle,
        text,
        url,
      });
      return "shared";
    } catch {
      // Share cancellation or failure falls through to clipboard copy.
    }
  }

  await navigator.clipboard.writeText(getClipboardShareText(course, origin));
  return "copied";
}
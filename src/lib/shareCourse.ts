import type { RecommendedCourse } from "@/types/place";
import { buildCourseShareUrl, courseTitle } from "@/lib/courseUrl";

export function getShareText(course: RecommendedCourse, origin?: string): string {
  return [courseTitle, buildCourseShareUrl(course, origin)].join("\n");
}

export async function shareCourse(course: RecommendedCourse): Promise<"shared" | "copied"> {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const url = buildCourseShareUrl(course, origin);
  const text = getShareText(course, origin);

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({
        title: courseTitle,
        text: courseTitle,
        url,
      });
      return "shared";
    } catch {
      // Share cancellation or failure falls through to clipboard copy.
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
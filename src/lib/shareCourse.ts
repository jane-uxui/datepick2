import type { RecommendedCourse } from "@/types/place";

export function formatCourseText(course: RecommendedCourse): string {
  return [
    "데이트픽 추천 코스",
    ...course.items.map((item, index) => String(index + 1) + ". " + item.label + " - " + item.place.name),
  ].join("\n");
}

export async function shareCourse(course: RecommendedCourse): Promise<"shared" | "copied"> {
  const text = formatCourseText(course);
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title: "데이트픽 추천 코스", text });
      return "shared";
    } catch {
      // Share cancellation or failure falls through to clipboard copy.
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}

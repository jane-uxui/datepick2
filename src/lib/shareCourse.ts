import type { RecommendedCourse } from "@/types/place";

export function formatCourseText(course: RecommendedCourse): string {
  return [
    "데이트픽 추천 코스",
    `지역: ${course.region}`,
    ...course.items.map((item, index) => `${index + 1}. ${item.label} - ${item.place.name}`),
  ].join("\n");
}

export async function shareCourse(course: RecommendedCourse): Promise<"shared" | "copied"> {
  const text = formatCourseText(course);

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({
        title: "데이트픽 추천 코스",
        text,
      });
      return "shared";
    } catch {
      // 공유 취소나 실패 시 클립보드 복사로 이어갑니다.
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

import type { RecommendedCourse } from "@/types/place";

export function formatCourseText(course: RecommendedCourse): string {
  return [
    "데이트픽 추천 코스",
    `지역: ${course.region}`,
    `1. 식당 - ${course.foodPlace.name}`,
    `2. 할 것 - ${course.activityPlace.name}`,
    `3. 카페 - ${course.cafePlace.name}`,
    "",
    `오늘은 ${course.foodPlace.name}에서 맛있게 시작해볼까요? 배도 든든히 채웠다면 ${course.activityPlace.name}에서 기분 좋게 힐링하고, 마지막은 빠질 수 없는 ${course.cafePlace.name}에서 예쁨까지 가득 채우면 데이트 성공!`,
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

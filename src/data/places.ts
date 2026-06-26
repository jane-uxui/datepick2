import { ACTIVITY_OPTIONS, FOOD_CATEGORIES, REGIONS } from "@/data/options";
import type { Place } from "@/types/place";

const regionSlug: Record<string, string> = {
  "홍대/연남": "hongdae-yeonnam",
  성수: "seongsu",
  강남: "gangnam",
  잠실: "jamsil",
  "이태원/한남": "itaewon-hannam",
  "종로/익선동": "jongno-ikseon",
  송도: "songdo",
  구월동: "guwol",
  "차이나타운/월미도": "chinatown-wolmido",
  부평: "bupyeong",
};

const foodMoodTags: Record<string, string[]> = {
  한식: ["든든한", "정갈한"],
  양식: ["분위기 좋은곳", "파스타"],
  일식: ["깔끔한", "데이트"],
  중식: ["푸짐한", "나눠먹기"],
  분식: ["캐주얼", "가성비"],
  술집: ["저녁데이트", "한잔"],
  고기: ["든든한", "인기"],
  "분위기 좋은곳": ["감성", "기념일"],
};

const activityTagSets = [
  ["산책", "사진"],
  ["전시/문화", "조용한데이트"],
  ["체험/공방", "사진"],
  ["액티비티", "쇼핑"],
  ["야경", "드라이브"],
] as const;

function makeFoodPlaces(region: string): Place[] {
  return FOOD_CATEGORIES.flatMap((category) =>
    [1, 2].map((index) => ({
      id: `${regionSlug[region]}-food-${category}-${index}`,
      name: `${region} ${category} 데이트식당 ${index}`,
      region,
      type: "food" as const,
      foodCategory: category,
      tags: [category, ...foodMoodTags[category]],
      description: `${region}에서 ${category} 메뉴로 가볍게 시작하기 좋은 샘플 식당입니다.`,
      address: `${region} 중심가 ${index}번길`,
    })),
  );
}

function makeActivityPlaces(region: string): Place[] {
  return [1, 2].map((index) => {
    const regionIndex = REGIONS.indexOf(region as (typeof REGIONS)[number]);
    const tags = activityTagSets[(regionIndex + index) % activityTagSets.length];

    return {
      id: `${regionSlug[region]}-activity-${index}`,
      name: `${region} 데이트 스팟 ${index}`,
      region,
      type: "activity" as const,
      tags: [...tags, ACTIVITY_OPTIONS[(index + 2) % ACTIVITY_OPTIONS.length]],
      description: `${region}에서 밥 먹고 들르기 좋은 샘플 데이트 활동 장소입니다.`,
      address: `${region} 데이트로 ${index}구역`,
    };
  });
}

function makeCafePlaces(region: string): Place[] {
  const cafeTags = [
    ["감성카페", "사진", "디저트"],
    ["조용한데이트", "휴식", "커피"],
  ] as const;

  return [1, 2].map((index) => ({
    id: `${regionSlug[region]}-cafe-${index}`,
    name: `${region} 달달카페 ${index}`,
    region,
    type: "cafe" as const,
    tags: [...cafeTags[index - 1]],
    description: `${region} 데이트의 마지막을 편안하게 마무리하기 좋은 샘플 카페입니다.`,
    address: `${region} 카페거리 ${index}`,
  }));
}

export const places: Place[] = REGIONS.flatMap((region) => [
  ...makeFoodPlaces(region),
  ...makeActivityPlaces(region),
  ...makeCafePlaces(region),
]);

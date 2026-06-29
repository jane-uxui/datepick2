import { ACTIVITY_CATEGORIES, FOOD_CATEGORIES, REGIONS } from "@/data/options";
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
  고기: ["든든한", "인기"],
  술집: ["저녁데이트", "한잔"],
  샐러드: ["가벼운", "신선한"],
};

const customFoodTags: Record<string, string> = {
  한식: "노포맛집",
  양식: "데이트맛집",
  일식: "깔끔한맛집",
  중식: "푸짐한맛집",
  분식: "분식맛집",
  고기: "고기맛집",
  술집: "한잔맛집",
  샐러드: "가벼운맛집",
};

const activityTagSets = [
  ["산책", "사진"],
  ["전시/문화", "조용한데이트"],
  ["체험/공방", "사진"],
  ["액티비티", "쇼핑"],
  ["야경", "드라이브"],
] as const;

function makeMapUrl(region: string, name: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(`${region} ${name}`)}`;
}

function makeFoodPlaces(region: string): Place[] {
  return FOOD_CATEGORIES.flatMap((category) =>
    [1, 2].map((index) => {
      const name = `${region} ${category} 데이트식당 ${index}`;

      return {
        id: `${regionSlug[region]}-food-${category}-${index}`,
        name,
        region,
        type: "food" as const,
        foodCategory: category,
        customTag: customFoodTags[category],
        tags: [category, ...foodMoodTags[category]],
        description: `${region}에서 ${category} 메뉴로 가볍게 시작하기 좋은 샘플 식당입니다.`,
        address: `${region} 중심가 ${index}번길`,
        mapUrl: makeMapUrl(region, name),
      };
    }),
  );
}

function makeActivityPlaces(region: string): Place[] {
  return [1, 2].map((index) => {
    const regionIndex = REGIONS.indexOf(region as (typeof REGIONS)[number]);
    const tags = activityTagSets[(regionIndex + index) % activityTagSets.length];
    const activityCategory = ACTIVITY_CATEGORIES[(index + 2) % ACTIVITY_CATEGORIES.length];
    const name = `${region} 데이트 스팟 ${index}`;

    return {
      id: `${regionSlug[region]}-activity-${index}`,
      name,
      region,
      type: "activity" as const,
      activityCategory,
      customTag: `${activityCategory}맛집`,
      tags: [...tags, activityCategory],
      description: `${region}에서 밥 먹고 들르기 좋은 샘플 데이트 활동 장소입니다.`,
      address: `${region} 데이트로 ${index}구역`,
      mapUrl: makeMapUrl(region, name),
    };
  });
}

function makeCafePlaces(region: string): Place[] {
  const cafeTags = [
    ["감성카페", "사진", "디저트"],
    ["조용한데이트", "휴식", "커피"],
  ] as const;

  return [1, 2].map((index) => {
    const name = `${region} 달달카페 ${index}`;

    return {
      id: `${regionSlug[region]}-cafe-${index}`,
      name,
      region,
      type: "cafe" as const,
      customTag: index === 1 ? "분위기좋은" : "디저트맛집",
      tags: [...cafeTags[index - 1]],
      description: `${region} 데이트의 마지막을 편안하게 마무리하기 좋은 샘플 카페입니다.`,
      address: `${region} 카페거리 ${index}`,
      mapUrl: makeMapUrl(region, name),
    };
  });
}

export const places: Place[] = REGIONS.flatMap((region) => [
  ...makeFoodPlaces(region),
  ...makeActivityPlaces(region),
  ...makeCafePlaces(region),
]);

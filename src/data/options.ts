export const ANY_REGION = "아무데나";
export const SEOUL_ALL_REGION = "서울전체";
export const INCHEON_ALL_REGION = "인천전체";
export const ANY_FOOD = "아무거나";
export const ANY_ACTIVITY = "아무거나";

export const SEOUL_REGIONS = [
  "홍대/연남",
  "성수",
  "강남",
  "압구정",
  "잠실",
  "이태원",
  "종로/익선동",
  "여의도",
  "관악구"
] as const;

export const INCHEON_REGIONS = [
  "송도"
] as const;

export const SELECTABLE_REGIONS = [...SEOUL_REGIONS, ...INCHEON_REGIONS] as const;
export const REGIONS = SELECTABLE_REGIONS;

export const FOOD_CATEGORIES = [
  "한식",
  "양식",
  "일식",
  "중식",
  "분식",
  "고기",
  "술집",
  "샐러드"
] as const;

export const FOOD_OPTIONS = [ANY_FOOD, ...FOOD_CATEGORIES] as const;

export const ACTIVITY_CATEGORIES = [
  "산책",
  "전시/문화",
  "체험/공방",
  "액티비티",
  "쇼핑",
  "야경",
  "드라이브",
  "사진"
] as const;

export const ACTIVITY_OPTIONS = [ANY_ACTIVITY, ...ACTIVITY_CATEGORIES] as const;

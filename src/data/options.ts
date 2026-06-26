export const ANY_REGION = "아무데나";
export const ANY_FOOD = "아무거나";

export const SEOUL_REGIONS = [
  "홍대/연남",
  "성수",
  "강남",
  "잠실",
  "이태원/한남",
  "종로/익선동",
] as const;

export const INCHEON_REGIONS = ["송도", "구월동", "차이나타운/월미도", "부평"] as const;

export const REGIONS = [...SEOUL_REGIONS, ...INCHEON_REGIONS] as const;

export const FOOD_CATEGORIES = [
  "한식",
  "양식",
  "일식",
  "중식",
  "분식",
  "술집",
  "고기",
  "분위기 좋은곳",
] as const;

export const FOOD_OPTIONS = [ANY_FOOD, ...FOOD_CATEGORIES] as const;

export const ACTIVITY_OPTIONS = [
  "산책",
  "전시/문화",
  "체험/공방",
  "액티비티",
  "쇼핑",
  "감성카페",
  "야경",
  "드라이브",
  "사진",
  "조용한데이트",
] as const;

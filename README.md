# 데이트픽

지역, 음식 취향, 데이트 유형을 고르면 `식당 -> 할 것 -> 카페` 순서로 데이트 코스를 추천해주는 Next.js MVP입니다.

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- 로컬 TypeScript 데이터 파일

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 빌드

```bash
npm run build
```

## 주요 구조

- `src/app/page.tsx`: 홈, 지역 선택, 음식 선택, 데이트 유형 선택, 추천 결과 화면 흐름
- `src/components`: 단계 레이아웃, 선택 칩, 코스 카드, 하단 액션
- `src/data/places.ts`: 지역별 샘플 장소 데이터
- `src/data/options.ts`: 지역, 음식, 데이트 유형 옵션
- `src/lib/recommendCourse.ts`: 추천 로직
- `src/lib/shareCourse.ts`: Web Share API와 클립보드 fallback
- `src/types/place.ts`: 장소와 추천 결과 타입

## 배포

Vercel에서 Next.js 프로젝트로 바로 연결해 배포할 수 있는 구조입니다.

"use client";

import { useEffect, useState } from "react";
import { BottomActions } from "@/components/BottomActions";
import { CourseRoute } from "@/components/CourseRoute";
import { OptionChip } from "@/components/OptionChip";
import { StepLayout } from "@/components/StepLayout";
import {
  ACTIVITY_CATEGORIES,
  ANY_ACTIVITY,
  ANY_FOOD,
  ANY_REGION,
  FOOD_OPTIONS,
  INCHEON_REGIONS,
  SEOUL_REGIONS,
} from "@/data/options";
import { recommendCourse } from "@/lib/recommendCourse";
import { shareCourse } from "@/lib/shareCourse";
import type { RecommendedCourse } from "@/types/place";

type Screen = "home" | "region" | "food" | "activity" | "result";

const pageBackground =
  "bg-[radial-gradient(circle_at_20%_0%,rgba(255,196,208,0.36),transparent_28rem),linear-gradient(180deg,#fff7f2_0%,#fff1f5_52%,#fff8ed_100%)]";

const primaryButton =
  "min-h-12 flex-1 rounded-xl bg-transparent px-5 py-3 text-base font-black text-[#282424] shadow-[-6px_-6px_12px_rgba(255,255,255,0.7),6px_6px_12px_#E6DADA] transition hover:text-[#f58ca4] disabled:cursor-not-allowed disabled:text-stone-300 disabled:shadow-none";

const previousButton =
  "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-transparent text-xl font-black text-[#5a5050] shadow-[-6px_-6px_12px_rgba(255,255,255,0.7),6px_6px_12px_#E6DADA] transition hover:text-[#f58ca4]";

function toggleExclusiveOption(current: string[], option: string, exclusiveOption: string): string[] {
  if (option === exclusiveOption) {
    return [exclusiveOption];
  }

  const withoutExclusive = current.filter((item) => item !== exclusiveOption);
  return withoutExclusive.includes(option)
    ? withoutExclusive.filter((item) => item !== option)
    : [...withoutExclusive, option];
}

function toggleRegionGroup(current: string[], groupOptions: string[]): string[] {
  const withoutAny = current.filter((item) => item !== ANY_REGION);
  const groupSelected = groupOptions.every((option) => withoutAny.includes(option));

  if (groupSelected) {
    return withoutAny.filter((option) => !groupOptions.includes(option));
  }

  return Array.from(new Set([...withoutAny, ...groupOptions]));
}

const foodStepOptions = [...FOOD_OPTIONS.filter((option) => option !== ANY_FOOD), ANY_FOOD];
const activityStepOptions = [...ACTIVITY_CATEGORIES, ANY_ACTIVITY];

const heroIcons = [
  "/icons/food1.png",
  "/icons/food2.png",
  "/icons/food3.png",
  "/icons/food4.png",
  "/icons/food5.png",
  "/icons/food6.png",
  "/icons/food7.png",
  "/icons/food8.png",
  "/icons/act1.png",
  "/icons/act2.png",
  "/icons/act3.png",
  "/icons/act4.png",
  "/icons/act5.png",
  "/icons/act6.png",
  "/icons/act7.png",
  "/icons/act8.png",
  "/icons/coffee.png",
  "/icons/jajang.png",
];

const activityIconByOption: Partial<Record<string, string>> = {
  산책: "/icons/act1.png",
  "전시/문화": "/icons/act2.png",
  "체험/공방": "/icons/act3.png",
  액티비티: "/icons/act4.png",
  쇼핑: "/icons/act5.png",
  감성카페: "/icons/cafe.png",
  야경: "/icons/act6.png",
  드라이브: "/icons/act7.png",
  사진: "/icons/act8.png",
};


export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [course, setCourse] = useState<RecommendedCourse | null>(null);
  const [toast, setToast] = useState("");
  const [heroIconIndex, setHeroIconIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIconIndex((current) => (current + 1) % heroIcons.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);


  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const createRecommendation = () => {
    setCourse(recommendCourse(selectedRegions, selectedFoods, selectedActivities));
    setScreen("result");
  };

  const resetAll = () => {
    setSelectedRegions([]);
    setSelectedFoods([]);
    setSelectedActivities([]);
    setCourse(null);
    setToast("");
    setScreen("home");
  };

  const handleShare = async () => {
    if (!course) {
      return;
    }

    try {
      const result = await shareCourse(course);
      showToast(result === "shared" ? "공유 창을 열었어요." : "추천 코스를 복사했어요.");
    } catch {
      alert("공유와 복사에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  if (screen === "home") {
    return (
      <main className={`min-h-dvh ${pageBackground} text-[#1f1f1f]`}>
        <section className="mx-auto flex h-dvh w-full max-w-[390px] flex-col px-8 pb-8 pt-[40px] sm:shadow-2xl sm:shadow-rose-100/70">
          <div className="flex justify-end">
            <span className="text-[12px] font-black text-[#ff6f9c]">데이트픽</span>
          </div>

          <div className="mt-[40px]">
            <h1 className="text-[42px] font-black leading-[1.15] tracking-[-0.04em]">
              우리 데이트,
              <br />
              어디 갈까요?
            </h1>
            <p className="mt-6 text-[14px] font-medium leading-6 text-[#2d2929]">
              지역과 취향만 골라봐요 데이트 코스를 추천해드릴게요.
            </p>
          </div>

                    <div className="mt-10 grid h-[210px] place-items-center">
            <img
              key={heroIcons[heroIconIndex]}
              src={heroIcons[heroIconIndex]}
              alt=""
              className="h-16 w-16 object-contain opacity-0 animate-[hero-icon-pop_0.45s_ease-out_forwards]"
            />
          </div>

          <button type="button" onClick={() => setScreen("region")} className={`${primaryButton} mt-10 w-full flex-none`}>
            데이트 코스 만들기
          </button>
        </section>
      </main>
    );
  }

  if (screen === "region") {
    return (
      <StepLayout
        step={1}
        title="어디에서 데이트할까요?"
        description={"지역을 하나 이상 선택해 주세요.\n정하지 못했다면 아무데나를 선택해도 좋아요."}
        actions={
          <BottomActions>
            <button
              type="button"
              className={primaryButton}
              disabled={selectedRegions.length === 0}
              onClick={() => setScreen("food")}
            >
              다음
            </button>
          </BottomActions>
        }
      >
        <div className="space-y-5">
          <OptionGroup
            title="서울"
            options={[...SEOUL_REGIONS]}
            selected={selectedRegions}
            allSelected={SEOUL_REGIONS.every((option) => selectedRegions.includes(option))}
            onSelectAll={() => setSelectedRegions((current) => toggleRegionGroup(current, [...SEOUL_REGIONS]))}
            onSelect={(option) => setSelectedRegions((current) => toggleExclusiveOption(current, option, ANY_REGION))}
          />
          <OptionGroup
            title="인천"
            options={[...INCHEON_REGIONS]}
            selected={selectedRegions}
            allSelected={INCHEON_REGIONS.every((option) => selectedRegions.includes(option))}
            onSelectAll={() => setSelectedRegions((current) => toggleRegionGroup(current, [...INCHEON_REGIONS]))}
            onSelect={(option) => setSelectedRegions((current) => toggleExclusiveOption(current, option, ANY_REGION))}
          />
          <div className="pt-0">
            <OptionChip
              label="장소 정하지 않고 랜덤으로 데이트 가기"
              iconSrc="/icons/location.png"
              selected={selectedRegions.includes(ANY_REGION)}
              onClick={() => setSelectedRegions([ANY_REGION])}
              fullWidth
            />
          </div>
        </div>
      </StepLayout>
    );
  }

  if (screen === "food") {
    return (
      <StepLayout
        step={2}
        title="같이 뭐 먹고싶어요?"
        description={"먹고 싶은 종류를 골라주세요.\n여러 개 선택할 수 있어요."}
        actions={
          <BottomActions>
            <button type="button" className={previousButton} onClick={() => setScreen("region")} aria-label="이전 단계로 이동">
              ←
            </button>
            <button
              type="button"
              className={primaryButton}
              disabled={selectedFoods.length === 0}
              onClick={() => setScreen("activity")}
            >
              다음
            </button>
          </BottomActions>
        }
      >
        <div className="grid grid-cols-3 gap-x-5 gap-y-6">
          {foodStepOptions.map((option, index) => (
            <OptionChip
              key={option}
              label={option}
              iconSrc={option === ANY_FOOD ? "/icons/question.png" : `/icons/food${index + 1}.png`}
              selected={selectedFoods.includes(option)}
              onClick={() => setSelectedFoods((current) => toggleExclusiveOption(current, option, ANY_FOOD))}
            />
          ))}
        </div>
      </StepLayout>
    );
  }

  if (screen === "activity") {
    return (
      <StepLayout
        step={3}
        title="어떤 데이트 하고 싶어요?"
        description={"하고 싶은 데이트 유형을 골라주세요.\n여러 개 선택할 수 있어요."}
        actions={
          <BottomActions>
            <button type="button" className={previousButton} onClick={() => setScreen("food")} aria-label="이전 단계로 이동">
              ←
            </button>
            <button
              type="button"
              className={primaryButton}
              disabled={selectedActivities.length === 0}
              onClick={createRecommendation}
            >
              코스 추천받기
            </button>
          </BottomActions>
        }
      >
        <div className="grid grid-cols-3 gap-x-5 gap-y-6">
          {activityStepOptions.map((option) => (
            <OptionChip
              key={option}
              label={option}
              iconSrc={activityIconByOption[option] ?? "/icons/question.png"}
              selected={selectedActivities.includes(option)}
              onClick={() => setSelectedActivities((current) => toggleExclusiveOption(current, option, ANY_ACTIVITY))}
            />
          ))}
        </div>
      </StepLayout>
    );
  }

  return (
    <main className={`min-h-dvh ${pageBackground} text-[#1f1f1f]`}>
      <section className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-8 pb-7 pt-[40px] sm:shadow-2xl sm:shadow-rose-100/70">
        <div>
          <h1 className="gaegu-text text-[23px] font-bold leading-tight tracking-normal">오늘의 데이트 코스</h1>
          <p className="gaegu-text mt-2 text-[12px] font-normal leading-1 text-[#ff7b9c]">가게 누르면 네이버 지도로 이동해요!</p>
        </div>

        <div className="mt-5 flex-1">
          {course ? <CourseRoute items={course.items} /> : <p className="text-sm font-medium">추천 결과를 다시 만들어 주세요.</p>}
        </div>

        <div className="mt-5 space-y-8">
          <button type="button" className={`${primaryButton} w-full`} onClick={handleShare}>
            공유하기
          </button>
          <div className="grid grid-cols-2 gap-6 px-3">
            <button type="button" className="min-h-10 !text-sm text-[#282424]" onClick={createRecommendation}>
              다시 추천받기
            </button>
            <button type="button" className="min-h-10 !text-sm text-[#282424]" onClick={resetAll}>
              처음으로
            </button>
          </div>
        </div>
      </section>
      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-10 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-center text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function OptionGroup({
  title,
  options,
  selected,
  allSelected,
  onSelectAll,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string[];
  allSelected: boolean;
  onSelectAll: () => void;
  onSelect: (option: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="!text-[12px] font-medium leading-5 text-[#2d2929]">{title}</h2>
      <div className="flex flex-wrap gap-x-3 gap-y-3">
        <OptionChip label="전체" selected={allSelected} onClick={onSelectAll} />
        {options.map((option) => (
          <OptionChip key={option} label={option} selected={selected.includes(option)} onClick={() => onSelect(option)} />
        ))}
      </div>
    </div>
  );
}














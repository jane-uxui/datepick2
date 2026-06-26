"use client";

import { useMemo, useState } from "react";
import { BottomActions } from "@/components/BottomActions";
import { CourseCard } from "@/components/CourseCard";
import { OptionChip } from "@/components/OptionChip";
import { StepLayout } from "@/components/StepLayout";
import {
  ACTIVITY_OPTIONS,
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

const primaryButton =
  "min-h-12 flex-1 rounded-xl bg-white/90 px-5 py-3 text-base font-black text-[#282424] shadow-[0_12px_22px_rgba(94,62,62,0.10)] transition hover:bg-white disabled:cursor-not-allowed disabled:text-stone-300 disabled:shadow-none";

const secondaryButton =
  "min-h-12 flex-1 rounded-xl bg-white/70 px-5 py-3 text-base font-black text-[#5a5050] shadow-[0_10px_18px_rgba(94,62,62,0.08)] transition hover:bg-white";

function toggleExclusiveOption(current: string[], option: string, exclusiveOption: string): string[] {
  if (option === exclusiveOption) {
    return [exclusiveOption];
  }

  const withoutExclusive = current.filter((item) => item !== exclusiveOption);
  return withoutExclusive.includes(option)
    ? withoutExclusive.filter((item) => item !== option)
    : [...withoutExclusive, option];
}

function toggleMultiOption(current: string[], option: string): string[] {
  return current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [course, setCourse] = useState<RecommendedCourse | null>(null);
  const [toast, setToast] = useState("");

  const resultDescription = useMemo(() => {
    if (!course) {
      return "";
    }

    return `오늘은 그럼 🍝 {${course.foodPlace.name}} 에서 배부터 든든히 채워주고, {${course.activityPlace.name}}에서 기분 좋게 힐링🌳한 다음, 마지막은 {${course.cafePlace.name}}에서 달달하게 마무리하면 완벽한 코스예요.`;
  }, [course]);

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
      <main className="flex min-h-dvh items-center px-5 py-8">
        <section className="mx-auto w-full max-w-xl">
          <div className="mb-5 flex justify-end">
            <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-rose-500 shadow-sm">
              데이트픽
            </span>
          </div>
          <div className="rounded-[2rem] bg-white/75 p-6 shadow-xl shadow-rose-100/90 ring-1 ring-white sm:p-8">
            <div className="mb-8 grid h-44 place-items-center rounded-[1.5rem] bg-gradient-to-br from-rose-100 via-white to-amber-100">
              <div className="text-center">
                <p className="text-sm font-black text-rose-400">DATE COURSE PICKER</p>
                <div className="mt-4 text-6xl" aria-hidden="true">
                  ♡
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black leading-tight text-stone-900 sm:text-4xl">오늘 데이트, 어디 갈까요?</h1>
            <p className="mt-4 text-base leading-7 text-stone-500">
              지역과 취향만 고르면 데이트 코스를 추천해드려요.
            </p>
            <button type="button" onClick={() => setScreen("region")} className={`${primaryButton} mt-9 w-full`}>
              데이트 코스 만들기
            </button>
          </div>
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
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            <OptionChip
              label={ANY_REGION}
              selected={selectedRegions.includes(ANY_REGION)}
              onClick={() => setSelectedRegions([ANY_REGION])}
            />
          </div>
          <OptionGroup
            title="서울"
            options={[...SEOUL_REGIONS]}
            selected={selectedRegions}
            onSelect={(option) => setSelectedRegions((current) => toggleExclusiveOption(current, option, ANY_REGION))}
          />
          <OptionGroup
            title="인천"
            options={[...INCHEON_REGIONS]}
            selected={selectedRegions}
            onSelect={(option) => setSelectedRegions((current) => toggleExclusiveOption(current, option, ANY_REGION))}
          />
        </div>
      </StepLayout>
    );
  }

  if (screen === "food") {
    return (
      <StepLayout
        step={2}
        title="오늘은 뭐 먹고 싶어요?"
        description={"먹고 싶은 종류를 골라주세요.\n여러 개 선택할 수 있어요."}
        actions={
          <BottomActions>
            <button type="button" className={secondaryButton} onClick={() => setScreen("region")}>
              이전
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
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          {FOOD_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
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
        title="어떤 데이트를 하고 싶어요?"
        description={"오늘 하고 싶은 데이트 유형을 골라주세요.\n여러 개 선택할 수 있어요."}
        actions={
          <BottomActions>
            <button type="button" className={secondaryButton} onClick={() => setScreen("food")}>
              이전
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
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          {ACTIVITY_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
              selected={selectedActivities.includes(option)}
              onClick={() => setSelectedActivities((current) => toggleMultiOption(current, option))}
            />
          ))}
        </div>
      </StepLayout>
    );
  }

  return (
    <main className="min-h-dvh bg-[#faeeee] text-[#1f1f1f]">
      <section className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-9 pb-7 pt-28 sm:shadow-2xl sm:shadow-rose-100/70">
        <p className="text-[13px] font-medium leading-5">오늘의 데이트 코스</p>
        <h1 className="mt-3 text-[25px] font-medium leading-[1.45] tracking-[-0.02em]">{resultDescription}</h1>

        {course ? (
          <div className="mt-12 space-y-7">
            <CourseCard
              order={1}
              typeLabel="식당"
              helperText="데이트 시작은 맛있는 한 끼부터"
              place={course.foodPlace}
            />
            <CourseCard
              order={2}
              typeLabel="할 것"
              helperText="밥 먹고 가볍게 즐기기 좋아요"
              place={course.activityPlace}
            />
            <CourseCard
              order={3}
              typeLabel="카페"
              helperText="마지막은 달달하게 쉬어가는 코스"
              place={course.cafePlace}
            />
          </div>
        ) : (
          <p className="mt-12 text-sm font-medium">추천 결과를 다시 만들어 주세요.</p>
        )}

        <div className="mt-12 space-y-8">
          <button
            type="button"
            className="min-h-12 w-full rounded-xl bg-white/80 px-5 py-3 text-base font-black text-[#282424] shadow-[0_12px_22px_rgba(94,62,62,0.10)] transition hover:bg-white"
            onClick={handleShare}
          >
            공유하기
          </button>
          <div className="grid grid-cols-2 gap-6 px-3">
            <button type="button" className="min-h-10 text-base font-black text-[#282424]" onClick={createRecommendation}>
              다시 추천받기
            </button>
            <button type="button" className="min-h-10 text-base font-black text-[#282424]" onClick={resetAll}>
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
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string[];
  onSelect: (option: string) => void;
}) {
  return (
    <div className="space-y-4">
      <span className="inline-flex min-h-9 items-center rounded-xl bg-white/80 px-5 py-2 text-[12px] font-semibold text-[#2d2929] shadow-[0_10px_18px_rgba(94,62,62,0.10)] ring-1 ring-white/60">
        {title}
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-4">
        {options.map((option) => (
          <OptionChip key={option} label={option} selected={selected.includes(option)} onClick={() => onSelect(option)} />
        ))}
      </div>
    </div>
  );
}

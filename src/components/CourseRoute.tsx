"use client";

import { useState } from "react";
import type { CourseItem, Place } from "@/types/place";

type CourseRouteProps = {
  items: CourseItem[];
};

const activityIconByCategory: Record<string, string> = {
  산책: "/icons/act1.png",
  "전시/문화": "/icons/act2.png",
  "체험/공방": "/icons/act3.png",
  액티비티: "/icons/act4.png",
  쇼핑: "/icons/act5.png",
  야경: "/icons/act6.png",
  드라이브: "/icons/act7.png",
  사진: "/icons/act8.png",
};

const nodePositions = {
  3: [
    "left-[4px] top-[0px]",
    "left-[118px] top-[138px]",
    "left-[46px] top-[280px]",
  ],
  4: [
    "left-[4px] top-[0px]",
    "left-[24px] top-[140px]",
    "left-[118px] top-[270px]",
    "left-[14px] top-[380px]",
  ],
} as const;

function getIcon(item: CourseItem): { src?: string; fallback: string } {
  if (item.stepType === "cafe") {
    return { src: "/icons/coffee.png", fallback: "☕" };
  }

  if (item.stepType === "activity") {
    return { src: activityIconByCategory[item.place.category], fallback: "🎁" };
  }

  if (item.place.category === "술집") {
    return { src: "/icons/food7.png", fallback: "🍾" };
  }

  return { src: "/icons/food1.png", fallback: "🍚" };
}

function getTagParts(place: Place): string[] {
  const category =
    place.type === "cafe" ? "카페" : place.category;
  const custom = place.customTag ?? place.tags.find((tag) => tag !== category);

  return [place.region, category, custom].filter(Boolean).map((tag) => `#${tag}`);
}

function RouteIcon({ src, fallback }: { src?: string; fallback: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return <span className="block h-10 w-10 text-center text-[32px] leading-10">{fallback}</span>;
  }

  return <img src={src} alt="" className="h-10 w-10 object-contain" onError={() => setFailed(true)} />;
}

function RouteNode({ item, index, position }: { item: CourseItem; index: number; position: string }) {
  const icon = getIcon(item);
  const tags = getTagParts(item.place);
  const clickable = Boolean(item.place.mapUrl);
  const content = (
    <>
      <RouteIcon {...icon} />
      <strong className="gaegu-text mt-3 block max-w-[210px] break-keep text-[24px] font-bold leading-[1.05] tracking-normal text-[#1f1f1f]">
        {item.place.name}
      </strong>
      <span className="gaegu-text mt-2 block max-w-[220px] whitespace-nowrap text-[13px] font-normal leading-4 tracking-normal text-[#241f1f]">
        {tags.join("  ")}
      </span>
    </>
  );

  return (
    <div className={`route-node absolute z-10 ${position}`} style={{ animationDelay: `${0.35 + index * 0.38}s` }}>
      {clickable ? (
        <a href={item.place.mapUrl} target="_blank" rel="noreferrer" className="block text-left">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
}

function RoutePath({ count }: { count: number }) {
  if (count === 4) {
    return (
      <path
        className="route-path"
        d="M -110 20 
           C -48 20 -10 20 24 20 
           C 132 20 242 25 312 78 
           C 396 142 330 160 220 160 
           C 132 160 82 160 44 160 
           C -16 160 0 240 58 265 
           C 86 278 116 285 138 290 
           C 250 310 360 310 350 370 
           C 342 426 173 412 58 400 
           C 8 395 -42 400 -118 410"
      />
    );
  }

  return (
    <path
      className="route-path"
      d="M -110 20 
         C -48 20 -10 20 24 20 
         C 132 20 242 25 312 78 
         C 396 142 330 160 220 160 
         C 160 160 110 160 82 168 
         C 10 188 -18 248 28 286 
         C 38 294 45 298 54 300 
         C 120 310 260 312 505 318"
    />
  );
}

export function CourseRoute({ items }: CourseRouteProps) {
  const count = items.length === 4 ? 4 : 3;
  const positions = nodePositions[count];
  const height = count === 4 ? 540 : 430;

  return (
    <div className="relative" style={{ height }}>
      <svg
        className="pointer-events-none absolute inset-x-[-32px] top-0 h-full w-[calc(100%+64px)]"
        viewBox={`-110 0 615 ${height}`}
        fill="none"
        preserveAspectRatio="none"
      >
        <RoutePath count={count} />
      </svg>
      {items.map((item, index) => (
        <RouteNode key={`${item.place.id}-${index}`} item={item} index={index} position={positions[index]} />
      ))}
    </div>
  );
}









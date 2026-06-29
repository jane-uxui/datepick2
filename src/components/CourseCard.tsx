import type { Place } from "@/types/place";

type CourseCardProps = {
  order: number;
  typeLabel: "식당" | "할 것" | "카페";
  helperText: string;
  place: Place;
};

const typeIcon: Record<CourseCardProps["typeLabel"], string> = {
  식당: "🍚",
  "할 것": "🎡",
  카페: "🥤",
};

export function CourseCard({ typeLabel, place }: CourseCardProps) {
  const tags = place.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ");
  const shortDescription = place.foodCategory
    ? `${place.foodCategory}, ${place.tags.slice(1, 3).join(", ")}`
    : place.description;

  return (
    <article className="font-gaegu space-y-2">
      <div className="text-xl leading-none" aria-hidden="true">
        {typeIcon[typeLabel]}
      </div>
      <div className="grid grid-cols-[minmax(0,175px)_1fr] gap-5">
        <div className="grid h-[105px] place-items-center bg-[#d9d9d9] text-[12px] font-medium text-[#222]">Image</div>
        <div className="min-w-0 pt-1 text-[#1f1f1f]">
          <h2 className="truncate text-[17px] font-medium leading-6">{place.name}</h2>
          <p className="mt-1 line-clamp-1 text-[11px] font-medium leading-5">{shortDescription}</p>
          <p className="mt-2 line-clamp-1 text-[11px] font-medium leading-5">{tags}</p>
          <p className="mt-1 text-[11px] font-medium leading-5">네이버지도 &gt;</p>
        </div>
      </div>
    </article>
  );
}

import type { Place } from "@/types/place";

type CourseCardProps = {
  order: number;
  typeLabel: "\uC2DD\uB2F9" | "\uD560 \uAC83" | "\uCE74\uD398";
  helperText: string;
  place: Place;
};

const typeIcon: Record<CourseCardProps["typeLabel"], string> = {
  "\uC2DD\uB2F9": "\u{1F35A}",
  "\uD560 \uAC83": "\u{1F3A1}",
  "\uCE74\uD398": "\u{1F964}",
};

export function CourseCard({ typeLabel, place }: CourseCardProps) {
  const tags = [place.region, place.category, place.customTag]
    .filter(Boolean)
    .slice(0, 3)
    .map((tag) => "#" + tag)
    .join(" ");
  const shortDescription = [place.category, ...place.tags.filter((tag) => tag !== place.category)]
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

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
          <p className="mt-1 text-[11px] font-medium leading-5">{"\uB124\uC774\uBC84\uC9C0\uB3C4 >"}</p>
        </div>
      </div>
    </article>
  );
}


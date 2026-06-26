type OptionChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionChip({ label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "min-h-9 rounded-xl px-5 py-2 text-[12px] font-semibold transition active:scale-95",
        "shadow-[0_10px_18px_rgba(94,62,62,0.10)]",
        selected
          ? "bg-white text-[#f2aaa9] ring-1 ring-white/80"
          : "bg-white/80 text-[#2d2929] ring-1 ring-white/60 hover:bg-white hover:text-[#f2aaa9]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

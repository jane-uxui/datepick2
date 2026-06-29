type OptionChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  iconSrc?: string;
  iconText?: string;
  fullWidth?: boolean;
};

export function OptionChip({ label, selected, onClick, iconSrc, iconText, fullWidth = false }: OptionChipProps) {
  const hasIcon = Boolean(iconSrc || iconText);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-xl bg-transparent !text-[12px] font-semibold transition active:scale-95",
        selected
          ? "text-[#f58ca4] shadow-[inset_-6px_-6px_12px_#fff,inset_6px_6px_12px_#E6DADA]"
          : "text-[#2d2929] shadow-[-6px_-6px_12px_#fff,6px_6px_12px_#E6DADA] hover:text-[#f58ca4]",
        hasIcon ? "flex h-[92px] w-[92px] flex-col items-center justify-center gap-3 px-3 py-3" : "min-h-9 px-5 py-2",
        fullWidth ? "w-full" : "",
      ].join(" ")}
    >
      {iconSrc ? <img src={iconSrc} alt="" className="h-8 w-8 object-contain" /> : null}
      {!iconSrc && iconText ? <span className="text-[32px] font-medium leading-none">{iconText}</span> : null}
      <span>{label}</span>
    </button>
  );
}

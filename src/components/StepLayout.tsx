import type { ReactNode } from "react";

type StepLayoutProps = {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
  actions: ReactNode;
};

export function StepLayout({ step, title, description, children, actions }: StepLayoutProps) {
  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(255,196,208,0.36),transparent_28rem),linear-gradient(180deg,#fff7f2_0%,#fff1f5_52%,#fff8ed_100%)] text-stone-900">
      <section className="mx-auto flex h-dvh w-full max-w-[390px] flex-col px-[35px] pb-6 pt-4 sm:shadow-2xl sm:shadow-rose-100/70">
        <div className="flex justify-center gap-2" aria-label={`3단계 중 ${step}단계`}>
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={[
                "h-1.5 w-1.5 rounded-full transition",
                dot === step ? "bg-[#f2aaa9]" : "bg-[#f5d7d5]",
              ].join(" ")}
            />
          ))}
        </div>

        <div className="pt-[40px]">
          <h1 className="text-[25px] font-black leading-tight tracking-[-0.01em] text-[#202020]">{title}</h1>
          <p className="mt-5 whitespace-pre-line text-[11px] font-medium leading-tight text-[#363030]">{description}</p>
        </div>

        <div className="mt-9 min-h-0 flex-1">{children}</div>
        {actions}
      </section>
    </main>
  );
}


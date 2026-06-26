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
    <main className="min-h-dvh bg-[#faeeee] text-stone-900">
      <section className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-9 pb-6 pt-14 sm:shadow-2xl sm:shadow-rose-100/70">
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

        <div className="pt-16">
          <h1 className="text-[25px] font-black leading-tight tracking-[-0.01em] text-[#202020]">{title}</h1>
          <p className="mt-5 whitespace-pre-line text-[11px] font-medium leading-5 text-[#363030]">{description}</p>
        </div>

        <div className="mt-16 flex-1">{children}</div>
        {actions}
      </section>
    </main>
  );
}

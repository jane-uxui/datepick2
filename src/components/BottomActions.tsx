import type { ReactNode } from "react";

type BottomActionsProps = {
  children: ReactNode;
};

export function BottomActions({ children }: BottomActionsProps) {
  return <div className="mt-8 flex gap-2 sm:gap-3">{children}</div>;
}

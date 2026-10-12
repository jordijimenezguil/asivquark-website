import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "rounded-[14px] border border-line bg-white p-6 lg:p-7",
        className,
      )}
      {...props}
    />
  );
}

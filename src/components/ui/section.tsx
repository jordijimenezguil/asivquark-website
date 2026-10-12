import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
const spacing = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-[104px]",
  lg: "py-20 sm:py-32",
};
export function Section({
  className,
  space = "md",
  ...props
}: ComponentProps<"section"> & { space?: keyof typeof spacing }) {
  return <section className={cn(spacing[space], className)} {...props} />;
}

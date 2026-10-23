import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn("form-input", className)} />;
}

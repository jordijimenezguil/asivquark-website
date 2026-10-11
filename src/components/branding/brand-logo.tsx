import { cn } from "@/lib/utils";
const sizes = { sm: "text-lg", md: "text-xl sm:text-2xl", lg: "text-3xl" };
export function BrandLogo({
  variant = "dark",
  size = "md",
  className,
}: {
  variant?: "dark" | "light" | "compact";
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-[-0.045em]",
        variant === "light" ? "text-ink" : "text-white",
        sizes[size],
        className,
      )}
      aria-label="ASIVQUARK"
    >
      {variant === "compact" ? (
        <span aria-hidden="true">
          A<span className="text-violet-soft">Q</span>
        </span>
      ) : (
        <span aria-hidden="true">
          ASIV
          <span
            className={variant === "light" ? "text-violet" : "text-violet-soft"}
          >
            QUARK
          </span>
        </span>
      )}
    </span>
  );
}

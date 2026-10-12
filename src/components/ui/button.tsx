import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
const variants = {
  primary: "bg-violet text-white hover:bg-[#6d28d9]",
  secondary: "bg-white text-ink hover:bg-[#eee9fa]",
  outline: "border border-current/25 bg-transparent hover:bg-current/5",
  ghost: "bg-transparent hover:bg-current/5",
};
type Shared = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};
type Props = Shared &
  (
    | (Omit<ComponentProps<"button">, "children" | "className"> & {
        href?: never;
      })
    | (Omit<ComponentProps<typeof Link>, "children" | "className" | "href"> & {
        href: string;
        disabled?: never;
      })
  );
export function Button(props: Props) {
  const { children, variant = "primary", className, ...rest } = props;
  const styles = cn(
    "inline-flex min-h-12 items-center justify-center gap-3 rounded-[10px] px-6 py-3 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45",
    variants[variant],
    className,
  );
  if ("href" in rest && typeof rest.href === "string")
    return (
      <Link {...rest} href={rest.href} className={styles}>
        {children}
      </Link>
    );
  const buttonProps = rest as Omit<
    ComponentProps<"button">,
    "children" | "className"
  >;
  return (
    <button type="button" {...buttonProps} className={styles}>
      {children}
    </button>
  );
}

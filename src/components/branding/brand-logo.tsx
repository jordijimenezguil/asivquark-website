import Image from "next/image";
import { cn } from "@/lib/utils";
export function BrandLogo({ variant = "dark", size = "md", className }: { variant?: "dark" | "light" | "compact"; size?: "sm" | "md" | "lg"; className?: string }) {
 const name = variant === "compact" ? "mark-dark" : size === "lg" ? `horizontal-${variant}` : variant === "light" ? "horizontal-light" : "nav-dark";
 return <Image src={`/brand/asivquark-${name}.svg`} alt="ASIVQUARK" width={name.startsWith("mark") ? 100 : name.startsWith("nav") ? 196 : 300} height={name.startsWith("mark") ? 70 : name.startsWith("nav") ? 24 : 48} className={cn("w-auto", size === "lg" ? "h-10" : "h-6", className)} />;
}

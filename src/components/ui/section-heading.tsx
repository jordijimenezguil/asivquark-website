import { Eyebrow } from "./eyebrow";
import Link from "next/link";
export function SectionHeading({
  label,
  title,
  description,
  titleId,
  href,
  linkLabel,
}: {
  label?: string;
  title: string;
  description?: string;
  titleId?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div className="max-w-3xl">
      {label && <Eyebrow className="mb-5">{label}</Eyebrow>}
      <h2 id={titleId} className="section-title">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">
          {description}
        </p>
      )}
    </div>{href && linkLabel && <Link href={href} className="link-arrow shrink-0 self-start md:self-auto">{linkLabel}</Link>}</div>
  );
}

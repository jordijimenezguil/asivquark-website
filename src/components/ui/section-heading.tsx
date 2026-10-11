export function SectionHeading({
  label,
  title,
  description,
  titleId,
}: {
  label?: string;
  title: string;
  description?: string;
  titleId?: string;
}) {
  return (
    <div className="max-w-2xl">
      {label && <p className="eyebrow mb-5 text-violet">{label}</p>}
      <h2 id={titleId} className="section-title">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

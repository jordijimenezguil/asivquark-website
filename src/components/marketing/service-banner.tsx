import { Container } from "@/components/ui/container";

export function ServiceBanner({ labels }: { labels: string[] }) {
  return (
    <div aria-hidden="true" className="my-6 bg-brand-600 py-4 text-xl font-extrabold text-white md:text-2xl">
      <Container className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
        {labels.map(label => <span key={label}>{label}</span>)}
      </Container>
    </div>
  );
}

import Card from "@/components/ui/Card";

interface PolicySummaryCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

/**
 * Displays a single summary metric from a policy analysis.
 */
export default function PolicySummaryCard({
  title,
  value,
  icon,
  highlight = false,
}: PolicySummaryCardProps) {
  return (
    <Card hover glow={highlight}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${highlight ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]" : "bg-white/5 text-[var(--color-muted)]"}`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)] mb-1">
            {title}
          </p>
          <p className={`text-lg font-semibold ${highlight ? "text-[var(--color-primary)]" : "text-[var(--color-foreground)]"}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

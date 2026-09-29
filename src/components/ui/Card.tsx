import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
  glow = false,
}: CardProps) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm
        ${hover ? "transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl" : ""}
        ${glow ? "shadow-lg shadow-[var(--color-primary)]/5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

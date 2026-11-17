export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 2.5 34 7.5v11c0 9-5.8 15.6-14 19-8.2-3.4-14-10-14-19v-11L20 2.5Z"
        fill="var(--color-ink)"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 19.5c3-4.6 6.5-6.9 10.5-6.9s7.5 2.3 10.5 6.9c-3 4.6-6.5 6.9-10.5 6.9s-7.500-2.300-10.500-6.900Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="19.500" r="3.200" fill="var(--color-gold)" />
    </svg>
  );
}

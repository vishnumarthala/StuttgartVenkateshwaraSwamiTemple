export default function ScrollArrow({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Scroll down indicator"
    >
      {/* Double chevron down */}
      <path
        d="M7 8 L12 13 L17 8"
        stroke="#F4C430"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13 L12 18 L17 13"
        stroke="#F4C430"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

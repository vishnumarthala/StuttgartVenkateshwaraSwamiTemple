export default function Lotus({ className = "w-24 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lotus Divider"
    >
      {/* Center petal */}
      <path
        d="M50 35 C50 25, 45 15, 40 10 C45 15, 50 20, 50 5 C50 20, 55 15, 60 10 C55 15, 50 25, 50 35 Z"
        fill="#F4C430"
        opacity="0.9"
      />

      {/* Left petal */}
      <path
        d="M40 35 C40 28, 35 20, 25 15 C30 18, 35 22, 35 10 C35 22, 38 25, 40 28 Z"
        fill="#F4C430"
        opacity="0.7"
      />

      {/* Right petal */}
      <path
        d="M60 35 C60 28, 65 20, 75 15 C70 18, 65 22, 65 10 C65 22, 62 25, 60 28 Z"
        fill="#F4C430"
        opacity="0.7"
      />

      {/* Far left petal */}
      <path
        d="M30 32 C30 26, 20 22, 10 20 C15 22, 22 24, 25 15 C25 24, 28 28, 30 32 Z"
        fill="#F4C430"
        opacity="0.5"
      />

      {/* Far right petal */}
      <path
        d="M70 32 C70 26, 80 22, 90 20 C85 22, 78 24, 75 15 C75 24, 72 28, 70 32 Z"
        fill="#F4C430"
        opacity="0.5"
      />

      {/* Base */}
      <ellipse cx="50" cy="36" rx="20" ry="3" fill="#F4C430" opacity="0.4" />
    </svg>
  );
}

export default function OmSymbol({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Om Symbol"
    >
      {/* Om Symbol in Devanagari - ॐ */}
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontSize="80"
        fontFamily="serif"
        fill="#F4C430"
        className="select-none"
      >
        ॐ
      </text>
    </svg>
  );
}

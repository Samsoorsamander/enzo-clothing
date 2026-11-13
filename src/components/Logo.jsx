export default function Logo({ size = 40, color = "#1a1a1a" }) {
  return (
    <svg
      width={size * 4}
      height={size}
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Enzo Clothing"
    >
      {/* Letter E */}
      <text
        x="0"
        y="38"
        fontFamily="'Bodoni Moda', serif"
        fontSize="44"
        fontWeight="700"
        fill={color}
        letterSpacing="-2"
      >
        ENZO
      </text>

      {/* Small serif accent dot / signature dot */}
      <circle cx="148" cy="12" r="2.5" fill={color} />
    </svg>
  );
}

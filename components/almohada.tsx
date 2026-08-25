export default function Almohada({
  palabra,
  oculta = false,
}: {
  palabra?: string;
  oculta?: boolean;
}) {
  return (
    <div className="@container relative aspect-[400/330] w-full max-w-[320px]">
      <svg
        viewBox="0 0 400 330"
        className="absolute inset-0 h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="tela" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FBF4E4" />
            <stop offset="100%" stopColor="#DCD2BB" />
          </linearGradient>
        </defs>
        {/* forma de almohada: cuatro lados hinchados */}
        <path
          d="M 48 48 Q 200 12 352 48 Q 388 165 352 282 Q 200 318 48 282 Q 12 165 48 48 Z"
          fill="url(#tela)"
        />
        {/* costura */}
        <path
          d="M 74 74 Q 200 46 326 74 Q 354 165 326 256 Q 200 284 74 256 Q 46 165 74 74 Z"
          fill="none"
          stroke="#0B0E1F"
          strokeOpacity="0.18"
          strokeWidth="2"
          strokeDasharray="7 9"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center px-[15%] text-center">
        {oculta ? (
          <span className="font-[family-name:var(--font-display)] text-[13cqw] italic text-[#0B0E1F]/25">
            z z z
          </span>
        ) : (
          <span className="font-[family-name:var(--font-display)] text-[13cqw] leading-[1.1] text-[#151A33]">
            {palabra}
          </span>
        )}
      </div>
    </div>
  );
}

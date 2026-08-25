"use client";

import { useMemo } from "react";

/** PRNG con semilla fija: mismo cielo en el server y en el browser. */
function semilla(n: number) {
  let s = n;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function CieloNocturno() {
  const estrellas = useMemo(() => {
    const azar = semilla(20260825);
    return Array.from({ length: 70 }, () => ({
      x: azar() * 100,
      y: azar() * 100,
      r: 0.6 + azar() * 1.6,
      delay: azar() * 6,
      dur: 3 + azar() * 5,
    }));
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060F]"
    >
      {/* bruma de horizonte */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_110%,#141B3C_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_85%_-5%,#1D2450_0%,transparent_70%)]" />

      {/* estrellas */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {estrellas.map((e, i) => (
          <circle
            key={i}
            cx={`${e.x}%`}
            cy={`${e.y}%`}
            r={e.r}
            fill="#EFE7D6"
            className="titila"
            style={{ animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s` }}
          />
        ))}
      </svg>

      {/* la luna */}
      <div className="absolute -right-16 -top-16 h-56 w-56 sm:h-72 sm:w-72">
        <div className="absolute inset-0 rounded-full bg-[#FFD23F]/10 blur-3xl" />
        <svg viewBox="0 0 200 200" className="relative h-full w-full">
          <defs>
            <radialGradient id="luna" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#FBF3E2" />
              <stop offset="100%" stopColor="#C8BFA6" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="78" fill="url(#luna)" opacity="0.9" />
          <circle cx="74" cy="78" r="14" fill="#0B0E1F" opacity="0.09" />
          <circle cx="122" cy="112" r="20" fill="#0B0E1F" opacity="0.07" />
          <circle cx="92" cy="140" r="9" fill="#0B0E1F" opacity="0.08" />
          <circle cx="140" cy="66" r="7" fill="#0B0E1F" opacity="0.07" />
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import Almohada from "@/components/almohada";

type Par = { tripulacion: string; impostor: string };
type Fase = "setup" | "reparto" | "ronda" | "votacion" | "resultado";

const RAYO = "⚡";

function mezclar<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function ImpostorLunar({ pares }: { pares: Par[] }) {
  const [fase, setFase] = useState<Fase>("setup");
  const [jugadores, setJugadores] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [rayos, setRayos] = useState(10);

  const [par, setPar] = useState<Par>(pares[0]);
  const [impostor, setImpostor] = useState(0);
  const [orden, setOrden] = useState<number[]>([]);

  const [indice, setIndice] = useState(0);
  const [mostrando, setMostrando] = useState(false);
  const [visto, setVisto] = useState(false);

  const [asignacion, setAsignacion] = useState<number[]>([]);
  const [votos, setVotos] = useState<number[]>([]);
  const [revelado, setRevelado] = useState(false);

  const agregar = () => {
    const limpio = nombre.trim();
    if (!limpio || jugadores.length >= 12) return;
    setJugadores([...jugadores, limpio]);
    setNombre("");
  };

  const arrancar = (lista: string[]) => {
    setPar(pares[Math.floor(Math.random() * pares.length)]);
    setImpostor(Math.floor(Math.random() * lista.length));
    setOrden(mezclar(lista.map((_, i) => i)));
    setVotos(new Array(lista.length).fill(0));
    setAsignacion(new Array(lista.length).fill(0));
    setIndice(0);
    setMostrando(false);
    setVisto(false);
    setRevelado(false);
    setFase("reparto");
  };

  const palabraDe = (i: number) =>
    i === impostor ? par.impostor : par.tripulacion;

  const siguienteReparto = () => {
    setMostrando(false);
    setVisto(false);
    if (indice + 1 >= jugadores.length) {
      setIndice(0);
      setFase("ronda");
    } else {
      setIndice(indice + 1);
    }
  };

  const restantes = rayos - asignacion.reduce((a, b) => a + b, 0);

  const confirmarVoto = () => {
    setVotos(votos.map((v, i) => v + asignacion[i]));
    setAsignacion(new Array(jugadores.length).fill(0));
    setMostrando(false);
    if (indice + 1 >= jugadores.length) {
      setIndice(0);
      setFase("resultado");
    } else {
      setIndice(indice + 1);
    }
  };

  const ranking = useMemo(() => {
    return jugadores
      .map((nom, i) => ({ nom, i, total: votos[i] ?? 0 }))
      .sort((a, b) => b.total - a.total);
  }, [jugadores, votos]);

  const maxVotos = ranking[0]?.total ?? 0;
  const acusados = ranking.filter((r) => r.total === maxVotos && maxVotos > 0);

  /* ---------------- SETUP ---------------- */
  if (fase === "setup") {
    return (
      <Pantalla>
        <p className="text-xs uppercase tracking-[0.3em] text-[#8A8FA3]">
          Base lunar · turno de noche
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-6xl italic leading-[0.9] sm:text-7xl">
          El impostor
          <br />
          lunar
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8A8FA3]">
          La luna reparte una almohada a cada uno con una palabra. Casi todos
          tienen la misma. Uno no. Y ni él lo sabe.
        </p>

        <div className="mt-9 flex justify-center">
          <div className="w-[190px] rotate-[-5deg] opacity-90">
            <Almohada oculta />
          </div>
        </div>

        <div className="mt-9 flex gap-2">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregar()}
            placeholder="Nombre del tripulante"
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base outline-none placeholder:text-[#565B6E] focus:border-[#FFD23F]/60"
          />
          <button
            onClick={agregar}
            className="rounded-full bg-[#FFD23F] px-5 py-3 text-sm font-semibold text-[#05060B] active:scale-95"
          >
            Sumar
          </button>
        </div>

        {jugadores.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {jugadores.map((j, i) => (
              <li key={i}>
                <button
                  onClick={() => setJugadores(jugadores.filter((_, k) => k !== i))}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-[#EFE7D6] active:scale-95"
                >
                  {j} <span className="ml-1 text-[#8A8FA3]">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-[#8A8FA3]">Rayos para repartir por jugador</p>
          <div className="mt-3 flex items-center gap-4">
            <Redondo onClick={() => setRayos(Math.max(1, rayos - 1))}>−</Redondo>
            <span className="font-[family-name:var(--font-display)] text-4xl text-[#FFD23F]">
              {rayos} {RAYO}
            </span>
            <Redondo onClick={() => setRayos(Math.min(30, rayos + 1))}>+</Redondo>
          </div>
        </div>

        <button
          disabled={jugadores.length < 3}
          onClick={() => arrancar(jugadores)}
          className="mt-8 w-full rounded-full bg-[#EFE7D6] py-4 text-base font-semibold text-[#05060B] disabled:opacity-25 active:scale-[0.98]"
        >
          {jugadores.length < 3
            ? `Faltan ${3 - jugadores.length} tripulantes`
            : "Repartir almohadas"}
        </button>
      </Pantalla>
    );
  }

  /* ---------------- REPARTO ---------------- */
  if (fase === "reparto") {
    const quien = jugadores[indice];
    return (
      <Pantalla>
        <Paso texto={`Almohada ${indice + 1} de ${jugadores.length}`} />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl italic leading-tight">
          Pasale el celu a {quien}
        </h2>

        <div className="mt-10 flex select-none flex-col items-center">
          <button
            onPointerDown={() => {
              setMostrando(true);
              setVisto(true);
            }}
            onPointerUp={() => setMostrando(false)}
            onPointerLeave={() => setMostrando(false)}
            onPointerCancel={() => setMostrando(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="flex w-full touch-none justify-center transition-transform active:scale-[0.97]"
          >
            <Almohada palabra={palabraDe(indice)} oculta={!mostrando} />
          </button>
          <p className="mt-7 text-xs uppercase tracking-[0.3em] text-[#8A8FA3]">
            {mostrando ? "Soltá para ocultar" : "Mantené apretada la almohada"}
          </p>
        </div>

        <button
          disabled={!visto}
          onClick={siguienteReparto}
          className="mt-8 w-full rounded-full bg-[#EFE7D6] py-4 text-base font-semibold text-[#05060B] disabled:opacity-25 active:scale-[0.98]"
        >
          {indice + 1 >= jugadores.length ? "Empezar la ronda" : "Listo, pasar"}
        </button>
      </Pantalla>
    );
  }

  /* ---------------- RONDA ---------------- */
  if (fase === "ronda") {
    return (
      <Pantalla>
        <Paso texto="Ronda de palabras" />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl italic leading-tight">
          Uno por uno,
          <br />
          una palabra
          <br />
          relacionada
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-[#8A8FA3]">
          En este orden. Nada de definiciones largas: una sola palabra, y que no
          sea tan obvia.
        </p>

        <ol className="mt-8 space-y-2">
          {orden.map((idx, pos) => (
            <li
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl text-[#FFD23F]">
                {pos + 1}
              </span>
              <span className="text-lg">{jugadores[idx]}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={() => {
            setIndice(0);
            setMostrando(false);
            setAsignacion(new Array(jugadores.length).fill(0));
            setFase("votacion");
          }}
          className="mt-8 w-full rounded-full bg-[#FFD23F] py-4 text-base font-semibold text-[#05060B] active:scale-[0.98]"
        >
          A votar {RAYO}
        </button>
      </Pantalla>
    );
  }

  /* ---------------- VOTACIÓN ---------------- */
  if (fase === "votacion") {
    const quien = jugadores[indice];

    if (!mostrando) {
      return (
        <Pantalla>
          <Paso texto={`Voto ${indice + 1} de ${jugadores.length}`} />
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl italic leading-tight">
            Pasale el celu a {quien}
          </h2>
          <p className="mt-5 text-sm text-[#8A8FA3]">
            Tenés {rayos} {RAYO} para repartir entre los demás. Todos juntos a
            uno, o en pedacitos.
          </p>
          <button
            onClick={() => setMostrando(true)}
            className="mt-10 w-full rounded-full bg-[#EFE7D6] py-4 text-base font-semibold text-[#05060B] active:scale-[0.98]"
          >
            Soy {quien}
          </button>
        </Pantalla>
      );
    }

    return (
      <Pantalla>
        <Paso texto={`${quien} reparte`} />
        <p className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[#FFD23F]">
          {restantes} {RAYO}
        </p>
        <p className="text-sm text-[#8A8FA3]">sin repartir</p>

        <ul className="mt-8 space-y-3">
          {jugadores.map((j, i) =>
            i === indice ? null : (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate text-lg">{j}</span>
                <div className="flex items-center gap-3">
                  <Redondo
                    onClick={() =>
                      setAsignacion(
                        asignacion.map((v, k) =>
                          k === i ? Math.max(0, v - 1) : v,
                        ),
                      )
                    }
                  >
                    −
                  </Redondo>
                  <span className="w-8 text-center text-xl text-[#FFD23F]">
                    {asignacion[i]}
                  </span>
                  <Redondo
                    onClick={() =>
                      restantes > 0 &&
                      setAsignacion(
                        asignacion.map((v, k) => (k === i ? v + 1 : v)),
                      )
                    }
                  >
                    +
                  </Redondo>
                </div>
              </li>
            ),
          )}
        </ul>

        <button
          disabled={restantes !== 0}
          onClick={confirmarVoto}
          className="mt-8 w-full rounded-full bg-[#FFD23F] py-4 text-base font-semibold text-[#05060B] disabled:opacity-25 active:scale-[0.98]"
        >
          {restantes !== 0 ? `Te sobran ${restantes} ${RAYO}` : "Confirmar voto"}
        </button>
      </Pantalla>
    );
  }

  /* ---------------- RESULTADO ---------------- */
  return (
    <Pantalla>
      <Paso texto="Recuento" />
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl italic leading-tight">
        {acusados.length === 1
          ? `Cayó ${acusados[0].nom}`
          : "Empate en la luna"}
      </h2>

      <ul className="mt-8 space-y-3">
        {ranking.map((r) => (
          <li key={r.i}>
            <div className="flex items-baseline justify-between">
              <span className="text-lg">{r.nom}</span>
              <span className="text-sm text-[#FFD23F]">
                {r.total} {RAYO}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#FFD23F]"
                style={{
                  width: `${maxVotos ? (r.total / maxVotos) * 100 : 0}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {!revelado ? (
        <button
          onClick={() => setRevelado(true)}
          className="mt-10 w-full rounded-full bg-[#FFD23F] py-4 text-base font-semibold text-[#05060B] active:scale-[0.98]"
        >
          Que la luna revele
        </button>
      ) : (
        <div className="mt-10 rounded-3xl border border-[#FFD23F]/30 bg-[#FFD23F]/[0.06] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8A8FA3]">
            El impostor era
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-5xl text-[#FFD23F]">
            {jugadores[impostor]}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-3">
              <Almohada palabra={par.tripulacion} />
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8A8FA3]">
                Tripulación
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Almohada palabra={par.impostor} />
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFD23F]">
                Impostor
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => arrancar(jugadores)}
          className="flex-1 rounded-full bg-[#EFE7D6] py-4 text-base font-semibold text-[#05060B] active:scale-[0.98]"
        >
          Otra ronda
        </button>
        <button
          onClick={() => setFase("setup")}
          className="rounded-full border border-white/15 px-6 py-4 text-sm text-[#8A8FA3] active:scale-[0.98]"
        >
          Cambiar equipo
        </button>
      </div>
    </Pantalla>
  );
}

function Pantalla({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-14">{children}</main>
  );
}

function Paso({ texto }: { texto: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.3em] text-[#8A8FA3]">{texto}</p>
  );
}

function Redondo({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-11 w-11 shrink-0 rounded-full border border-white/15 text-xl text-[#EFE7D6] active:scale-90"
    >
      {children}
    </button>
  );
}

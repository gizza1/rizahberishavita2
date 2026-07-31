import { useEffect, useRef } from "react";

export default function VitaGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    // Dynamic import to avoid CRA build issues with Phaser
    import("../game/main").then(({ createGame }) => {
      if (cancelled) return;
      gameRef.current = createGame("vita-game-container");
    });

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1a2a] flex flex-col items-center pt-6">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Vita Milk Rush
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Run, jump, collect milk, and deliver it to the factory!
        </p>
      </div>

      <div
        id="vita-game-container"
        ref={containerRef}
        className="rounded-xl overflow-hidden shadow-2xl border border-white/5"
        style={{ width: "100%", maxWidth: "1280px", aspectRatio: "16/9" }}
      />
    </div>
  );
}

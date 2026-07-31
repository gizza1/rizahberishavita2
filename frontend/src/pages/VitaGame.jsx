import { useEffect, useRef } from "react";

export default function VitaGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    // Dynamic import to avoid CRA build issues with Phaser
    import("../vita-milk-adventure/main").then(({ createVitaMilkAdventure }) => {
      if (cancelled) return;
      gameRef.current = createVitaMilkAdventure("vita-game-container");
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
          Vita Milk Adventure
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The modular Phaser foundation for a fresh 2D platform adventure.
        </p>
      </div>

      <div
        id="vita-game-container"
        ref={containerRef}
        className="vita-milk-adventure rounded-xl overflow-hidden shadow-2xl border border-white/5"
        style={{ width: "100%", maxWidth: "1280px", aspectRatio: "16/9" }}
      />
    </div>
  );
}

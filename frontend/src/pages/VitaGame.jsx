import { useEffect, useRef } from "react";

export default function VitaGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

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
    <div className="min-h-screen w-full bg-[#0a1a2a] pt-20">
      <div
        id="vita-game-container"
        ref={containerRef}
        className="vita-milk-adventure h-[calc(100vh-5rem)] w-full overflow-hidden"
      />
      <button
        type="button"
        onClick={enterFullscreen}
        className="fixed right-4 top-24 z-[1002] rounded-full border border-white/30 bg-[#0a3f83]/80 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-[#0a3f83]"
      >
        Full screen
      </button>
    </div>
  );
}

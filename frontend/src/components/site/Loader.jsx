// Pure-CSS loader (no framer-motion) — robust dismissal, no rAF dependency.
export const Loader = ({ closing }) => {
  return (
    <div
      data-testid="site-loader"
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="mesh-bg absolute inset-0" />
      <div className="relative flex flex-col items-center">
        <div className="loader-drop relative mb-8 h-16 w-16">
          <div
            className="h-16 w-16 bg-gradient-to-br from-vita-blue to-vita-green"
            style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", transform: "rotate(45deg)" }}
          />
        </div>

        <div className="font-display text-5xl font-extrabold tracking-tight text-vita-ink loader-title">
          VITA
        </div>

        <div className="mt-6 h-[3px] w-48 overflow-hidden rounded-full bg-vita-bluelight">
          <div className="loader-bar h-full w-full rounded-full bg-gradient-to-r from-vita-blue to-vita-green" />
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.35em] text-vita-muted">
          Fresh Thinking
        </p>
      </div>
    </div>
  );
};

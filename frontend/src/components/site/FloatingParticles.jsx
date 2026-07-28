import { useMemo } from "react";
import { Droplet } from "lucide-react";

// Floating milk droplets rising up the page background
export const FloatingParticles = ({ count = 14 }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 22,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        opacity: 0.06 + Math.random() * 0.12,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute bottom-[-60px] text-vita-blue"
          style={{
            left: `${d.left}%`,
            opacity: d.opacity,
            animation: `floatUp ${d.duration}s linear ${d.delay}s infinite`,
          }}
        >
          <Droplet style={{ width: d.size, height: d.size }} fill="currentColor" />
        </span>
      ))}
    </div>
  );
};

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, FEATURED_IDS, CATEGORY_THEME } from "../../data/products";
import { MagneticButton } from "./MagneticButton";
import { Eyebrow } from "./Reveal";
import { ProductModal } from "./ProductModal";

const items = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

export const FeaturedSlider = ({ scrollTo }) => {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [selected, setSelected] = useState(null);
  const active = items[i];
  const theme = CATEGORY_THEME[active.category];

  const go = useCallback((next) => {
    setDir(next > i ? 1 : -1);
    setI((next + items.length) % items.length);
  }, [i]);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setI((v) => (v + 1) % items.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-24 transition-[background-color] duration-700 lg:py-32"
      style={{ background: theme.tint }}
      data-testid="featured-slider"
    >
      {/* bubbles */}
      {[...Array(10)].map((_, b) => (
        <motion.span
          key={b}
          className="absolute rounded-full"
          style={{
            left: `${(b * 9 + 5) % 100}%`,
            bottom: -40,
            width: 10 + (b % 4) * 10,
            height: 10 + (b % 4) * 10,
            background: `rgba(${theme.glow}, 0.18)`,
          }}
          animate={{ y: [-0, -600], opacity: [0, 0.6, 0] }}
          transition={{ duration: 8 + (b % 5), repeat: Infinity, delay: b * 0.7, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <Eyebrow num="02">Featured Products</Eyebrow>

        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Text */}
          <div className="order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white"
                  style={{ background: theme.accent }}
                >
                  {active.badge}
                </span>
                <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
                  {active.name}
                </h3>
                <p className="mt-4 max-w-md text-vita-ink/70">{active.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <MagneticButton
                    data-testid="featured-view-details"
                    onClick={() => setSelected(active)}
                    style={{ background: theme.accent }}
                    className="text-white"
                  >
                    View Details
                  </MagneticButton>
                  <MagneticButton variant="glass" data-testid="featured-find-stores" onClick={() => scrollTo("#contact")}>
                    Find in Stores
                  </MagneticButton>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* dots */}
            <div className="mt-10 flex items-center gap-3">
              <button onClick={() => go(i - 1)} data-testid="featured-prev" className="flex h-10 w-10 items-center justify-center rounded-full glass text-vita-ink">
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {items.map((_, d) => (
                  <button
                    key={d}
                    onClick={() => go(d)}
                    data-testid={`featured-dot-${d}`}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: d === i ? 28 : 8, background: d === i ? theme.accent : "rgba(10,31,68,0.2)" }}
                  />
                ))}
              </div>
              <button onClick={() => go(i + 1)} data-testid="featured-next" className="flex h-10 w-10 items-center justify-center rounded-full glass text-vita-ink">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Product image */}
          <div className="relative order-1 flex h-[380px] items-center justify-center md:order-2 md:h-[480px]">
            <div className="absolute h-72 w-72 rounded-full blur-3xl" style={{ background: `rgba(${theme.glow}, 0.3)` }} />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.img
                key={active.id}
                src={active.image}
                alt={active.name}
                custom={dir}
                initial={{ opacity: 0, x: dir * 120, rotate: dir * 8 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: dir * -120, rotate: dir * -8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="shine float-slow relative z-10 max-h-[420px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.2)]"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </section>
  );
};

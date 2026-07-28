import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Milk, Soup, CupSoda, GlassWater, Sandwich, Croissant, Truck, Users, Factory } from "lucide-react";
import { Eyebrow, Reveal } from "./Reveal";
import { IMAGES } from "../../data/content";

const CountUp = ({ to, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
};

const FORMS = [
  { icon: Milk, label: "Fresh Milk" },
  { icon: Soup, label: "Yogurt" },
  { icon: CupSoda, label: "Ayran" },
  { icon: GlassWater, label: "Kos" },
  { icon: Croissant, label: "Cream" },
  { icon: Sandwich, label: "Cheese" },
];

const MINI = [
  { icon: Users, value: 3000, suffix: "+", label: "Partner family farms" },
  { icon: Truck, value: 4, suffix: "h", label: "Chilled collection window" },
  { icon: Factory, value: 1, suffix: "", label: "Modern central dairy" },
];

export const FarmSourcing = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-vita-bluelight/40 py-24 lg:py-32" data-testid="farm-sourcing">
      <div className="blob left-[-6%] top-[15%] h-72 w-72 bg-vita-green/25" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: big stat + copy */}
          <div>
            <Eyebrow num="09">Farm to VITA</Eyebrow>
            <Reveal>
              <div className="flex items-end gap-3">
                <span className="font-display text-7xl font-black leading-none text-gradient sm:text-8xl">
                  <CountUp to={60} suffix="%" />
                </span>
                <span className="mb-3 max-w-[10rem] text-sm font-medium text-vita-muted">
                  of all milk produced in Kosovo is collected by VITA
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-vita-muted">
                Roughly <strong className="text-vita-ink">60% of Kosovo&apos;s milk</strong> starts on the farms
                of our thousands of partner families. We collect it fresh, chill it within hours, and bring it
                to our modern dairy — where it&apos;s carefully processed and transformed into the everyday
                staples you love: fresh milk, yogurt, ayran, kos, cream, cheese and more.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {MINI.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur"
                  >
                    <Icon size={18} className="mb-2 text-vita-blue" />
                    <p className="font-display text-2xl font-extrabold text-vita-ink">
                      <CountUp to={m.value} suffix={m.suffix} />
                    </p>
                    <p className="text-[11px] leading-tight text-vita-muted">{m.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: image + forms grid */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] soft-shadow">
                <img src={IMAGES.cowCalf} alt="Kosovo dairy farm" className="h-[300px] w-full object-cover" />
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-vita-ink/50">
                  One farm, many forms
                </p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {FORMS.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.label}
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
                        data-testid={`farm-form-${i}`}
                        className="cursor-grow group flex flex-col items-center gap-2 rounded-2xl bg-white p-3 soft-shadow transition-transform duration-300 hover:-translate-y-1.5"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vita-greenlight text-vita-green transition-colors duration-300 group-hover:bg-vita-green group-hover:text-white">
                          <Icon size={20} />
                        </span>
                        <span className="text-center text-[11px] font-semibold text-vita-ink">{f.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

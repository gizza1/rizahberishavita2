import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Award, FlaskConical, Microscope } from "lucide-react";
import { STATS, CERTS, IMAGES } from "../../data/content";
import { Eyebrow, Reveal } from "./Reveal";

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1800;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Quality = () => {
  return (
    <section id="quality" className="relative overflow-hidden bg-vita-ink py-24 text-white lg:py-32">
      <div className="blob left-[-5%] top-[10%] h-72 w-72 bg-vita-blue/40" />
      <div className="blob right-[-5%] bottom-[10%] h-80 w-80 bg-vita-green/30" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: lab image + certs */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <img src={IMAGES.lab} alt="Quality laboratory testing" className="h-[420px] w-full object-cover" />
              </div>
              {/* floating cert card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-4 rounded-3xl bg-white p-5 text-vita-ink shadow-2xl sm:-right-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vita-greenlight text-vita-green">
                    <ShieldCheck size={24} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">ISO Certified</p>
                    <p className="text-xs text-vita-muted">Every batch, lab-tested</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="absolute -left-4 top-6 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-vita-ink shadow-xl backdrop-blur"
              >
                <Microscope size={18} className="text-vita-blue" />
                <span className="text-sm font-semibold">100% Purity Checks</span>
              </motion.div>
            </div>
          </Reveal>

          {/* Right: copy + counters */}
          <div>
            <Eyebrow num="04">Quality &amp; Impact</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Trusted by families,
                <span className="block text-gradient">tested by science.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md text-white/70">
                From raw milk intake to the final seal, every VITA product passes rigorous laboratory
                checks. Purity, freshness and safety — guaranteed.
              </p>
            </Reveal>

            {/* certs */}
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-2">
                {CERTS.map((c, idx) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.08 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90"
                  >
                    <Award size={12} className="text-vita-green" /> {c}
                  </motion.span>
                ))}
              </div>
            </Reveal>

            {/* counters */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {STATS.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                  data-testid={`stat-${idx}`}
                >
                  <p className="font-display text-4xl font-extrabold text-white lg:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-white/60">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

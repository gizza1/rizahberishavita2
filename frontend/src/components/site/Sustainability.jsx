import { motion } from "framer-motion";
import { Recycle, TreePine, Droplets, Wind, Leaf } from "lucide-react";
import { IMAGES } from "../../data/content";
import { Eyebrow, Reveal } from "./Reveal";

const STATS = [
  { icon: Recycle, value: "100%", label: "Recyclable packaging by 2027", cls: "bg-vita-greenlight text-vita-green" },
  { icon: TreePine, value: "12k+", label: "Trees planted with farmers", cls: "bg-vita-greenlight text-vita-green" },
  { icon: Droplets, value: "-30%", label: "Water use per litre since 2018", cls: "bg-vita-bluelight text-vita-blue" },
  { icon: Wind, value: "2030", label: "Carbon-neutral dairy goal", cls: "bg-vita-bluelight text-vita-blue" },
];

export const Sustainability = () => {
  return (
    <section id="sustainability" className="relative overflow-hidden bg-gradient-to-b from-white to-vita-greenlight/40 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow num="06">Sustainability</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
                Good for you.
                <span className="block text-gradient">Good for the planet.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md text-vita-muted">
                We believe fresh thinking means caring for the land that feeds us. From reusable
                packaging to regenerative farming, sustainability is churned into everything we do.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    data-testid={`sustain-stat-${i}`}
                    className="cursor-grow rounded-3xl border border-white/60 bg-white/70 p-5 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                  >
                    <motion.span
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, delay: i * 0.5 }}
                      className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${s.cls}`}
                    >
                      <Icon size={22} />
                    </motion.span>
                    <p className="font-display text-3xl font-extrabold text-vita-ink">{s.value}</p>
                    <p className="mt-1 text-xs text-vita-muted">{s.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: nature imagery with growing tree + water drops */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] soft-shadow">
                <img src={IMAGES.leafWater} alt="Water drop on a leaf" className="h-[460px] w-full object-cover" />
              </div>

              {/* animated water drops */}
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="absolute h-3 w-3 rounded-full bg-vita-blue/70"
                  style={{ left: `${25 + d * 25}%`, top: "10%" }}
                  animate={{ y: [0, 340], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: d * 1, ease: "easeIn" }}
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-2xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vita-greenlight text-vita-green">
                  <Leaf size={22} />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-vita-ink">Reusable by 2027</p>
                  <p className="text-xs text-vita-muted">Recyclable &amp; compostable packs</p>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

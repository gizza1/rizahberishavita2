import { useState } from "react";
import { motion } from "framer-motion";
import { TIMELINE, IMAGES } from "../../data/content";
import { Eyebrow, Reveal } from "./Reveal";

export const About = () => {
  const [active, setActive] = useState(TIMELINE.length - 1);

  return (
    <section id="about" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* image */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] soft-shadow">
                <img src={IMAGES.family} alt="Family enjoying VITA dairy" className="h-[480px] w-full object-cover" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -right-4 bottom-8 rounded-3xl bg-vita-blue p-6 text-white shadow-2xl"
              >
                <p className="font-display text-4xl font-extrabold">2003</p>
                <p className="text-sm text-white/80">Est. in Kosovo</p>
              </motion.div>
            </div>
          </Reveal>

          {/* timeline */}
          <div>
            <Eyebrow num="07">Our Story</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
                Two decades of
                <span className="block text-gradient">fresh thinking.</span>
              </h2>
            </Reveal>

            <div className="mt-10 space-y-2">
              {TIMELINE.map((t, i) => {
                const open = active === i;
                return (
                  <button
                    key={t.year}
                    onClick={() => setActive(i)}
                    data-testid={`timeline-${i}`}
                    className="block w-full text-left"
                  >
                    <div className="flex items-start gap-5 border-l-2 pl-5 transition-colors duration-300"
                      style={{ borderColor: open ? "#007BFF" : "rgba(10,31,68,0.1)" }}
                    >
                      <span className={`font-display text-2xl font-extrabold transition-colors duration-300 ${open ? "text-vita-blue" : "text-vita-ink/30"}`}>
                        {t.year}
                      </span>
                      <div className="flex-1 pb-4">
                        <h3 className={`font-display text-lg font-bold transition-colors duration-300 ${open ? "text-vita-ink" : "text-vita-ink/50"}`}>
                          {t.title}
                        </h3>
                        <motion.div
                          initial={false}
                          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-1 text-sm text-vita-muted">{t.text}</p>
                        </motion.div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

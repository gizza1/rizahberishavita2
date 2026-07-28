import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../data/content";
import { Eyebrow } from "./Reveal";

export const Testimonials = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[i];

  return (
    <section className="relative overflow-hidden bg-vita-bluelight/40 py-24 lg:py-32">
      <div className="blob left-[10%] top-[20%] h-64 w-64 bg-vita-blue/20" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-10">
        <div className="flex justify-center">
          <Eyebrow num="08">Loved by Kosovo</Eyebrow>
        </div>

        <div className="relative mt-4 min-h-[280px]">
          <Quote size={64} className="mx-auto text-vita-blue/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              data-testid="testimonial"
            >
              <div className="mb-5 flex justify-center gap-1">
                {[...Array(5)].map((_, s) => (
                  <motion.span
                    key={s}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + s * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  </motion.span>
                ))}
              </div>
              <p className="mx-auto max-w-2xl font-display text-2xl font-medium leading-snug text-vita-ink sm:text-3xl">
                “{t.text}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md" />
                <div className="text-left">
                  <p className="font-semibold text-vita-ink">{t.name}</p>
                  <p className="text-sm text-vita-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              data-testid={`testimonial-dot-${d}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: d === i ? 28 : 8, background: d === i ? "#007BFF" : "rgba(10,31,68,0.2)" }}
              aria-label={`Testimonial ${d + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

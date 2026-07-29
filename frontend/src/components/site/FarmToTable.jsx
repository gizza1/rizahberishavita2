import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import { JOURNEY, IMAGES } from "../../data/content";
import { Eyebrow, Reveal } from "./Reveal";

const Step = ({ step, index, total }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.35"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -60 : 60, 0]);
  const Icon = Icons[step.icon] || Icons.Circle;
  const left = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-6">
      {/* left content */}
      <motion.div style={{ opacity, x }} className={`${left ? "text-right" : "opacity-0 hidden md:block"}`}>
        {left && (
          <div className="ml-auto max-w-xs">
            <h3 className="font-display text-xl font-bold text-vita-ink">{step.title}</h3>
            <p className="mt-1 text-sm text-vita-muted">{step.text}</p>
          </div>
        )}
      </motion.div>

      {/* node */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-vita-blue shadow-[0_16px_40px_-16px_rgba(0,123,255,0.6)]"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-vita-blue/10 to-vita-green/10" />
          <Icon size={26} className="relative z-10" />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-vita-blue text-[11px] font-bold text-white">
            {index + 1}
          </span>
        </motion.div>
      </div>

      {/* right content */}
      <motion.div style={{ opacity, x }} className={`${!left ? "text-left" : "opacity-0 hidden md:block"}`}>
        {!left && (
          <div className="max-w-xs">
            <h3 className="font-display text-xl font-bold text-vita-ink">{step.title}</h3>
            <p className="mt-1 text-sm text-vita-muted">{step.text}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const FarmToTable = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.3"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="farmers" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.5]">
        <img src={IMAGES.cowField} alt="" className="h-full w-full object-cover opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Eyebrow num="04">From Farm to You</Eyebrow>
          </div>
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
              The journey of every drop.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-lg text-vita-muted">
              Eight careful steps connect our grass-fed herds to your kitchen table — nothing rushed, nothing hidden.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* center track */}
          <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-vita-bluelight" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-1/2 top-0 h-full w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-vita-blue to-vita-green"
          />
          <div className="relative">
            {JOURNEY.map((step, i) => (
              <Step key={step.title} step={step} index={i} total={JOURNEY.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import {
  FlaskConical, BarChart3, Microscope, Gauge, Thermometer, Droplets, ShieldCheck, Beaker,
} from "lucide-react";
import { Eyebrow, Reveal } from "./Reveal";

const TESTS = [
  { icon: Thermometer, title: "Intake Temperature", text: "Every tanker is accepted only if the raw milk arrives chilled at ≤ 4°C, locking in freshness from the farm gate." },
  { icon: ShieldCheck, title: "Antibiotic Residue", text: "Each delivery is screened before unloading — zero antibiotic residue is tolerated in VITA milk." },
  { icon: BarChart3, title: "Fat & Protein Analysis", text: "Infrared analysers measure exact fat, protein and solids so every carton meets its declared values." },
  { icon: Microscope, title: "Somatic Cell Count", text: "A key herd-health indicator, kept well below EU limits to guarantee clean, high-quality milk." },
  { icon: Beaker, title: "Total Bacterial Count", text: "Microbial load is measured on every batch to ensure safety and a long, honest shelf life." },
  { icon: Gauge, title: "Acidity & pH", text: "Freshness and stability are confirmed through acidity and pH testing before any processing begins." },
  { icon: Droplets, title: "Adulteration & Added Water", text: "Density and freezing-point tests instantly detect any dilution — you get pure milk, nothing added." },
  { icon: FlaskConical, title: "Aflatoxin M1", text: "Feed-safety toxins are screened in our lab to protect every family that trusts the VITA name." },
];

export const MilkTesting = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32" data-testid="milk-testing">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <Eyebrow num="05">Milk Testing</Eyebrow>
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
              How we test <span className="text-gradient">every drop.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-vita-muted">
              Before a single litre becomes VITA, it passes a full battery of laboratory checks. From the
              moment milk reaches our dairy, these are the tests that keep it pure, safe and honestly fresh.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TESTS.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                data-testid={`milk-test-${i}`}
                whileHover={{ y: -8 }}
                className="cursor-grow group relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-white p-6 soft-shadow"
              >
                <span className="absolute right-4 top-4 font-display text-3xl font-black text-vita-blue/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.span
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-vita-bluelight text-vita-blue transition-colors duration-300 group-hover:bg-vita-blue group-hover:text-white"
                >
                  <Icon size={22} />
                </motion.span>
                <h3 className="font-display text-lg font-bold text-vita-ink">{t.title}</h3>
                <p className="mt-1.5 text-sm text-vita-muted">{t.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

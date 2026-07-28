import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ChefHat, ArrowUpRight } from "lucide-react";
import { RECIPES, RECIPE_FILTERS } from "../../data/content";
import { Eyebrow } from "./Reveal";

export const Recipes = () => {
  const [tab, setTab] = useState("All");
  const list = useMemo(
    () => (tab === "All" ? RECIPES : RECIPES.filter((r) => r.category === tab)),
    [tab]
  );

  return (
    <section id="recipes" className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <Eyebrow num="05">Recipes</Eyebrow>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
            However you cook,
            <span className="block text-gradient">make it VITALICIOUS.</span>
          </h2>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {RECIPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTab(f)}
              data-testid={`recipe-tab-${f.toLowerCase()}`}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                tab === f ? "text-white" : "text-vita-ink/70 hover:text-vita-blue"
              }`}
            >
              {tab === f && (
                <motion.span layoutId="recipe-pill" className="absolute inset-0 rounded-full bg-vita-green" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((r, i) => (
            <motion.article
              layout
              key={r.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              data-testid={`recipe-card-${r.id}`}
              className="group cursor-grow overflow-hidden rounded-[1.75rem] bg-white soft-shadow"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-vita-blue backdrop-blur">
                  {r.category}
                </span>
                <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-vita-blue text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-vita-ink">{r.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-vita-muted">{r.desc}</p>
                <div className="mt-5 flex items-center gap-5 text-xs font-medium text-vita-ink/60">
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-vita-blue" /> {r.time}</span>
                  <span className="flex items-center gap-1.5"><ChefHat size={14} className="text-vita-blue" /> {r.difficulty}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-vita-blue" /> {r.servings}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

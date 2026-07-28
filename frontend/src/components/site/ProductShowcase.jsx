import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, Star } from "lucide-react";
import { PRODUCTS, CATEGORIES, FILTERS, CATEGORY_THEME } from "../../data/products";
import { ProductModal } from "./ProductModal";
import { Eyebrow } from "./Reveal";

const ProductCard = ({ product, onOpen, index }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const theme = CATEGORY_THEME[product.category];

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 12 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      style={{ perspective: 1000 }}
    >
      <button
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        onClick={() => onOpen(product)}
        data-testid={`product-card-${product.id}`}
        className="shine relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white p-5 text-left transition-[box-shadow,transform] duration-300 will-change-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          boxShadow: `0 20px 50px -22px rgba(${theme.glow}, 0.45)`,
        }}
      >
        {/* glow ring on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px rgba(${theme.glow}, 0.6)` }}
        />
        {/* badge */}
        <span
          className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold text-white"
          style={{ background: theme.accent }}
        >
          {product.badge}
        </span>

        {/* image well */}
        <div
          className="relative mb-4 flex h-52 items-center justify-center rounded-2xl"
          style={{ background: `radial-gradient(circle at 50% 55%, ${theme.tint}, #ffffff 78%)` }}
        >
          <span className="absolute bottom-4 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full bg-black/10 blur-md transition-all duration-300 group-hover:w-24 group-hover:opacity-70" />
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="relative z-[1] h-44 w-auto object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-110"
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-vita-blue">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold leading-tight text-vita-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-vita-muted">{product.short}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-vita-ink/60">{product.sizes.join(" · ")}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-vita-blue transition-transform duration-300 group-hover:translate-x-1">
            Learn More <ArrowUpRight size={14} />
          </span>
        </div>
      </button>
    </motion.div>
  );
};

export const ProductShowcase = () => {
  const [cat, setCat] = useState("all");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const byCat = cat === "all" || p.category === cat;
      const byFilter = filter === "all" || p.tags.includes(filter);
      const byQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return byCat && byFilter && byQuery;
    });
  }, [cat, filter, query]);

  return (
    <section id="products" className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <Eyebrow num="01">Product Catalog</Eyebrow>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
            Discover our <span className="text-gradient">delicious</span> range.
          </h2>
          <p className="mt-4 text-vita-muted">
            Real VITA products — milk, yogurt, cheese, butter, cream and drinks. Tap any pack to explore it.
          </p>
        </div>

        {/* search */}
        <div className="relative w-full max-w-xs">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-vita-muted" />
          <input
            data-testid="product-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-vita-ink/10 bg-white py-3.5 pl-11 pr-4 text-sm text-vita-ink outline-none transition-shadow duration-300 focus:shadow-[0_0_0_4px_rgba(0,123,255,0.12)]"
          />
        </div>
      </div>

      {/* category tabs */}
      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            data-testid={`cat-tab-${c.id}`}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              cat === c.id ? "text-white" : "text-vita-ink/70 hover:text-vita-blue"
            }`}
          >
            {cat === c.id && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full bg-vita-blue"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{c.label}</span>
          </button>
        ))}
      </div>

      {/* filter chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-vita-muted">
          <Star size={12} /> Filter
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter((cur) => (cur === f.id ? "all" : f.id))}
            data-testid={`filter-${f.id}`}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-300 ${
              filter === f.id
                ? "border-vita-green bg-vita-greenlight text-vita-green"
                : "border-vita-ink/10 text-vita-ink/60 hover:border-vita-green/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* grid */}
      <motion.div layout className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-vita-muted" data-testid="no-products">
          No products match your search.
        </p>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </section>
  );
};

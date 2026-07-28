import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Package, Snowflake, Leaf } from "lucide-react";
import { CATEGORY_THEME, PRODUCTS } from "../../data/products";
import { MagneticButton } from "./MagneticButton";

export const ProductModal = ({ product, onClose, onSelect }) => {
  const theme = product ? CATEGORY_THEME[product.category] : null;
  const related = product
    ? PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="product-modal"
        >
          <div className="absolute inset-0 bg-vita-ink/40 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl no-scrollbar sm:rounded-[2rem]"
          >
            <button
              onClick={onClose}
              data-testid="product-modal-close"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full glass text-vita-ink transition-transform hover:rotate-90"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="grid gap-0 md:grid-cols-2">
              {/* Image side */}
              <div
                className="relative flex items-center justify-center overflow-hidden p-10"
                style={{ background: `radial-gradient(circle at 50% 40%, ${theme.tint}, #fff 75%)` }}
              >
                <div
                  className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                  style={{ background: `rgba(${theme.glow}, 0.25)` }}
                />
                <motion.img
                  src={product.image}
                  alt={product.name}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="float-slow relative z-10 max-h-[360px] w-auto object-contain drop-shadow-2xl"
                />
                <span
                  className="absolute left-6 top-6 rounded-full px-4 py-1.5 text-xs font-bold text-white"
                  style={{ background: theme.accent }}
                >
                  {product.badge}
                </span>
              </div>

              {/* Details side */}
              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vita-blue">
                  {product.category}
                </p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-vita-ink">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-vita-muted">{product.description}</p>

                {/* Nutrition */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-vita-ink/50">
                    Nutrition (per 100g/ml)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(product.nutrition).map(([k, v]) => (
                      <div key={k} className="rounded-2xl bg-vita-bluelight/60 p-3 text-center">
                        <p className="font-display text-base font-bold text-vita-ink">{v}</p>
                        <p className="text-[10px] uppercase tracking-wide text-vita-muted">{k}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-vita-ink/50">
                    Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <span key={ing} className="inline-flex items-center gap-1 rounded-full bg-vita-greenlight px-3 py-1 text-xs font-medium text-vita-green">
                        <Check size={12} /> {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sizes + storage */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-vita-ink/10 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-vita-ink/50">
                      <Package size={13} /> Sizes
                    </p>
                    <p className="text-sm font-medium text-vita-ink">{product.sizes.join(" · ")}</p>
                  </div>
                  <div className="rounded-2xl border border-vita-ink/10 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-vita-ink/50">
                      <Snowflake size={13} /> Storage
                    </p>
                    <p className="text-xs text-vita-muted">{product.storage}</p>
                  </div>
                </div>

                {product.real && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-vita-green">
                    <Leaf size={12} /> Real VITA product
                  </p>
                )}

                {/* Related */}
                {related.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-vita-ink/50">
                      Related products
                    </p>
                    <div className="flex gap-3">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => onSelect(r)}
                          data-testid={`related-${r.id}`}
                          className="group min-w-0 flex-1 rounded-2xl bg-vita-bg p-2 text-center transition-transform hover:-translate-y-1"
                        >
                          <img src={r.image} alt={r.name} className="mx-auto h-20 w-auto object-contain" />
                          <p className="mt-1 truncate text-[11px] font-medium text-vita-ink">{r.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-7">
                  <MagneticButton data-testid="modal-find-stores" onClick={onClose} className="w-full">
                    Find in Stores
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

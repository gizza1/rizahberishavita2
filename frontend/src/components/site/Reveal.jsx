import { motion } from "framer-motion";

// Scroll reveal wrapper
export const Reveal = ({ children, delay = 0, y = 40, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Word-by-word masked headline reveal
export const SplitText = ({ text, className = "", delay = 0, stagger = 0.08 }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Section eyebrow label
export const Eyebrow = ({ children, num }) => (
  <div className="mb-5 flex items-center gap-3">
    {num && (
      <span className="font-display text-sm font-bold text-vita-blue/40">{num}</span>
    )}
    <span className="h-px w-8 bg-vita-blue/40" />
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-vita-blue">
      {children}
    </span>
  </div>
);

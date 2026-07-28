import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MagneticButton } from "./MagneticButton";
import { IMAGES } from "../../data/content";

const line1 = "Fresh Thinking.";
const line2 = "Fresh Dairy.";

const LineReveal = ({ text, delay }) => (
  <span className="block overflow-hidden">
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  </span>
);

export const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.28]);
  const productY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      {/* Parallax farm background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <img
          src={IMAGES.heroFarm}
          alt="Green rolling hills at sunrise"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
      </motion.div>

      {/* animated blobs */}
      <div className="blob left-[8%] top-[18%] h-72 w-72 bg-vita-blue/30" />
      <div className="blob right-[6%] top-[28%] h-80 w-80 bg-vita-green/25" style={{ animationDelay: "3s" }} />

      {/* floating clouds */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70 blur-2xl"
          style={{ width: 260 - i * 40, height: 90 - i * 12, top: `${12 + i * 9}%`, left: `-20%` }}
          animate={{ x: ["-20%", "130vw"] }}
          transition={{ duration: 48 + i * 16, repeat: Infinity, ease: "linear", delay: i * 6 }}
        />
      ))}

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left copy */}
          <motion.div style={{ y: contentY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-vita-blue"
            >
              <Sparkles size={14} /> Kosovo&apos;s Leading Dairy
            </motion.div>

            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-vita-ink sm:text-6xl lg:text-7xl xl:text-8xl">
              <LineReveal text={line1} delay={0.35} />
              <span className="block text-gradient">
                <LineReveal text={line2} delay={0.5} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-7 max-w-md text-lg font-light text-vita-ink/70"
            >
              From our farms to your family. Honestly fresh milk, yogurt &amp; cream,
              crafted in Kosovo since 2003.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MagneticButton data-testid="hero-explore" onClick={() => navigate("/products")}>
                Explore Products
              </MagneticButton>
              <MagneticButton variant="glass" data-testid="hero-watch" onClick={() => navigate("/about")}>
                <Play size={16} className="fill-vita-blue text-vita-blue" /> Watch Story
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right: floating milk carton with splash */}
          <motion.div style={{ y: productY }} className="relative hidden justify-center lg:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img src={IMAGES.milkSplash} alt="" className="h-[520px] w-[520px] rounded-full object-cover opacity-[0.14] mix-blend-multiply blur-[2px]" />
            </motion.div>
            <div className="absolute left-1/2 top-[62%] h-24 w-56 -translate-x-1/2 rounded-full bg-vita-blue/20 blur-2xl" />
            <motion.img
              src="/products/milk_32.webp"
              alt="Vita Qumësht 3.2%"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="float-slow relative z-10 h-[520px] w-auto drop-shadow-[0_40px_60px_rgba(0,123,255,0.35)]"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* scroll indicator */}
      <motion.button
        onClick={() => navigate("/products")}
        style={{ opacity: fade }}
        data-testid="hero-scroll-indicator"
        className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-vita-ink/60"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-vita-ink/30 p-1">
          <span className="scroll-dot h-2 w-1 rounded-full bg-vita-blue" />
        </span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.button>

      {/* SVG wave divider */}
      <div className="wave-divider absolute bottom-0 left-0 z-[5] w-full">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-[80px] w-full sm:h-[120px]">
          <path fill="#FAFAFA" d="M0,64 C240,120 480,0 720,32 C960,64 1200,128 1440,72 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Toaster } from "sonner";
import "@/App.css";

import { Cursor } from "./components/site/Cursor";
import { Loader } from "./components/site/Loader";
import { FloatingParticles } from "./components/site/FloatingParticles";
import { Navbar } from "./components/site/Navbar";
import { Hero } from "./components/site/Hero";
import { EditorialMarquee } from "./components/site/Marquee";
import { ProductShowcase } from "./components/site/ProductShowcase";
import { FeaturedSlider } from "./components/site/FeaturedSlider";
import { FarmToTable } from "./components/site/FarmToTable";
import { Quality } from "./components/site/Quality";
import { Recipes } from "./components/site/Recipes";
import { Sustainability } from "./components/site/Sustainability";
import { About } from "./components/site/About";
import { Testimonials } from "./components/site/Testimonials";
import { Gallery } from "./components/site/Gallery";
import { Contact } from "./components/site/Contact";
import { Footer } from "./components/site/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const lenisRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, lerp: 0.1 });
    lenisRef.current = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.on("scroll", ({ scroll }) => setShowTop(scroll > 700));
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let removeTimer;
    const finish = () => {
      setClosing(true);
      removeTimer = setTimeout(() => setLoading(false), 600);
    };
    let startTimer;
    if (document.readyState === "complete") {
      startTimer = setTimeout(finish, 800);
    } else {
      window.addEventListener("load", finish);
    }
    const fallback = setTimeout(finish, 2600);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(removeTimer);
      clearTimeout(startTimer);
      clearTimeout(fallback);
    };
  }, []);

  const scrollTo = (sel) => {
    const el = document.querySelector(sel);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80, duration: 1.4 });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-vita-bg">
      <Toaster position="top-center" richColors />
      <Cursor />

      {loading && <Loader closing={closing} />}

      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[950] h-1 origin-left bg-gradient-to-r from-vita-blue to-vita-green"
      />

      <FloatingParticles count={12} />

      <Navbar lenis={lenisRef.current} />

      <main className="relative z-10">
        <Hero scrollTo={scrollTo} />
        <EditorialMarquee />
        <ProductShowcase />
        <FeaturedSlider scrollTo={scrollTo} />
        <FarmToTable />
        <Quality />
        <Recipes />
        <Sustainability />
        <About />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>

      <Footer scrollTo={scrollTo} />

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => scrollTo("#home")}
            data-testid="scroll-top"
            className="fixed bottom-6 right-6 z-[900] flex h-12 w-12 items-center justify-center rounded-full bg-vita-blue text-white shadow-[0_16px_40px_-12px_rgba(0,123,255,0.7)] transition-transform duration-300 hover:-translate-y-1"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

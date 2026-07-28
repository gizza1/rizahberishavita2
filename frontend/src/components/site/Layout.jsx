import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Toaster } from "sonner";
import { Routes, Route, useLocation } from "react-router-dom";

import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { FloatingParticles } from "./FloatingParticles";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import Home from "../../pages/Home";
import Products from "../../pages/Products";
import RecipesPage from "../../pages/RecipesPage";
import AboutPage from "../../pages/AboutPage";
import QualityPage from "../../pages/QualityPage";
import FarmersPage from "../../pages/FarmersPage";
import SustainabilityPage from "../../pages/SustainabilityPage";
import ContactPage from "../../pages/ContactPage";

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className="relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/farmers" element={<FarmersPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

export const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, lerp: 0.1 });
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
    if (document.readyState === "complete") startTimer = setTimeout(finish, 800);
    else window.addEventListener("load", finish);
    const fallback = setTimeout(finish, 2600);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(removeTimer);
      clearTimeout(startTimer);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-vita-bg">
      <Toaster position="bottom-right" richColors />
      <Cursor />

      {loading && <Loader closing={closing} />}

      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[950] h-1 origin-left bg-gradient-to-r from-vita-blue to-vita-green"
      />

      <FloatingParticles count={12} />

      <Navbar />
      <AnimatedRoutes />
      <Footer />

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
};

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MagneticButton } from "./MagneticButton";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Recipes", to: "/recipes" },
  { label: "About", to: "/about" },
  { label: "Quality", to: "/quality" },
  { label: "Farmers", to: "/farmers" },
  { label: "Sustainability", to: "/sustainability" },
  { label: "Contact", to: "/contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = scrolled || location.pathname !== "/";

  return (
    <>
      <motion.header
        data-testid="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[900] transition-[background-color,box-shadow,padding] duration-500 ${
          glass ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <NavLink to="/" data-testid="nav-logo" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vita-blue to-vita-green text-white shadow-[0_8px_20px_-6px_rgba(0,123,255,0.7)]">
              <span className="font-display text-lg font-black">V</span>
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight text-vita-ink">VITA</span>
          </NavLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  data-testid={`nav-${l.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `group relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-vita-blue" : "text-vita-ink/80 hover:text-vita-blue"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={`absolute inset-x-4 bottom-1 h-px origin-left bg-vita-blue transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <MagneticButton onClick={() => navigate("/products")} data-testid="nav-cta" className="px-6 py-3 text-[13px]">
              Explore Products
            </MagneticButton>
          </div>

          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full glass text-vita-ink lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[899] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-vita-ink/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-8 pt-24 shadow-2xl"
            >
              <ul className="flex flex-col gap-1">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      onClick={() => setOpen(false)}
                      data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                      className={({ isActive }) =>
                        `block rounded-2xl px-4 py-3 font-display text-2xl font-bold transition-colors ${
                          isActive ? "bg-vita-bluelight text-vita-blue" : "text-vita-ink hover:bg-vita-bluelight hover:text-vita-blue"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Instagram, Facebook, Youtube, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLS = [
  { title: "Products", links: ["Milk", "Yogurt", "Cream", "Drinks"] },
  { title: "Company", links: ["About", "Quality", "Farmers", "Sustainability"] },
  { title: "Discover", links: ["Recipes", "Gallery", "Contact"] },
];

const ROUTE_FOR = {
  Milk: "/products", Yogurt: "/products", Cream: "/products", Drinks: "/products",
  About: "/about", Quality: "/quality", Farmers: "/farmers", Sustainability: "/sustainability",
  Recipes: "/recipes", Gallery: "/contact", Contact: "/contact",
};

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("You're subscribed! Welcome to VITA.");
      setEmail("");
    } catch (err) {
      if (err?.response?.status === 409) toast.info("You're already subscribed.");
      else toast.error("Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const idFor = (l) => ROUTE_FOR[l] || "/";

  return (
    <footer className="relative overflow-hidden bg-vita-ink text-white">
      <div className="blob left-[15%] top-[-10%] h-72 w-72 bg-vita-blue/30" />
      <div className="blob right-[10%] bottom-[-10%] h-80 w-80 bg-vita-green/25" />

      {/* newsletter */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-20 lg:px-10">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-2 lg:items-center lg:p-12">
          <div>
            <h3 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Fresh news, first.
            </h3>
            <p className="mt-2 text-white/60">Join our newsletter for recipes, drops and VITA stories.</p>
          </div>
          <form onSubmit={subscribe} data-testid="newsletter-form" className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="newsletter-email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm text-white placeholder:text-white/40 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="newsletter-submit"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-vita-ink transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
            </button>
          </form>
        </div>

        {/* links */}
        <div className="mt-16 grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-vita-blue to-vita-green">
                <span className="font-display text-lg font-black">V</span>
              </span>
              <span className="font-display text-2xl font-extrabold">VITA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Fresh Thinking. Fresh Dairy. Kosovo&apos;s leading dairy producer since 2003 — from our
              farms to your family.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="https://www.qumeshtorjavita.com/" target="_blank" rel="noreferrer" data-testid={`footer-social-${i}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-white hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={idFor(l)}
                      onClick={(e) => { e.preventDefault(); navigate(idFor(l)); window.scrollTo(0, 0); }}
                      data-testid={`footer-link-${l.toLowerCase()}`}
                      className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      {l}
                      <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Qumështorja VITA. All rights reserved.</p>
          <p>Fresh from Farm to You · Made in Kosovo</p>
        </div>
      </div>
    </footer>
  );
};

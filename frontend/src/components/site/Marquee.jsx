import Marquee from "react-fast-marquee";
import { Asterisk } from "lucide-react";

const WORDS = ["Fresh Thinking", "Fresh Dairy", "From Farm to You", "Since 2003", "VITALICIOUS", "Made in Kosovo"];

export const EditorialMarquee = () => (
  <div className="relative border-y border-vita-ink/10 bg-vita-ink py-6">
    <Marquee speed={45} gradient={false} className="overflow-hidden">
      {WORDS.concat(WORDS).map((w, i) => (
        <div key={i} className="flex items-center">
          <span className="px-8 font-display text-3xl font-extrabold uppercase tracking-tight text-white/90 sm:text-4xl">
            {w}
          </span>
          <Asterisk className="text-vita-green" size={26} />
        </div>
      ))}
    </Marquee>
  </div>
);

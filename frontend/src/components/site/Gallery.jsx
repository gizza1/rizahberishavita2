import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GALLERY } from "../../data/content";
import { Eyebrow } from "./Reveal";

export const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="mb-12 text-center">
        <div className="flex justify-center">
          <Eyebrow num="09">Gallery</Eyebrow>
        </div>
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
          A taste of <span className="text-gradient">freshness.</span>
        </h2>
      </div>

      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {GALLERY.map((g, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
            onClick={() => setLightbox(g.src)}
            data-testid={`gallery-item-${i}`}
            className="cursor-grow group block w-full overflow-hidden rounded-2xl soft-shadow"
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${g.h === "tall" ? "h-80" : "h-56"}`}
            />
          </motion.button>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {lightbox && (
            <motion.div
              className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              data-testid="gallery-lightbox"
            >
              <div className="absolute inset-0 bg-vita-ink/80 backdrop-blur-md" />
              <button className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full glass text-white" data-testid="lightbox-close">
                <X size={22} />
              </button>
              <motion.img
                src={lightbox}
                alt=""
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[5] max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

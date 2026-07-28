import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Send, MapPin, Mail, Phone, Instagram, Facebook, Loader2 } from "lucide-react";
import { Eyebrow, Reveal } from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 2500);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <section id="contact" className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* left info */}
        <div>
          <Eyebrow num="10">Get in Touch</Eyebrow>
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-vita-ink sm:text-5xl lg:text-6xl">
              Let&apos;s talk
              <span className="block text-gradient">dairy.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-md text-vita-muted">
              Questions, partnerships, or where to find VITA near you — our team is happy to help.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, label: "Prishtinë, Republic of Kosovo" },
              { icon: Mail, label: "info@qumeshtorjavita.com" },
              { icon: Phone, label: "+383 38 000 000" },
            ].map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vita-bluelight text-vita-blue">
                    <Icon size={18} />
                  </span>
                  <span className="text-vita-ink/80">{c.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            {[Instagram, Facebook].map((Icon, idx) => (
              <a
                key={idx}
                href="https://www.qumeshtorjavita.com/"
                target="_blank"
                rel="noreferrer"
                data-testid={`social-${idx}`}
                className="flex h-11 w-11 items-center justify-center rounded-full glass text-vita-ink transition-transform duration-300 hover:-translate-y-1 hover:text-vita-blue"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* map */}
          <div className="mt-8 overflow-hidden rounded-[1.5rem] soft-shadow">
            <iframe
              title="VITA location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.10%2C42.63%2C21.20%2C42.69&layer=mapnik&marker=42.6629%2C21.1655"
              className="h-56 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* right form */}
        <Reveal>
          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="glass rounded-[2rem] p-7 sm:p-9"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-vita-ink/60">Name</label>
                <input {...field("name")} data-testid="contact-name" className="w-full rounded-2xl border border-vita-ink/10 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(0,123,255,0.12)]" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-vita-ink/60">Email</label>
                <input {...field("email")} type="email" data-testid="contact-email" className="w-full rounded-2xl border border-vita-ink/10 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(0,123,255,0.12)]" placeholder="you@email.com" />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-vita-ink/60">Subject</label>
              <input {...field("subject")} data-testid="contact-subject" className="w-full rounded-2xl border border-vita-ink/10 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(0,123,255,0.12)]" placeholder="How can we help?" />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-vita-ink/60">Message</label>
              <textarea {...field("message")} rows={5} data-testid="contact-message" className="w-full resize-none rounded-2xl border border-vita-ink/10 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(0,123,255,0.12)]" placeholder="Write your message…" />
            </div>

            <button
              type="submit"
              disabled={sending}
              data-testid="contact-submit"
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-vita-blue px-8 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(0,123,255,0.6)] transition-[background-color] duration-300 hover:bg-vita-bluedark disabled:opacity-70"
            >
              {sending ? (
                <><Loader2 size={16} className="animate-spin" /> Sending…</>
              ) : sent ? (
                <>Sent ✓</>
              ) : (
                <>Send Message <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" /></>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

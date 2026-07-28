import { useRef } from "react";

// Magnetic + ripple button. Renders as <a> if href given, else <button>.
export const MagneticButton = ({
  children,
  variant = "primary",
  className = "",
  href,
  onClick,
  strength = 0.35,
  ...props
}) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  const makeRipple = (e) => {
    const el = ref.current;
    if (!el) return;
    const circle = document.createElement("span");
    const d = Math.max(el.clientWidth, el.clientHeight);
    const rect = el.getBoundingClientRect();
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${e.clientX - rect.left - d / 2}px`;
    circle.style.top = `${e.clientY - rect.top - d / 2}px`;
    circle.className = "ripple";
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  };

  const variants = {
    primary:
      "bg-vita-blue text-white shadow-[0_16px_40px_-12px_rgba(0,123,255,0.6)] hover:bg-vita-bluedark",
    green:
      "bg-vita-green text-white shadow-[0_16px_40px_-12px_rgba(16,185,129,0.6)] hover:brightness-95",
    glass:
      "glass text-vita-ink hover:bg-white/90",
    dark:
      "bg-vita-ink text-white hover:bg-[#132a5a]",
  };

  const cls = `relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-[background-color,transform,box-shadow] duration-300 will-change-transform ${variants[variant]} ${className}`;

  const inner = (
    <span
      ref={ref}
      className="pointer-events-none relative z-10 inline-flex items-center gap-2 transition-transform duration-300 ease-out"
    >
      {children}
    </span>
  );

  const shared = {
    className: cls,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onMouseDown: makeRipple,
    ...props,
  };

  if (href) {
    return (
      <a href={href} onClick={onClick} {...shared}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} {...shared}>
      {inner}
    </button>
  );
};

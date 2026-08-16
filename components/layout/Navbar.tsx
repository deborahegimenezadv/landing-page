"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, whatsappLink } from "@/lib/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${
        solid
          ? "bg-white shadow-[0_4px_24px_rgba(60,63,78,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-8 lg:h-[76px]">
        <a
          href="#topo"
          onClick={() => setOpen(false)}
          className="flex flex-col leading-none"
        >
          <span
            className={`text-[15px] font-bold tracking-[0.03em] sm:text-[17px] ${
              solid ? "text-navy" : "text-white"
            }`}
          >
            DANTAS GIMENEZ <span className="text-gold">&amp;</span> MACHADO
          </span>
          <span
            className={`mt-1 text-[8px] font-medium tracking-[0.24em] sm:text-[9px] sm:tracking-[0.28em] ${
              solid ? "text-muted" : "text-text-soft"
            }`}
          >
            ADVOCACIA
          </span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                solid ? "text-navy" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            className="rounded-[3px] bg-gold px-[22px] py-[11px] text-[13px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-gold-dark"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className={`flex h-9 w-9 items-center justify-center lg:hidden ${
            solid ? "text-navy" : "text-white"
          }`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`overflow-hidden bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
          open ? "max-h-[420px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 pb-6 pt-2 sm:px-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[3px] px-2 py-3 text-sm font-medium text-navy transition-colors hover:bg-cream hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-[3px] bg-gold px-[22px] py-3 text-center text-[13px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-gold-dark"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-wine-raised px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div className="mx-auto max-w-[780px]">
        <Reveal className="mb-10 text-center sm:mb-14">
          <span className="text-xs font-bold tracking-[0.24em] text-gold">
            PERGUNTAS FREQUENTES
          </span>
          <h2 className="mt-3.5 text-[26px] font-bold sm:text-[34px]">
            Dúvidas comuns
          </h2>
        </Reveal>
        <div data-cinematic="faq-list">
          <Reveal stagger>
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <RevealItem
                  key={faq.question}
                  className="border-b border-line-soft"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-1 py-6 text-left"
                  >
                    <h4 className="m-0 text-base font-semibold">
                      {faq.question}
                    </h4>
                    <span className="relative h-[22px] w-[22px] flex-shrink-0">
                      <span className="absolute left-0 top-1/2 h-0.5 w-[22px] -translate-y-1/2 bg-gold" />
                      <span
                        className={`absolute left-1/2 top-0 h-[22px] w-0.5 -translate-x-1/2 bg-gold transition-opacity duration-[250ms] ${
                          open ? "opacity-0" : "opacity-100"
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height] duration-[400ms] ease-in-out"
                    style={{ maxHeight: open ? "240px" : "0px" }}
                  >
                    <p className="mx-1 mb-6 text-[15px] leading-[1.75] text-muted">
                      {faq.answer}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
